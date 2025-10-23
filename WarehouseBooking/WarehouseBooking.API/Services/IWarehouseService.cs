using WarehouseBooking.API.DTOs;

namespace WarehouseBooking.API.Services
{
    public interface IWarehouseService
    {
        Task<ApiResponse<List<WarehouseDto>>> GetAllWarehousesAsync(string? location = null, bool? isActive = null);
        Task<ApiResponse<WarehouseDto>> GetWarehouseByIdAsync(Guid id);
        Task<ApiResponse<WarehouseDto>> CreateWarehouseAsync(CreateWarehouseDto createDto);
        Task<ApiResponse<WarehouseDto>> UpdateWarehouseAsync(Guid id, UpdateWarehouseDto updateDto);
        Task<ApiResponse<bool>> DeleteWarehouseAsync(Guid id);
        Task<ApiResponse<List<WarehouseUnitDto>>> GetAvailableUnitsAsync(Guid warehouseId);
    }
}
