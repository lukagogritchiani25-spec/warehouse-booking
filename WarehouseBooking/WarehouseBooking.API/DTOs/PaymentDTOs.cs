using System.ComponentModel.DataAnnotations;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.DTOs
{
    public class CreatePaymentDto
    {
        [Required]
        public Guid BookingId { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        public decimal Amount { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [MaxLength(100)]
        public string? TransactionId { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }
    }

    public class UpdatePaymentDto
    {
        public PaymentStatus? Status { get; set; }

        [MaxLength(100)]
        public string? TransactionId { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }
    }

    public class PaymentDto
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public decimal Amount { get; set; }
        public PaymentStatus Status { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
