using Microsoft.EntityFrameworkCore;
using WarehouseBooking.API.Models;

namespace WarehouseBooking.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<WarehouseUnit> WarehouseUnits { get; set; }
        public DbSet<UnitPricing> UnitPricings { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<WarehouseMedia> WarehouseMedia { get; set; }
        public DbSet<UnitFeatures> UnitFeatures { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            });

            // Warehouse configuration
            modelBuilder.Entity<Warehouse>(entity =>
            {
                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.Location);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");

                entity.HasMany(w => w.Units)
                    .WithOne(u => u.Warehouse)
                    .HasForeignKey(u => u.WarehouseId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(w => w.Media)
                    .WithOne(m => m.Warehouse)
                    .HasForeignKey(m => m.WarehouseId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // WarehouseUnit configuration
            modelBuilder.Entity<WarehouseUnit>(entity =>
            {
                entity.HasIndex(e => new { e.WarehouseId, e.UnitNumber }).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                entity.Property(e => e.SquareMeters).HasPrecision(18, 2);

                entity.HasMany(u => u.Pricing)
                    .WithOne(p => p.WarehouseUnit)
                    .HasForeignKey(p => p.WarehouseUnitId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.Bookings)
                    .WithOne(b => b.WarehouseUnit)
                    .HasForeignKey(b => b.WarehouseUnitId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(u => u.Features)
                    .WithOne(f => f.WarehouseUnit)
                    .HasForeignKey<UnitFeatures>(f => f.WarehouseUnitId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // UnitPricing configuration
            modelBuilder.Entity<UnitPricing>(entity =>
            {
                entity.HasIndex(e => new { e.WarehouseUnitId, e.PricingType });
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.DiscountPercentage).HasPrecision(5, 2);
            });

            // Booking configuration
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.WarehouseUnitId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => new { e.StartDate, e.EndDate });
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);

                entity.HasOne(b => b.User)
                    .WithMany(u => u.Bookings)
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(b => b.Payments)
                    .WithOne(p => p.Booking)
                    .HasForeignKey(p => p.BookingId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Payment configuration
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasIndex(e => e.BookingId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.TransactionId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
                entity.Property(e => e.Amount).HasPrecision(18, 2);
            });

            // WarehouseMedia configuration
            modelBuilder.Entity<WarehouseMedia>(entity =>
            {
                entity.HasIndex(e => e.WarehouseId);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            });

            // UnitFeatures configuration
            modelBuilder.Entity<UnitFeatures>(entity =>
            {
                entity.HasIndex(e => e.WarehouseUnitId).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            });
        }
    }
}
