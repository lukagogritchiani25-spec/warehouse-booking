using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseBooking.API.Models
{
    public enum PaymentStatus
    {
        Pending,
        Processing,
        Completed,
        Failed,
        Refunded
    }

    public enum PaymentMethod
    {
        CreditCard,
        DebitCard,
        BankTransfer,
        Cash,
        Other
    }

    public class Payment
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid BookingId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [MaxLength(100)]
        public string? TransactionId { get; set; }

        public DateTime? PaymentDate { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("BookingId")]
        public Booking Booking { get; set; } = null!;
    }
}
