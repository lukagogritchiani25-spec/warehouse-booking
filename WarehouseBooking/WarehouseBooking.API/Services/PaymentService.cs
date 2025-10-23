using Microsoft.EntityFrameworkCore;
using WarehouseBooking.API.Data;
using WarehouseBooking.API.DTOs;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<PaymentDto>> CreatePaymentAsync(Guid userId, CreatePaymentDto createDto)
        {
            try
            {
                // Verify booking exists and belongs to user
                var booking = await _context.Bookings
                    .FirstOrDefaultAsync(b => b.Id == createDto.BookingId && b.UserId == userId);

                if (booking == null)
                {
                    return ApiResponse<PaymentDto>.FailureResponse("Booking not found or unauthorized");
                }

                if (booking.Status == BookingStatus.Cancelled)
                {
                    return ApiResponse<PaymentDto>.FailureResponse("Cannot make payment for cancelled booking");
                }

                // Validate amount
                if (createDto.Amount <= 0)
                {
                    return ApiResponse<PaymentDto>.FailureResponse("Payment amount must be greater than zero");
                }

                // Check total paid amount
                var totalPaid = await _context.Payments
                    .Where(p => p.BookingId == createDto.BookingId && p.Status == PaymentStatus.Completed)
                    .SumAsync(p => p.Amount);

                if (totalPaid + createDto.Amount > booking.TotalAmount)
                {
                    return ApiResponse<PaymentDto>.FailureResponse("Payment amount exceeds booking total");
                }

                var payment = new Payment
                {
                    Id = Guid.NewGuid(),
                    BookingId = createDto.BookingId,
                    Amount = createDto.Amount,
                    Status = PaymentStatus.Pending,
                    PaymentMethod = createDto.PaymentMethod,
                    TransactionId = createDto.TransactionId,
                    Notes = createDto.Notes,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Payments.Add(payment);

                // Update booking status if payment is being made
                if (booking.Status == BookingStatus.Pending)
                {
                    booking.Status = BookingStatus.Confirmed;
                    booking.UpdatedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                var paymentDto = MapToPaymentDto(payment);
                return ApiResponse<PaymentDto>.SuccessResponse(paymentDto, "Payment created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<PaymentDto>.FailureResponse($"Failed to create payment: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PaymentDto>> GetPaymentByIdAsync(Guid id, Guid userId)
        {
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.Booking)
                    .FirstOrDefaultAsync(p => p.Id == id && p.Booking.UserId == userId);

                if (payment == null)
                {
                    return ApiResponse<PaymentDto>.FailureResponse("Payment not found");
                }

                var paymentDto = MapToPaymentDto(payment);
                return ApiResponse<PaymentDto>.SuccessResponse(paymentDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<PaymentDto>.FailureResponse($"Failed to get payment: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<PaymentDto>>> GetBookingPaymentsAsync(Guid bookingId, Guid userId)
        {
            try
            {
                // Verify booking belongs to user
                var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

                if (booking == null)
                {
                    return ApiResponse<List<PaymentDto>>.FailureResponse("Booking not found or unauthorized");
                }

                var payments = await _context.Payments
                    .Where(p => p.BookingId == bookingId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                var paymentDtos = payments.Select(MapToPaymentDto).ToList();
                return ApiResponse<List<PaymentDto>>.SuccessResponse(paymentDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PaymentDto>>.FailureResponse($"Failed to get booking payments: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PaymentDto>> UpdatePaymentStatusAsync(Guid id, Guid userId, UpdatePaymentDto updateDto)
        {
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.Booking)
                    .FirstOrDefaultAsync(p => p.Id == id && p.Booking.UserId == userId);

                if (payment == null)
                {
                    return ApiResponse<PaymentDto>.FailureResponse("Payment not found");
                }

                if (updateDto.Status.HasValue)
                {
                    payment.Status = updateDto.Status.Value;

                    if (updateDto.Status.Value == PaymentStatus.Completed)
                    {
                        payment.PaymentDate = DateTime.UtcNow;

                        // Check if booking is fully paid
                        var totalPaid = await _context.Payments
                            .Where(p => p.BookingId == payment.BookingId && p.Status == PaymentStatus.Completed)
                            .SumAsync(p => p.Amount);

                        if (totalPaid >= payment.Booking.TotalAmount)
                        {
                            payment.Booking.Status = BookingStatus.Active;
                            payment.Booking.UpdatedAt = DateTime.UtcNow;
                        }
                    }
                }

                if (updateDto.TransactionId != null)
                {
                    payment.TransactionId = updateDto.TransactionId;
                }

                if (updateDto.Notes != null)
                {
                    payment.Notes = updateDto.Notes;
                }

                payment.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var paymentDto = MapToPaymentDto(payment);
                return ApiResponse<PaymentDto>.SuccessResponse(paymentDto, "Payment updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<PaymentDto>.FailureResponse($"Failed to update payment: {ex.Message}");
            }
        }

        private PaymentDto MapToPaymentDto(Payment payment)
        {
            return new PaymentDto
            {
                Id = payment.Id,
                BookingId = payment.BookingId,
                Amount = payment.Amount,
                Status = payment.Status,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                PaymentDate = payment.PaymentDate,
                Notes = payment.Notes,
                CreatedAt = payment.CreatedAt
            };
        }
    }
}
