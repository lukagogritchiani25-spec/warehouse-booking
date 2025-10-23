-- Seed Data for Warehouse Booking System

-- Insert Warehouses
INSERT INTO Warehouses (Id, Name, Location, Address, Description, Latitude, Longitude, IsActive, CreatedAt)
VALUES
('11111111-1111-1111-1111-111111111111', 'Premium Storage NYC', 'New York', '123 Storage Lane, NY 10001', 'Climate-controlled warehouse facility in downtown Manhattan', 40.7128, -74.0060, 1, datetime('now')),
('22222222-2222-2222-2222-222222222222', 'SecureSpace LA', 'Los Angeles', '456 Warehouse Blvd, LA 90001', 'High-security storage facility with 24/7 access', 34.0522, -118.2437, 1, datetime('now')),
('33333333-3333-3333-3333-333333333333', 'Chicago Storage Hub', 'Chicago', '789 Industrial Ave, Chicago 60601', 'Large-scale storage with loading docks and forklift access', 41.8781, -87.6298, 1, datetime('now'));

-- Insert Warehouse Units for Premium Storage NYC
INSERT INTO WarehouseUnits (Id, WarehouseId, UnitNumber, SquareMeters, Description, IsAvailable, IsActive, CreatedAt)
VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'A-101', '50', 'Small unit perfect for personal storage', 1, 1, datetime('now')),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'A-102', '100', 'Medium unit ideal for small business inventory', 1, 1, datetime('now')),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'A-103', '200', 'Large unit with climate control', 1, 1, datetime('now'));

