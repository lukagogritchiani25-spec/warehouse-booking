using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseBooking.API.Models
{
    public enum PricingType
    {
        Hourly,
        Daily,
        Monthly,
        Yearly
    }

    public class UnitPricing
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid WarehouseUnitId { get; set; }

        [Required]
        public PricingType PricingType { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Range(0, 100)]
        [Column(TypeName = "decimal(5,2)")]
        public decimal? DiscountPercentage { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("WarehouseUnitId")]
        public WarehouseUnit WarehouseUnit { get; set; } = null!;
    }
}
