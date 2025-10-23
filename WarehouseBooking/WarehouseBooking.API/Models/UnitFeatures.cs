using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseBooking.API.Models
{
    public class UnitFeatures
    {
        [Key]
        public Guid Id { get; set; }

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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("WarehouseUnitId")]
        public WarehouseUnit WarehouseUnit { get; set; } = null!;
    }
}
