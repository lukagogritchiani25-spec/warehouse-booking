-- Insert remaining data using Supabase SQL Editor
-- Idempotent script - safe to run multiple times (uses ON CONFLICT DO NOTHING)

BEGIN;

-- First, insert Warehouse Units (required for foreign key constraints)
INSERT INTO "WarehouseUnits" ("Id", "WarehouseId", "UnitNumber", "SquareMeters", "Description", "IsAvailable", "IsActive", "CreatedAt")
VALUES ('a1111111-1111-1111-1111-111111111111'::uuid, '7efa0987-8f8d-4cff-89f9-4529465cd337'::uuid, 'A-101', 50.00, 'Small unit perfect for personal storage', true, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "WarehouseUnits" ("Id", "WarehouseId", "UnitNumber", "SquareMeters", "Description", "IsAvailable", "IsActive", "CreatedAt")
VALUES ('a2222222-2222-2222-2222-222222222222'::uuid, '7efa0987-8f8d-4cff-89f9-4529465cd337'::uuid, 'A-102', 100.00, 'Medium unit ideal for small business', true, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "WarehouseUnits" ("Id", "WarehouseId", "UnitNumber", "SquareMeters", "Description", "IsAvailable", "IsActive", "CreatedAt")
VALUES ('b1111111-1111-1111-1111-111111111111'::uuid, '0180f96d-30e5-488c-b1a8-5ae523bd946c'::uuid, 'B-201', 75.00, 'Secure unit with CCTV', true, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "WarehouseUnits" ("Id", "WarehouseId", "UnitNumber", "SquareMeters", "Description", "IsAvailable", "IsActive", "CreatedAt")
VALUES ('b2222222-2222-2222-2222-222222222222'::uuid, '0180f96d-30e5-488c-b1a8-5ae523bd946c'::uuid, 'B-202', 150.00, 'Premium security unit', true, true, now())
ON CONFLICT ("Id") DO NOTHING;

-- Insert Unit Pricing
INSERT INTO "UnitPricings" ("Id", "WarehouseUnitId", "PricingType", "Price", "DiscountPercentage", "IsActive", "CreatedAt")
VALUES ('11111111-1111-1111-1111-111111111111'::uuid, 'a1111111-1111-1111-1111-111111111111'::uuid, 2, 4500.00, 10.00, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "UnitPricings" ("Id", "WarehouseUnitId", "PricingType", "Price", "DiscountPercentage", "IsActive", "CreatedAt")
VALUES ('22222222-2222-2222-2222-222222222222'::uuid, 'a2222222-2222-2222-2222-222222222222'::uuid, 2, 7200.00, 10.00, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "UnitPricings" ("Id", "WarehouseUnitId", "PricingType", "Price", "DiscountPercentage", "IsActive", "CreatedAt")
VALUES ('33333333-3333-3333-3333-333333333333'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, 2, 5850.00, 10.00, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "UnitPricings" ("Id", "WarehouseUnitId", "PricingType", "Price", "DiscountPercentage", "IsActive", "CreatedAt")
VALUES ('44444444-4444-4444-4444-444444444444'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, 2, 9000.00, 10.00, true, now())
ON CONFLICT ("Id") DO NOTHING;

-- Insert Unit Features
INSERT INTO "UnitFeatures" ("Id", "WarehouseUnitId", "ClimateControl", "Security", "Access24x7", "LoadingDock", "ForkliftAccess", "CCTV", "FireSafety", "Insurance", "PowerSupply", "PestControl", "AdditionalFeatures", "CreatedAt")
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'a1111111-1111-1111-1111-111111111111'::uuid, false, true, true, false, false, true, true, true, false, true, 'Basic security package', now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "UnitFeatures" ("Id", "WarehouseUnitId", "ClimateControl", "Security", "Access24x7", "LoadingDock", "ForkliftAccess", "CCTV", "FireSafety", "Insurance", "PowerSupply", "PestControl", "AdditionalFeatures", "CreatedAt")
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'a2222222-2222-2222-2222-222222222222'::uuid, true, true, true, false, false, true, true, true, true, true, 'Climate control included', now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "UnitFeatures" ("Id", "WarehouseUnitId", "ClimateControl", "Security", "Access24x7", "LoadingDock", "ForkliftAccess", "CCTV", "FireSafety", "Insurance", "PowerSupply", "PestControl", "AdditionalFeatures", "CreatedAt")
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'b1111111-1111-1111-1111-111111111111'::uuid, true, true, true, false, false, true, true, true, true, true, 'Advanced CCTV system', now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "UnitFeatures" ("Id", "WarehouseUnitId", "ClimateControl", "Security", "Access24x7", "LoadingDock", "ForkliftAccess", "CCTV", "FireSafety", "Insurance", "PowerSupply", "PestControl", "AdditionalFeatures", "CreatedAt")
VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'b2222222-2222-2222-2222-222222222222'::uuid, true, true, true, false, false, true, true, true, true, true, 'Biometric access control', now())
ON CONFLICT ("Id") DO NOTHING;

-- Insert Warehouse Media
INSERT INTO "WarehouseMedia" ("Id", "WarehouseId", "MediaType", "Url", "Title", "Description", "DisplayOrder", "IsPrimary", "CreatedAt")
VALUES ('11111111-aaaa-aaaa-aaaa-111111111111'::uuid, '7efa0987-8f8d-4cff-89f9-4529465cd337'::uuid, 0, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d', 'NYC Warehouse Exterior', 'Main entrance view', 1, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "WarehouseMedia" ("Id", "WarehouseId", "MediaType", "Url", "Title", "Description", "DisplayOrder", "IsPrimary", "CreatedAt")
VALUES ('22222222-aaaa-aaaa-aaaa-222222222222'::uuid, '7efa0987-8f8d-4cff-89f9-4529465cd337'::uuid, 0, 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e', 'NYC Interior', 'Storage units inside', 2, false, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "WarehouseMedia" ("Id", "WarehouseId", "MediaType", "Url", "Title", "Description", "DisplayOrder", "IsPrimary", "CreatedAt")
VALUES ('33333333-aaaa-aaaa-aaaa-333333333333'::uuid, '0180f96d-30e5-488c-b1a8-5ae523bd946c'::uuid, 0, 'https://images.unsplash.com/photo-1566303991276-e7e17cc2c1f6', 'LA Warehouse Security', 'Security gate entrance', 1, true, now())
ON CONFLICT ("Id") DO NOTHING;

INSERT INTO "WarehouseMedia" ("Id", "WarehouseId", "MediaType", "Url", "Title", "Description", "DisplayOrder", "IsPrimary", "CreatedAt")
VALUES ('44444444-aaaa-aaaa-aaaa-444444444444'::uuid, '0180f96d-30e5-488c-b1a8-5ae523bd946c'::uuid, 0, 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148', 'LA Loading Dock', 'Loading dock area', 2, false, now())
ON CONFLICT ("Id") DO NOTHING;

COMMIT;