-- Insert Warehouse Units for SecureSpace LA
INSERT INTO WarehouseUnits (Id, WarehouseId, UnitNumber, SquareMeters, Description, IsAvailable, IsActive, CreatedAt)
VALUES
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'B-201', '75', 'Secure unit with advanced CCTV', 1, 1, datetime('now')),
('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'B-202', '150', 'Premium security unit with biometric access', 1, 1, datetime('now'));

-- Insert Warehouse Units for Chicago Storage Hub
INSERT INTO WarehouseUnits (Id, WarehouseId, UnitNumber, SquareMeters, Description, IsAvailable, IsActive, CreatedAt)
VALUES
('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'C-301', '300', 'Industrial unit with loading dock', 1, 1, datetime('now')),
('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'C-302', '500', 'Extra large unit with forklift access', 1, 1, datetime('now'));

-- Insert Pricing for Unit A-101 (Small NYC unit)
INSERT INTO UnitPricings (Id, WarehouseUnitId, PricingType, Price, DiscountPercentage, IsActive, CreatedAt)
VALUES
('p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 0, 10.00, NULL, 1, datetime('now')),  -- Hourly
('p1111112-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 1, 200.00, 5.00, 1, datetime('now')),  -- Daily
('p1111113-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 2, 5000.00, 10.00, 1, datetime('now')), -- Monthly
('p1111114-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 3, 50000.00, 15.00, 1, datetime('now')); -- Yearly

-- Insert Pricing for Unit A-102 (Medium NYC unit)
INSERT INTO UnitPricings (Id, WarehouseUnitId, PricingType, Price, DiscountPercentage, IsActive, CreatedAt)
VALUES
('p2111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 0, 15.00, NULL, 1, datetime('now')),
('p2111112-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 1, 300.00, 5.00, 1, datetime('now')),
('p2111113-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 2, 8000.00, 10.00, 1, datetime('now')),
('p2111114-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 3, 80000.00, 15.00, 1, datetime('now'));

-- Insert Pricing for Unit A-103 (Large NYC unit)
INSERT INTO UnitPricings (Id, WarehouseUnitId, PricingType, Price, DiscountPercentage, IsActive, CreatedAt)
VALUES
('p3111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 0, 25.00, NULL, 1, datetime('now')),
('p3111112-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 1, 500.00, 5.00, 1, datetime('now')),
('p3111113-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 2, 12000.00, 10.00, 1, datetime('now')),
('p3111114-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 3, 120000.00, 20.00, 1, datetime('now'));

-- Insert Pricing for Unit B-201 (LA unit)
INSERT INTO UnitPricings (Id, WarehouseUnitId, PricingType, Price, DiscountPercentage, IsActive, CreatedAt)
VALUES
('p4111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 0, 12.00, NULL, 1, datetime('now')),
('p4111112-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 1, 250.00, 5.00, 1, datetime('now')),
('p4111113-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 2, 6500.00, 10.00, 1, datetime('now')),
('p4111114-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 3, 65000.00, 15.00, 1, datetime('now'));

-- Insert Pricing for Unit B-202 (Premium LA unit)
INSERT INTO UnitPricings (Id, WarehouseUnitId, PricingType, Price, DiscountPercentage, IsActive, CreatedAt)
VALUES
('p5111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 0, 20.00, NULL, 1, datetime('now')),
('p5111112-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 1, 400.00, 5.00, 1, datetime('now')),
('p5111113-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 2, 10000.00, 10.00, 1, datetime('now')),
('p5111114-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 3, 100000.00, 18.00, 1, datetime('now'));

-- Insert Pricing for Chicago units
INSERT INTO UnitPricings (Id, WarehouseUnitId, PricingType, Price, DiscountPercentage, IsActive, CreatedAt)
VALUES
('p6111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 1, 600.00, 5.00, 1, datetime('now')),
('p6111113-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 2, 15000.00, 12.00, 1, datetime('now')),
('p7111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 1, 1000.00, 5.00, 1, datetime('now')),
('p7111113-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 2, 25000.00, 15.00, 1, datetime('now'));

-- Insert Unit Features
INSERT INTO UnitFeatures (Id, WarehouseUnitId, ClimateControl, Security, Access24x7, LoadingDock, ForkliftAccess, CCTV, FireSafety, Insurance, PowerSupply, PestControl, AdditionalFeatures, CreatedAt)
VALUES
('f1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 'Basic security package', datetime('now')),
('f2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 'Climate control with humidity monitoring', datetime('now')),
('f3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 'Premium climate control, loading dock included', datetime('now')),
('f4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 'Advanced CCTV with motion detection', datetime('now')),
('f5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 'Biometric access, premium security', datetime('now')),
('f6666666-6666-6666-6666-666666666666', 'c1111111-1111-1111-1111-111111111111', 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Loading dock, forklift access, industrial grade', datetime('now')),
('f7777777-7777-7777-7777-777777777777', 'c2222222-2222-2222-2222-222222222222', 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'Extra large bay doors, heavy equipment access', datetime('now'));

-- Insert Warehouse Media
INSERT INTO WarehouseMedia (Id, WarehouseId, MediaType, Url, Title, Description, DisplayOrder, IsPrimary, CreatedAt)
VALUES
('m1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 0, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d', 'Main Entrance', 'Modern warehouse entrance', 1, 1, datetime('now')),
('m1111112-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 0, 'https://images.unsplash.com/photo-1553413077-190dd305871c', 'Interior View', 'Climate-controlled interior space', 2, 0, datetime('now')),
('m2222221-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 0, 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e', 'Security Gate', 'High-security entrance with biometric access', 1, 1, datetime('now')),
('m2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 0, 'https://images.unsplash.com/photo-1578575437130-527eed3abbec', 'CCTV System', 'Advanced surveillance system', 2, 0, datetime('now')),
('m3333331-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 0, 'https://images.unsplash.com/photo-1566303991276-e7e17cc2c1f6', 'Loading Dock', 'Industrial loading bay', 1, 1, datetime('now')),
('m3333332-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 0, 'https://images.unsplash.com/photo-1601598851547-4302969d0614', 'Warehouse Floor', 'Large open storage area', 2, 0, datetime('now'));
