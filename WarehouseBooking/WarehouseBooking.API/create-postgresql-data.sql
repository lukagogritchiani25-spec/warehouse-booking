-- Create complete test data for PostgreSQL
-- Use actual warehouse IDs from API

-- Warehouse 1: 7efa0987-8f8d-4cff-89f9-4529465cd337 (Premium Storage NYC)
-- Warehouse 2: 0180f96d-30e5-488c-b1a8-5ae523bd946c (SecureSpace LA)

-- Insert Warehouse Units (2 per warehouse = 4 total)
INSERT INTO "WarehouseUnits" ("Id", "WarehouseId", "UnitNumber", "SquareMeters", "Description", "IsAvailable", "IsActive", "CreatedAt")
VALUES
('a1111111-1111-1111-1111-111111111111', '7efa0987-8f8d-4cff-89f9-4529465cd337', 'A-101', 50, 'Small unit perfect for personal storage', true, true, now()),
('a2222222-2222-2222-2222-222222222222', '7efa0987-8f8d-4cff-89f9-4529465cd337', 'A-102', 100, 'Medium unit ideal for small business', true, true, now()),
('b1111111-1111-1111-1111-111111111111', '0180f96d-30e5-488c-b1a8-5ae523bd946c', 'B-201', 75, 'Secure unit with CCTV', true, true, now()),
('b2222222-2222-2222-2222-222222222222', '0180f96d-30e5-488c-b1a8-5ae523bd946c', 'B-202', 150, 'Premium security unit', true, true, now());

-- Insert Unit Pricing (Monthly pricing for each unit)
INSERT INTO "UnitPricings" ("Id", "WarehouseUnitId", "PricingType", "Price", "DiscountPercentage", "IsActive", "CreatedAt")
VALUES
('p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 2, 4500.00, 10.00, true, now()),
('p2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 2, 7200.00, 10.00, true, now()),
('p3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 2, 5850.00, 10.00, true, now()),
('p4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 2, 9000.00, 10.00, true, now());

-- Insert Unit Features
INSERT INTO "UnitFeatures" ("Id", "WarehouseUnitId", "ClimateControl", "Security", "Access24x7", "LoadingDock", "ForkliftAccess", "CCTV", "FireSafety", "Insurance", "PowerSupply", "PestControl", "AdditionalFeatures", "CreatedAt")
VALUES
('f1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', false, true, true, false, false, true, true, true, false, true, 'Basic security package', now()),
('f2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', true, true, true, false, false, true, true, true, true, true, 'Climate control included', now()),
('f3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', true, true, true, false, false, true, true, true, true, true, 'Advanced CCTV system', now()),
('f4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', true, true, true, false, false, true, true, true, true, true, 'Biometric access control', now());

-- Insert Warehouse Media (2 per warehouse)
INSERT INTO "WarehouseMedia" ("Id", "WarehouseId", "MediaType", "Url", "Title", "Description", "DisplayOrder", "IsPrimary", "CreatedAt")
VALUES
('m1111111-1111-1111-1111-111111111111', '7efa0987-8f8d-4cff-89f9-4529465cd337', 0, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d', 'NYC Warehouse Exterior', 'Main entrance view', 1, true, now()),
('m2222222-2222-2222-2222-222222222222', '7efa0987-8f8d-4cff-89f9-4529465cd337', 0, 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e', 'NYC Interior', 'Storage units inside', 2, false, now()),
('m3333333-3333-3333-3333-333333333333', '0180f96d-30e5-488c-b1a8-5ae523bd946c', 0, 'https://images.unsplash.com/photo-1566303991276-e7e17cc2c1f6', 'LA Warehouse Security', 'Security gate entrance', 1, true, now()),
('m4444444-4444-4444-4444-444444444444', '0180f96d-30e5-488c-b1a8-5ae523bd946c', 0, 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148', 'LA Loading Dock', 'Loading dock area', 2, false, now());
