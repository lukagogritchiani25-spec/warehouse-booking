using WarehouseBooking.API.DTOs;

namespace WarehouseBooking.API.Services
{
    public interface IBookingService
    {
        Task<ApiResponse<BookingDto>> CreateBookingAsync(Guid userId, CreateBookingDto createDto);
        Task<ApiResponse<BookingDto>> GetBookingByIdAsync(Guid id, Guid userId);
        Task<ApiResponse<List<BookingSummaryDto>>> GetUserBookingsAsync(Guid userId);
        Task<ApiResponse<BookingDto>> UpdateBookingAsync(Guid id, Guid userId, UpdateBookingDto updateDto);
        Task<ApiResponse<bool>> CancelBookingAsync(Guid id, Guid userId);
        Task<ApiResponse<bool>> CheckAvailabilityAsync(Guid warehouseUnitId, DateTime startDate, DateTime endDate);
    }
}
