using WarehouseBooking.API.DTOs;

namespace WarehouseBooking.API.Services
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto);
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto);
        Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid userId);
        Task<ApiResponse<string>> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto);
        Task<ApiResponse<string>> ResendConfirmationEmailAsync(ResendConfirmationEmailDto resendDto);
        Task<ApiResponse<string>> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
}
