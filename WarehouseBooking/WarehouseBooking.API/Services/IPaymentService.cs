using WarehouseBooking.API.DTOs;

namespace WarehouseBooking.API.Services
{
    public interface IPaymentService
    {
        Task<ApiResponse<PaymentDto>> CreatePaymentAsync(Guid userId, CreatePaymentDto createDto);
        Task<ApiResponse<PaymentDto>> GetPaymentByIdAsync(Guid id, Guid userId);
        Task<ApiResponse<List<PaymentDto>>> GetBookingPaymentsAsync(Guid bookingId, Guid userId);
        Task<ApiResponse<PaymentDto>> UpdatePaymentStatusAsync(Guid id, Guid userId, UpdatePaymentDto updateDto);
    }
}
