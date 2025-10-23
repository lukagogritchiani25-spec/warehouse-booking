-- Create test data with proper GUID format for .NET

-- Insert Warehouses
INSERT INTO Warehouses (Id, Name, Location, Address, Description, Latitude, Longitude, IsActive, CreatedAt)
VALUES
('11111111-1111-1111-1111-111111111111', 'Premium Storage NYC', 'New York', '123 Storage Lane, NY 10001', 'Climate-controlled warehouse facility', 40.7128, -74.0060, 1, datetime('now')),
('22222222-2222-2222-2222-222222222222', 'SecureSpace LA', 'Los Angeles', '456 Warehouse Blvd, LA 90001', 'High-security storage facility', 34.0522, -118.2437, 1, datetime('now')),
('33333333-3333-3333-3333-333333333333', 'Chicago Storage Hub', 'Chicago', '789 Industrial Ave, Chicago 60601', 'Large-scale industrial storage', 41.8781, -87.6298, 1, datetime('now'));

-- Insert Warehouse Units
INSERT INTO WarehouseUnits (Id, WarehouseId, UnitNumber, SquareMeters, Description, IsAvailable, IsActive, CreatedAt)
VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'A-101', '50', 'Small unit perfect for personal storage', 1, 1, datetime('now')),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'A-102', '100', 'Medium unit ideal for small business', 1, 1, datetime('now')),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'A-103', '200', 'Large unit with climate control', 1, 1, datetime('now')),
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'B-201', '75', 'Secure unit with CCTV', 1, 1, datetime('now')),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'B-202', '150', 'Premium security unit', 1, 1, datetime('now'));

-- Insert Pricing for units
INSERT INTO UnitPricings (Id, WarehouseUnitId, PricingType, Price, DiscountPercentage, IsActive, CreatedAt)
VALUES
-- A-101 pricing
('p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 0, 10.00, NULL, 1, datetime('now')),
('p1111112-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 1, 200.00, 5.00, 1, datetime('now')),
('p1111113-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 2, 5000.00, 10.00, 1, datetime('now')),
-- A-102 pricing
('p2111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 0, 15.00, NULL, 1, datetime('now')),
('p2111112-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 1, 300.00, 5.00, 1, datetime('now')),
('p2111113-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 2, 8000.00, 10.00, 1, datetime('now')),
-- A-103 pricing
('p3111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 1, 500.00, 5.00, 1, datetime('now')),
('p3111113-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 2, 12000.00, 10.00, 1, datetime('now'));

-- Insert Unit Features
INSERT INTO UnitFeatures (Id, WarehouseUnitId, ClimateControl, Security, Access24x7, LoadingDock, ForkliftAccess, CCTV, FireSafety, Insurance, PowerSupply, PestControl, AdditionalFeatures, CreatedAt)
VALUES
('f1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 'Basic security package', datetime('now')),
('f2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 'Climate control included', datetime('now')),
('f3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 'Premium features', datetime('now')),
('f4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 'Advanced CCTV', datetime('now')),
('f5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 'Biometric access', datetime('now'));

-- Insert sample bookings for user: 4409c231-20f0-4ddf-b798-fb239d2794e5
INSERT INTO Bookings (Id, UserId, WarehouseUnitId, StartDate, EndDate, Status, TotalAmount, Notes, CreatedAt)
VALUES
('b0000001-0001-0001-0001-000000000001', '4409c231-20f0-4ddf-b798-fb239d2794e5', 'a1111111-1111-1111-1111-111111111111', '2025-11-01 00:00:00', '2025-12-01 00:00:00', 2, 4500.00, 'Active booking - Unit A-101 for November', datetime('now')),
('b0000002-0002-0002-0002-000000000002', '4409c231-20f0-4ddf-b798-fb239d2794e5', 'a2222222-2222-2222-2222-222222222222', '2025-12-15 00:00:00', '2026-01-15 00:00:00', 0, 7200.00, 'Pending booking - Unit A-102 for December', datetime('now')),
('b0000003-0003-0003-0003-000000000003', '4409c231-20f0-4ddf-b798-fb239d2794e5', 'b1111111-1111-1111-1111-111111111111', '2026-02-01 00:00:00', '2026-03-01 00:00:00', 1, 5850.00, 'Confirmed booking - Unit B-201 for February', datetime('now'));

-- Insert payments for bookings
INSERT INTO Payments (Id, BookingId, Amount, Status, PaymentMethod, TransactionId, PaymentDate, Notes, CreatedAt)
VALUES
('pay00001-0001-0001-0001-000000000001', 'b0000001-0001-0001-0001-000000000001', 4500.00, 2, 0, 'TXN-2025-001', datetime('now'), 'Full payment for Unit A-101', datetime('now')),
('pay00002-0002-0002-0002-000000000002', 'b0000003-0003-0003-0003-000000000003', 2925.00, 2, 0, 'TXN-2025-002', datetime('now'), 'Partial payment for Unit B-201', datetime('now'));

-- Insert warehouse media
INSERT INTO WarehouseMedia (Id, WarehouseId, MediaType, Url, Title, Description, DisplayOrder, IsPrimary, CreatedAt)
VALUES
('m1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 0, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d', 'NYC Warehouse', 'Main entrance', 1, 1, datetime('now')),
('m2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 0, 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e', 'LA Warehouse', 'Security gate', 1, 1, datetime('now')),
('m3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 0, 'https://images.unsplash.com/photo-1566303991276-e7e17cc2c1f6', 'Chicago Warehouse', 'Loading dock', 1, 1, datetime('now'));
