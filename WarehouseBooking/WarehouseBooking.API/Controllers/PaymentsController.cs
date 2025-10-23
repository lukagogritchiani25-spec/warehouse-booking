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
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<PaymentDto>>> GetPaymentById(Guid id)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<PaymentDto>.FailureResponse("Invalid token"));
            }

            var result = await _paymentService.GetPaymentByIdAsync(id, userId);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<ApiResponse<List<PaymentDto>>>> GetBookingPayments(Guid bookingId)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<List<PaymentDto>>.FailureResponse("Invalid token"));
            }

            var result = await _paymentService.GetBookingPaymentsAsync(bookingId, userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<PaymentDto>>> CreatePayment([FromBody] CreatePaymentDto createDto)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<PaymentDto>.FailureResponse("Invalid token"));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<PaymentDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _paymentService.CreatePaymentAsync(userId, createDto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(nameof(GetPaymentById), new { id = result.Data!.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<PaymentDto>>> UpdatePaymentStatus(
            Guid id,
            [FromBody] UpdatePaymentDto updateDto)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized(ApiResponse<PaymentDto>.FailureResponse("Invalid token"));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<PaymentDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _paymentService.UpdatePaymentStatusAsync(id, userId, updateDto);

            if (!result.Success)
            {
                return NotFound(result);
            }

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
