using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseBooking.API.Models
{
    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Active,
        Completed,
        Cancelled
    }

    public class Booking
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid WarehouseUnitId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("WarehouseUnitId")]
        public WarehouseUnit WarehouseUnit { get; set; } = null!;

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
