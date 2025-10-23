using System.ComponentModel.DataAnnotations;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.DTOs
{
    public class CreateBookingDto
    {
        [Required]
        public Guid WarehouseUnitId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }

    public class UpdateBookingDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public BookingStatus? Status { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }

    public class BookingDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid WarehouseUnitId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public BookingStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto User { get; set; } = null!;
        public WarehouseUnitDto WarehouseUnit { get; set; } = null!;
        public List<PaymentDto> Payments { get; set; } = new();
    }

    public class BookingSummaryDto
    {
        public Guid Id { get; set; }
        public Guid WarehouseUnitId { get; set; }
        public string WarehouseName { get; set; } = string.Empty;
        public string UnitNumber { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public BookingStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
