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

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                    IsEmailConfirmed = false
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

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
    }
}
