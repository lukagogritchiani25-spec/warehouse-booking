using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WarehouseBooking.API.DTOs;
using WarehouseBooking.API.Services;

namespace WarehouseBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehousesController : ControllerBase
    {
        private readonly IWarehouseService _warehouseService;

        public WarehousesController(IWarehouseService warehouseService)
        {
            _warehouseService = warehouseService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<WarehouseDto>>>> GetAllWarehouses(
            [FromQuery] string? location = null,
            [FromQuery] bool? isActive = null)
        {
            var result = await _warehouseService.GetAllWarehousesAsync(location, isActive);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<WarehouseDto>>> GetWarehouseById(Guid id)
        {
            var result = await _warehouseService.GetWarehouseByIdAsync(id);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpGet("{id}/available-units")]
        public async Task<ActionResult<ApiResponse<List<WarehouseUnitDto>>>> GetAvailableUnits(Guid id)
        {
            var result = await _warehouseService.GetAvailableUnitsAsync(id);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<WarehouseDto>>> CreateWarehouse([FromBody] CreateWarehouseDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<WarehouseDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _warehouseService.CreateWarehouseAsync(createDto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(nameof(GetWarehouseById), new { id = result.Data!.Id }, result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<WarehouseDto>>> UpdateWarehouse(
            Guid id,
            [FromBody] UpdateWarehouseDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<WarehouseDto>.FailureResponse(
                    "Validation failed",
                    ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                ));
            }

            var result = await _warehouseService.UpdateWarehouseAsync(id, updateDto);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteWarehouse(Guid id)
        {
            var result = await _warehouseService.DeleteWarehouseAsync(id);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
    }
}
