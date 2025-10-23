using System.ComponentModel.DataAnnotations;

namespace WarehouseBooking.API.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Phone]
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        public bool IsEmailConfirmed { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
