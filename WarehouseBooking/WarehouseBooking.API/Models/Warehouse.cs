using System.ComponentModel.DataAnnotations;

namespace WarehouseBooking.API.Models
{
    public class Warehouse
    {
        [Key]
        public Guid Id { get; set; }

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

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<WarehouseUnit> Units { get; set; } = new List<WarehouseUnit>();
        public ICollection<WarehouseMedia> Media { get; set; } = new List<WarehouseMedia>();
    }
}
