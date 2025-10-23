using Microsoft.EntityFrameworkCore;
using WarehouseBooking.API.Data;
using WarehouseBooking.API.DTOs;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<BookingDto>> CreateBookingAsync(Guid userId, CreateBookingDto createDto)
        {
            try
            {
                // Validate dates
                if (createDto.EndDate <= createDto.StartDate)
                {
                    return ApiResponse<BookingDto>.FailureResponse("End date must be after start date");
                }

                if (createDto.StartDate < DateTime.UtcNow)
                {
                    return ApiResponse<BookingDto>.FailureResponse("Start date cannot be in the past");
                }

                // Check if unit exists and is available
                var unit = await _context.WarehouseUnits
                    .Include(u => u.Pricing)
                    .FirstOrDefaultAsync(u => u.Id == createDto.WarehouseUnitId);

                if (unit == null)
                {
                    return ApiResponse<BookingDto>.FailureResponse("Warehouse unit not found");
                }

                if (!unit.IsAvailable || !unit.IsActive)
                {
                    return ApiResponse<BookingDto>.FailureResponse("Warehouse unit is not available");
                }

                // Check for conflicting bookings
                var hasConflict = await _context.Bookings.AnyAsync(b =>
                    b.WarehouseUnitId == createDto.WarehouseUnitId &&
                    b.Status != BookingStatus.Cancelled &&
                    ((b.StartDate <= createDto.StartDate && b.EndDate > createDto.StartDate) ||
                     (b.StartDate < createDto.EndDate && b.EndDate >= createDto.EndDate) ||
                     (b.StartDate >= createDto.StartDate && b.EndDate <= createDto.EndDate))
                );

                if (hasConflict)
                {
                    return ApiResponse<BookingDto>.FailureResponse("Unit is already booked for the selected dates");
                }

                // Calculate total amount based on duration and pricing
                var totalAmount = CalculateTotalAmount(unit, createDto.StartDate, createDto.EndDate);

                var booking = new Booking
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    WarehouseUnitId = createDto.WarehouseUnitId,
                    StartDate = createDto.StartDate,
                    EndDate = createDto.EndDate,
                    Status = BookingStatus.Pending,
                    TotalAmount = totalAmount,
                    Notes = createDto.Notes,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                // Load related data for response
                await _context.Entry(booking).Reference(b => b.User).LoadAsync();
                await _context.Entry(booking).Reference(b => b.WarehouseUnit).LoadAsync();

                var bookingDto = MapToBookingDto(booking);
                return ApiResponse<BookingDto>.SuccessResponse(bookingDto, "Booking created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<BookingDto>.FailureResponse($"Failed to create booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<BookingDto>> GetBookingByIdAsync(Guid id, Guid userId)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.WarehouseUnit)
                        .ThenInclude(u => u.Warehouse)
                    .Include(b => b.Payments)
                    .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

                if (booking == null)
                {
                    return ApiResponse<BookingDto>.FailureResponse("Booking not found");
                }

                var bookingDto = MapToBookingDto(booking);
                return ApiResponse<BookingDto>.SuccessResponse(bookingDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<BookingDto>.FailureResponse($"Failed to get booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<BookingSummaryDto>>> GetUserBookingsAsync(Guid userId)
        {
            try
            {
                var bookings = await _context.Bookings
                    .Include(b => b.WarehouseUnit)
                        .ThenInclude(u => u.Warehouse)
                    .Where(b => b.UserId == userId)
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();

                var bookingSummaries = bookings.Select(b => new BookingSummaryDto
                {
                    Id = b.Id,
                    WarehouseUnitId = b.WarehouseUnitId,
                    WarehouseName = b.WarehouseUnit.Warehouse.Name,
                    UnitNumber = b.WarehouseUnit.UnitNumber,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    Status = b.Status,
                    TotalAmount = b.TotalAmount,
                    CreatedAt = b.CreatedAt
                }).ToList();

                return ApiResponse<List<BookingSummaryDto>>.SuccessResponse(bookingSummaries);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<BookingSummaryDto>>.FailureResponse($"Failed to get user bookings: {ex.Message}");
            }
        }

        public async Task<ApiResponse<BookingDto>> UpdateBookingAsync(Guid id, Guid userId, UpdateBookingDto updateDto)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.WarehouseUnit)
                        .ThenInclude(u => u.Pricing)
                    .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

                if (booking == null)
                {
                    return ApiResponse<BookingDto>.FailureResponse("Booking not found");
                }

                if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled)
                {
                    return ApiResponse<BookingDto>.FailureResponse("Cannot update completed or cancelled bookings");
                }

                var needsAmountRecalculation = false;

                if (updateDto.StartDate.HasValue)
                {
                    if (updateDto.StartDate.Value < DateTime.UtcNow)
                    {
                        return ApiResponse<BookingDto>.FailureResponse("Start date cannot be in the past");
                    }
                    booking.StartDate = updateDto.StartDate.Value;
                    needsAmountRecalculation = true;
                }

                if (updateDto.EndDate.HasValue)
                {
                    if (updateDto.EndDate.Value <= booking.StartDate)
                    {
                        return ApiResponse<BookingDto>.FailureResponse("End date must be after start date");
                    }
                    booking.EndDate = updateDto.EndDate.Value;
                    needsAmountRecalculation = true;
                }

                if (needsAmountRecalculation)
                {
                    // Check for conflicts with new dates
                    var hasConflict = await _context.Bookings.AnyAsync(b =>
                        b.Id != booking.Id &&
                        b.WarehouseUnitId == booking.WarehouseUnitId &&
                        b.Status != BookingStatus.Cancelled &&
                        ((b.StartDate <= booking.StartDate && b.EndDate > booking.StartDate) ||
                         (b.StartDate < booking.EndDate && b.EndDate >= booking.EndDate) ||
                         (b.StartDate >= booking.StartDate && b.EndDate <= booking.EndDate))
                    );

                    if (hasConflict)
                    {
                        return ApiResponse<BookingDto>.FailureResponse("Unit is already booked for the selected dates");
                    }

                    booking.TotalAmount = CalculateTotalAmount(booking.WarehouseUnit, booking.StartDate, booking.EndDate);
                }

                if (updateDto.Status.HasValue)
                {
                    booking.Status = updateDto.Status.Value;
                }

                if (updateDto.Notes != null)
                {
                    booking.Notes = updateDto.Notes;
                }

                booking.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Load related data
                await _context.Entry(booking).Reference(b => b.User).LoadAsync();
                await _context.Entry(booking).Collection(b => b.Payments).LoadAsync();

                var bookingDto = MapToBookingDto(booking);
                return ApiResponse<BookingDto>.SuccessResponse(bookingDto, "Booking updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<BookingDto>.FailureResponse($"Failed to update booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> CancelBookingAsync(Guid id, Guid userId)
        {
            try
            {
                var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

                if (booking == null)
                {
                    return ApiResponse<bool>.FailureResponse("Booking not found");
                }

                if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled)
                {
                    return ApiResponse<bool>.FailureResponse("Cannot cancel completed or already cancelled bookings");
                }

                booking.Status = BookingStatus.Cancelled;
                booking.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResponse(true, "Booking cancelled successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailureResponse($"Failed to cancel booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> CheckAvailabilityAsync(Guid warehouseUnitId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var unit = await _context.WarehouseUnits.FindAsync(warehouseUnitId);

                if (unit == null || !unit.IsAvailable || !unit.IsActive)
                {
                    return ApiResponse<bool>.SuccessResponse(false, "Unit is not available");
                }

                var hasConflict = await _context.Bookings.AnyAsync(b =>
                    b.WarehouseUnitId == warehouseUnitId &&
                    b.Status != BookingStatus.Cancelled &&
                    ((b.StartDate <= startDate && b.EndDate > startDate) ||
                     (b.StartDate < endDate && b.EndDate >= endDate) ||
                     (b.StartDate >= startDate && b.EndDate <= endDate))
                );

                return ApiResponse<bool>.SuccessResponse(!hasConflict, hasConflict ? "Unit is not available for selected dates" : "Unit is available");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailureResponse($"Failed to check availability: {ex.Message}");
            }
        }

        private decimal CalculateTotalAmount(WarehouseUnit unit, DateTime startDate, DateTime endDate)
        {
            var duration = endDate - startDate;
            var totalHours = duration.TotalHours;

            // Find the best pricing option
            var pricing = unit.Pricing
                .Where(p => p.IsActive)
                .OrderBy(p => p.PricingType)
                .ToList();

            decimal totalAmount = 0;

            if (totalHours >= 8760) // 365 days
            {
                var yearlyPrice = pricing.FirstOrDefault(p => p.PricingType == PricingType.Yearly);
                if (yearlyPrice != null)
                {
                    var years = Math.Ceiling(totalHours / 8760);
                    totalAmount = yearlyPrice.Price * (decimal)years;
                    if (yearlyPrice.DiscountPercentage.HasValue)
                    {
                        totalAmount *= (1 - yearlyPrice.DiscountPercentage.Value / 100);
                    }
                    return totalAmount;
                }
            }

            if (totalHours >= 720) // 30 days
            {
                var monthlyPrice = pricing.FirstOrDefault(p => p.PricingType == PricingType.Monthly);
                if (monthlyPrice != null)
                {
                    var months = Math.Ceiling(totalHours / 720);
                    totalAmount = monthlyPrice.Price * (decimal)months;
                    if (monthlyPrice.DiscountPercentage.HasValue)
                    {
                        totalAmount *= (1 - monthlyPrice.DiscountPercentage.Value / 100);
                    }
                    return totalAmount;
                }
            }

            if (totalHours >= 24)
            {
                var dailyPrice = pricing.FirstOrDefault(p => p.PricingType == PricingType.Daily);
                if (dailyPrice != null)
                {
                    var days = Math.Ceiling(totalHours / 24);
                    totalAmount = dailyPrice.Price * (decimal)days;
                    if (dailyPrice.DiscountPercentage.HasValue)
                    {
                        totalAmount *= (1 - dailyPrice.DiscountPercentage.Value / 100);
                    }
                    return totalAmount;
                }
            }

            var hourlyPrice = pricing.FirstOrDefault(p => p.PricingType == PricingType.Hourly);
            if (hourlyPrice != null)
            {
                totalAmount = hourlyPrice.Price * (decimal)Math.Ceiling(totalHours);
                if (hourlyPrice.DiscountPercentage.HasValue)
                {
                    totalAmount *= (1 - hourlyPrice.DiscountPercentage.Value / 100);
                }
                return totalAmount;
            }

            return 0;
        }

        private BookingDto MapToBookingDto(Booking booking)
        {
            return new BookingDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                WarehouseUnitId = booking.WarehouseUnitId,
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                Status = booking.Status,
                TotalAmount = booking.TotalAmount,
                Notes = booking.Notes,
                CreatedAt = booking.CreatedAt,
                User = new UserDto
                {
                    Id = booking.User.Id,
                    FirstName = booking.User.FirstName,
                    LastName = booking.User.LastName,
                    Email = booking.User.Email,
                    PhoneNumber = booking.User.PhoneNumber,
                    Address = booking.User.Address,
                    IsEmailConfirmed = booking.User.IsEmailConfirmed,
                    CreatedAt = booking.User.CreatedAt
                },
                WarehouseUnit = new WarehouseUnitDto
                {
                    Id = booking.WarehouseUnit.Id,
                    WarehouseId = booking.WarehouseUnit.WarehouseId,
                    UnitNumber = booking.WarehouseUnit.UnitNumber,
                    SquareMeters = booking.WarehouseUnit.SquareMeters,
                    Description = booking.WarehouseUnit.Description,
                    IsAvailable = booking.WarehouseUnit.IsAvailable,
                    IsActive = booking.WarehouseUnit.IsActive
                },
                Payments = booking.Payments?.Select(p => new PaymentDto
                {
                    Id = p.Id,
                    BookingId = p.BookingId,
                    Amount = p.Amount,
                    Status = p.Status,
                    PaymentMethod = p.PaymentMethod,
                    TransactionId = p.TransactionId,
                    PaymentDate = p.PaymentDate,
                    Notes = p.Notes,
                    CreatedAt = p.CreatedAt
                }).ToList() ?? new List<PaymentDto>()
            };
        }
    }
}
