using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WarehouseBooking.API.DTOs;
using WarehouseBooking.API.Services;

namespace WarehouseBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _authService.RegisterAsync(registerDto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _authService.LoginAsync(loginDto);

            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser()
        {
            // Try multiple claim types (due to different JWT implementations)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value
                           ?? User.FindFirst("nameid")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<UserDto>.FailureResponse("Invalid token"));
            }

            var result = await _authService.GetUserByIdAsync(userId);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
    }
}
