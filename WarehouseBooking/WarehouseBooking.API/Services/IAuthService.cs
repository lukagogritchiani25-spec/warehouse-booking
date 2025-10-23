using WarehouseBooking.API.DTOs;

namespace WarehouseBooking.API.Services
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto);
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto);
        Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid userId);
    }
}
