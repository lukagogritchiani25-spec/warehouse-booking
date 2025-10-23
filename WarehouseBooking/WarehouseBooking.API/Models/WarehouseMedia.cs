using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseBooking.API.Models
{
    public enum MediaType
    {
        Image,
        Video
    }

    public class WarehouseMedia
    {
        [Key]
        public Guid Id { get; set; }

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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("WarehouseId")]
        public Warehouse Warehouse { get; set; } = null!;
    }
}
