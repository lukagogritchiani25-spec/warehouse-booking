using System.ComponentModel.DataAnnotations;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.DTOs
{
    public class CreateWarehouseDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class UpdateWarehouseDto
    {
        [MaxLength(200)]
        public string? Name { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public bool? IsActive { get; set; }
    }

    public class WarehouseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<WarehouseUnitDto> Units { get; set; } = new();
        public List<WarehouseMediaDto> Media { get; set; } = new();
    }

    public class WarehouseUnitDto
    {
        public Guid Id { get; set; }
        public Guid WarehouseId { get; set; }
        public string UnitNumber { get; set; } = string.Empty;
        public decimal SquareMeters { get; set; }
        public string? Description { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsActive { get; set; }
        public List<UnitPricingDto> Pricing { get; set; } = new();
        public UnitFeaturesDto? Features { get; set; }
    }

    public class CreateWarehouseUnitDto
    {
        [Required]
        public Guid WarehouseId { get; set; }

        [Required]
        [MaxLength(50)]
        public string UnitNumber { get; set; } = string.Empty;

        [Required]
        [Range(1, 10000)]
        public decimal SquareMeters { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class UpdateWarehouseUnitDto
    {
        [MaxLength(50)]
        public string? UnitNumber { get; set; }

        [Range(1, 10000)]
        public decimal? SquareMeters { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool? IsAvailable { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UnitPricingDto
    {
        public Guid Id { get; set; }
        public Guid WarehouseUnitId { get; set; }
        public PricingType PricingType { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateUnitPricingDto
    {
        [Required]
        public Guid WarehouseUnitId { get; set; }

        [Required]
        public PricingType PricingType { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        public decimal Price { get; set; }

        [Range(0, 100)]
        public decimal? DiscountPercentage { get; set; }
    }

    public class WarehouseMediaDto
    {
        public Guid Id { get; set; }
        public Guid WarehouseId { get; set; }
        public MediaType MediaType { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsPrimary { get; set; }
    }

    public class CreateWarehouseMediaDto
    {
        [Required]
        public Guid WarehouseId { get; set; }

        [Required]
        public MediaType MediaType { get; set; }

        [Required]
        [MaxLength(500)]
        public string Url { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;
        public bool IsPrimary { get; set; } = false;
    }

    public class UnitFeaturesDto
    {
        public Guid Id { get; set; }
        public Guid WarehouseUnitId { get; set; }
        public bool ClimateControl { get; set; }
        public bool Security { get; set; }
        public bool Access24x7 { get; set; }
        public bool LoadingDock { get; set; }
        public bool ForkliftAccess { get; set; }
        public bool CCTV { get; set; }
        public bool FireSafety { get; set; }
        public bool Insurance { get; set; }
        public bool PowerSupply { get; set; }
        public bool PestControl { get; set; }
        public string? AdditionalFeatures { get; set; }
    }

    public class CreateUnitFeaturesDto
    {
        [Required]
        public Guid WarehouseUnitId { get; set; }

        public bool ClimateControl { get; set; } = false;
        public bool Security { get; set; } = false;
        public bool Access24x7 { get; set; } = false;
        public bool LoadingDock { get; set; } = false;
        public bool ForkliftAccess { get; set; } = false;
        public bool CCTV { get; set; } = false;
        public bool FireSafety { get; set; } = false;
        public bool Insurance { get; set; } = false;
        public bool PowerSupply { get; set; } = false;
        public bool PestControl { get; set; } = false;

        [MaxLength(1000)]
        public string? AdditionalFeatures { get; set; }
    }
}
