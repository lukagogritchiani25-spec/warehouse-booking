using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WarehouseBooking.API.DTOs;
using WarehouseBooking.API.Services;

namespace WarehouseBooking.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<BookingSummaryDto>>>> GetUserBookings()
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<List<BookingSummaryDto>>.FailureResponse("Invalid token"));
            }

            var result = await _bookingService.GetUserBookingsAsync(userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<BookingDto>>> GetBookingById(Guid id)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<BookingDto>.FailureResponse("Invalid token"));
            }

            var result = await _bookingService.GetBookingByIdAsync(id, userId);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<BookingDto>>> CreateBooking([FromBody] CreateBookingDto createDto)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<BookingDto>.FailureResponse("Invalid token"));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<BookingDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _bookingService.CreateBookingAsync(userId, createDto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(nameof(GetBookingById), new { id = result.Data!.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<BookingDto>>> UpdateBooking(
            Guid id,
            [FromBody] UpdateBookingDto updateDto)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<BookingDto>.FailureResponse("Invalid token"));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<BookingDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _bookingService.UpdateBookingAsync(id, userId, updateDto);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost("{id}/cancel")]
        public async Task<ActionResult<ApiResponse<bool>>> CancelBooking(Guid id)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<bool>.FailureResponse("Invalid token"));
            }

            var result = await _bookingService.CancelBookingAsync(id, userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("check-availability")]
        public async Task<ActionResult<ApiResponse<bool>>> CheckAvailability(
            [FromQuery] Guid warehouseUnitId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var result = await _bookingService.CheckAvailabilityAsync(warehouseUnitId, startDate, endDate);

            return Ok(result);
        }

        private Guid GetUserId()
        {
            // Try multiple claim types (due to different JWT implementations)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value
                           ?? User.FindFirst("nameid")?.Value;

            return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
        }
    }
}
