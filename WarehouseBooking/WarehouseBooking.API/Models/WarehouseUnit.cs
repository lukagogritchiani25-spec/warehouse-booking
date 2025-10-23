using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseBooking.API.Models
{
    public class WarehouseUnit
    {
        [Key]
        public Guid Id { get; set; }

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

        public bool IsAvailable { get; set; } = true;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("WarehouseId")]
        public Warehouse Warehouse { get; set; } = null!;

        public ICollection<UnitPricing> Pricing { get; set; } = new List<UnitPricing>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public UnitFeatures? Features { get; set; }
    }
}
