using Microsoft.EntityFrameworkCore;
using WarehouseBooking.API.Data;
using WarehouseBooking.API.DTOs;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.Services
{
    public class WarehouseService : IWarehouseService
    {
        private readonly ApplicationDbContext _context;

        public WarehouseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<WarehouseDto>>> GetAllWarehousesAsync(string? location = null, bool? isActive = null)
        {
            try
            {
                var query = _context.Warehouses
                    .Include(w => w.Units)
                        .ThenInclude(u => u.Pricing)
                    .Include(w => w.Units)
                        .ThenInclude(u => u.Features)
                    .Include(w => w.Media)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(location))
                {
                    query = query.Where(w => w.Location.Contains(location));
                }

                if (isActive.HasValue)
                {
                    query = query.Where(w => w.IsActive == isActive.Value);
                }

                var warehouses = await query.OrderByDescending(w => w.CreatedAt).ToListAsync();
                var warehouseDtos = warehouses.Select(MapToWarehouseDto).ToList();

                return ApiResponse<List<WarehouseDto>>.SuccessResponse(warehouseDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<WarehouseDto>>.FailureResponse($"Failed to get warehouses: {ex.Message}");
            }
        }

        public async Task<ApiResponse<WarehouseDto>> GetWarehouseByIdAsync(Guid id)
        {
            try
            {
                var warehouse = await _context.Warehouses
                    .Include(w => w.Units)
                        .ThenInclude(u => u.Pricing)
                    .Include(w => w.Units)
                        .ThenInclude(u => u.Features)
                    .Include(w => w.Media)
                    .FirstOrDefaultAsync(w => w.Id == id);

                if (warehouse == null)
                {
                    return ApiResponse<WarehouseDto>.FailureResponse("Warehouse not found");
                }

                var warehouseDto = MapToWarehouseDto(warehouse);
                return ApiResponse<WarehouseDto>.SuccessResponse(warehouseDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<WarehouseDto>.FailureResponse($"Failed to get warehouse: {ex.Message}");
            }
        }

        public async Task<ApiResponse<WarehouseDto>> CreateWarehouseAsync(CreateWarehouseDto createDto)
        {
            try
            {
                var warehouse = new Warehouse
                {
                    Id = Guid.NewGuid(),
                    Name = createDto.Name,
                    Location = createDto.Location,
                    Address = createDto.Address,
                    Description = createDto.Description,
                    Latitude = createDto.Latitude,
                    Longitude = createDto.Longitude,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Warehouses.Add(warehouse);
                await _context.SaveChangesAsync();

                var warehouseDto = MapToWarehouseDto(warehouse);
                return ApiResponse<WarehouseDto>.SuccessResponse(warehouseDto, "Warehouse created successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<WarehouseDto>.FailureResponse($"Failed to create warehouse: {ex.Message}");
            }
        }

        public async Task<ApiResponse<WarehouseDto>> UpdateWarehouseAsync(Guid id, UpdateWarehouseDto updateDto)
        {
            try
            {
                var warehouse = await _context.Warehouses.FindAsync(id);

                if (warehouse == null)
                {
                    return ApiResponse<WarehouseDto>.FailureResponse("Warehouse not found");
                }

                if (!string.IsNullOrEmpty(updateDto.Name))
                    warehouse.Name = updateDto.Name;

                if (!string.IsNullOrEmpty(updateDto.Location))
                    warehouse.Location = updateDto.Location;

                if (!string.IsNullOrEmpty(updateDto.Address))
                    warehouse.Address = updateDto.Address;

                if (updateDto.Description != null)
                    warehouse.Description = updateDto.Description;

                if (updateDto.Latitude.HasValue)
                    warehouse.Latitude = updateDto.Latitude.Value;

                if (updateDto.Longitude.HasValue)
                    warehouse.Longitude = updateDto.Longitude.Value;

                if (updateDto.IsActive.HasValue)
                    warehouse.IsActive = updateDto.IsActive.Value;

                warehouse.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var warehouseDto = MapToWarehouseDto(warehouse);
                return ApiResponse<WarehouseDto>.SuccessResponse(warehouseDto, "Warehouse updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<WarehouseDto>.FailureResponse($"Failed to update warehouse: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteWarehouseAsync(Guid id)
        {
            try
            {
                var warehouse = await _context.Warehouses.FindAsync(id);

                if (warehouse == null)
                {
                    return ApiResponse<bool>.FailureResponse("Warehouse not found");
                }

                _context.Warehouses.Remove(warehouse);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResponse(true, "Warehouse deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailureResponse($"Failed to delete warehouse: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<WarehouseUnitDto>>> GetAvailableUnitsAsync(Guid warehouseId)
        {
            try
            {
                var units = await _context.WarehouseUnits
                    .Include(u => u.Pricing)
                    .Include(u => u.Features)
                    .Where(u => u.WarehouseId == warehouseId && u.IsAvailable && u.IsActive)
                    .ToListAsync();

                var unitDtos = units.Select(MapToWarehouseUnitDto).ToList();
                return ApiResponse<List<WarehouseUnitDto>>.SuccessResponse(unitDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<WarehouseUnitDto>>.FailureResponse($"Failed to get available units: {ex.Message}");
            }
        }

        private WarehouseDto MapToWarehouseDto(Warehouse warehouse)
        {
            return new WarehouseDto
            {
                Id = warehouse.Id,
                Name = warehouse.Name,
                Location = warehouse.Location,
                Address = warehouse.Address,
                Description = warehouse.Description,
                Latitude = warehouse.Latitude,
                Longitude = warehouse.Longitude,
                IsActive = warehouse.IsActive,
                CreatedAt = warehouse.CreatedAt,
                Units = warehouse.Units?.Select(MapToWarehouseUnitDto).ToList() ?? new List<WarehouseUnitDto>(),
                Media = warehouse.Media?.Select(MapToWarehouseMediaDto).ToList() ?? new List<WarehouseMediaDto>()
            };
        }

        private WarehouseUnitDto MapToWarehouseUnitDto(WarehouseUnit unit)
        {
            return new WarehouseUnitDto
            {
                Id = unit.Id,
                WarehouseId = unit.WarehouseId,
                UnitNumber = unit.UnitNumber,
                SquareMeters = unit.SquareMeters,
                Description = unit.Description,
                IsAvailable = unit.IsAvailable,
                IsActive = unit.IsActive,
                Pricing = unit.Pricing?.Select(MapToUnitPricingDto).ToList() ?? new List<UnitPricingDto>(),
                Features = unit.Features != null ? MapToUnitFeaturesDto(unit.Features) : null
            };
        }

        private UnitPricingDto MapToUnitPricingDto(UnitPricing pricing)
        {
            return new UnitPricingDto
            {
                Id = pricing.Id,
                WarehouseUnitId = pricing.WarehouseUnitId,
                PricingType = pricing.PricingType,
                Price = pricing.Price,
                DiscountPercentage = pricing.DiscountPercentage,
                IsActive = pricing.IsActive
            };
        }

        private WarehouseMediaDto MapToWarehouseMediaDto(WarehouseMedia media)
        {
            return new WarehouseMediaDto
            {
                Id = media.Id,
                WarehouseId = media.WarehouseId,
                MediaType = media.MediaType,
                Url = media.Url,
                Title = media.Title,
                Description = media.Description,
                DisplayOrder = media.DisplayOrder,
                IsPrimary = media.IsPrimary
            };
        }

        private UnitFeaturesDto MapToUnitFeaturesDto(UnitFeatures features)
        {
            return new UnitFeaturesDto
            {
                Id = features.Id,
                WarehouseUnitId = features.WarehouseUnitId,
                ClimateControl = features.ClimateControl,
                Security = features.Security,
                Access24x7 = features.Access24x7,
                LoadingDock = features.LoadingDock,
                ForkliftAccess = features.ForkliftAccess,
                CCTV = features.CCTV,
                FireSafety = features.FireSafety,
                Insurance = features.Insurance,
                PowerSupply = features.PowerSupply,
                PestControl = features.PestControl,
                AdditionalFeatures = features.AdditionalFeatures
            };
        }
    }
}
