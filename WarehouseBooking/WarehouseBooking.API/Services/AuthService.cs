using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WarehouseBooking.API.Data;
using WarehouseBooking.API.DTOs;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Check if user already exists
                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                {
                    return ApiResponse<AuthResponseDto>.FailureResponse("User with this email already exists");
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                // Generate email confirmation token
                var confirmationToken = GenerateSecureToken();
                var tokenExpiry = DateTime.UtcNow.AddHours(24);

                // Create user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    PasswordHash = passwordHash,
                    PhoneNumber = registerDto.PhoneNumber,
                    Address = registerDto.Address,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                    IsEmailConfirmed = false,
                    EmailConfirmationToken = confirmationToken,
                    EmailConfirmationTokenExpiry = tokenExpiry
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Send confirmation email
                var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5000";
                var confirmationLink = $"{baseUrl}/api/auth/confirm-email?token={confirmationToken}&email={user.Email}";
                await _emailService.SendEmailConfirmationAsync(user.Email, user.FirstName, confirmationLink);

                // Generate JWT token
                var token = GenerateJwtToken(user);

                var userDto = MapToUserDto(user);
                var authResponse = new AuthResponseDto
                {
                    Token = token,
                    User = userDto
                };

                return ApiResponse<AuthResponseDto>.SuccessResponse(authResponse, "User registered successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<AuthResponseDto>.FailureResponse($"Registration failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                // Find user by email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null)
                {
                    return ApiResponse<AuthResponseDto>.FailureResponse("Invalid email or password");
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return ApiResponse<AuthResponseDto>.FailureResponse("Invalid email or password");
                }

                // Check if user is active
                if (!user.IsActive)
                {
                    return ApiResponse<AuthResponseDto>.FailureResponse("Account is inactive");
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);

                var userDto = MapToUserDto(user);
                var authResponse = new AuthResponseDto
                {
                    Token = token,
                    User = userDto
                };

                return ApiResponse<AuthResponseDto>.SuccessResponse(authResponse, "Login successful");
            }
            catch (Exception ex)
            {
                return ApiResponse<AuthResponseDto>.FailureResponse($"Login failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return ApiResponse<UserDto>.FailureResponse("User not found");
                }

                var userDto = MapToUserDto(user);
                return ApiResponse<UserDto>.SuccessResponse(userDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserDto>.FailureResponse($"Failed to get user: {ex.Message}");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["Secret"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var expirationMinutes = int.Parse(jwtSettings["ExpirationInMinutes"] ?? "1440");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                IsEmailConfirmed = user.IsEmailConfirmed,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<ApiResponse<string>> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == confirmEmailDto.Email);

                if (user == null)
                {
                    return ApiResponse<string>.FailureResponse("User not found");
                }

                if (user.IsEmailConfirmed)
                {
                    return ApiResponse<string>.FailureResponse("Email is already confirmed");
                }

                if (user.EmailConfirmationToken != confirmEmailDto.Token)
                {
                    return ApiResponse<string>.FailureResponse("Invalid confirmation token");
                }

                if (user.EmailConfirmationTokenExpiry < DateTime.UtcNow)
                {
                    return ApiResponse<string>.FailureResponse("Confirmation token has expired. Please request a new one");
                }

                // Confirm email
                user.IsEmailConfirmed = true;
                user.EmailConfirmationToken = null;
                user.EmailConfirmationTokenExpiry = null;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Send welcome email
                await _emailService.SendWelcomeEmailAsync(user.Email, user.FirstName);

                return ApiResponse<string>.SuccessResponse("Email confirmed successfully", "Email confirmed successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.FailureResponse($"Email confirmation failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> ResendConfirmationEmailAsync(ResendConfirmationEmailDto resendDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == resendDto.Email);

                if (user == null)
                {
                    return ApiResponse<string>.FailureResponse("User not found");
                }

                if (user.IsEmailConfirmed)
                {
                    return ApiResponse<string>.FailureResponse("Email is already confirmed");
                }

                // Generate new confirmation token
                var confirmationToken = GenerateSecureToken();
                var tokenExpiry = DateTime.UtcNow.AddHours(24);

                user.EmailConfirmationToken = confirmationToken;
                user.EmailConfirmationTokenExpiry = tokenExpiry;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Send confirmation email
                var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5000";
                var confirmationLink = $"{baseUrl}/api/auth/confirm-email?token={confirmationToken}&email={user.Email}";
                await _emailService.SendEmailConfirmationAsync(user.Email, user.FirstName, confirmationLink);

                return ApiResponse<string>.SuccessResponse("Confirmation email sent successfully", "Confirmation email sent successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.FailureResponse($"Failed to resend confirmation email: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);

                if (user == null)
                {
                    // For security, don't reveal if email exists
                    return ApiResponse<string>.SuccessResponse("If your email is registered, you will receive a password reset link", "Password reset email sent");
                }

                // Generate password reset token
                var resetToken = GenerateSecureToken();
                var tokenExpiry = DateTime.UtcNow.AddHours(1);

                user.PasswordResetToken = resetToken;
                user.PasswordResetTokenExpiry = tokenExpiry;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Send password reset email
                var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5000";
                var resetLink = $"{baseUrl}/api/auth/reset-password?token={resetToken}&email={user.Email}";
                await _emailService.SendPasswordResetAsync(user.Email, user.FirstName, resetLink);

                return ApiResponse<string>.SuccessResponse("If your email is registered, you will receive a password reset link", "Password reset email sent");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.FailureResponse($"Failed to process password reset request: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

                if (user == null)
                {
                    return ApiResponse<string>.FailureResponse("Invalid reset request");
                }

                if (user.PasswordResetToken != resetPasswordDto.Token)
                {
                    return ApiResponse<string>.FailureResponse("Invalid reset token");
                }

                if (user.PasswordResetTokenExpiry < DateTime.UtcNow)
                {
                    return ApiResponse<string>.FailureResponse("Reset token has expired. Please request a new one");
                }

                // Hash new password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);

                // Update password
                user.PasswordHash = passwordHash;
                user.PasswordResetToken = null;
                user.PasswordResetTokenExpiry = null;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return ApiResponse<string>.SuccessResponse("Password reset successfully", "Password reset successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.FailureResponse($"Password reset failed: {ex.Message}");
            }
        }

        private string GenerateSecureToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray()) + Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
