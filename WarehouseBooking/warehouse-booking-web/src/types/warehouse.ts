export enum PricingType {
  Hourly = 0,
  Daily = 1,
  Monthly = 2,
  Yearly = 3
}

export enum MediaType {
  Image = 0,
  Video = 1
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface WarehouseDto {
  id: string;
  name: string;
  location: string;
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  units: WarehouseUnitDto[];
  media: WarehouseMediaDto[];
}

export interface WarehouseUnitDto {
  id: string;
  warehouseId: string;
  unitNumber: string;
  squareMeters: number;
  description?: string;
  isAvailable: boolean;
  isActive: boolean;
  pricing: UnitPricingDto[];
  features?: UnitFeaturesDto;
}

export interface UnitPricingDto {
  id: string;
  warehouseUnitId: string;
  pricingType: PricingType;
  price: number;
  discountPercentage?: number;
  isActive: boolean;
}

export interface UnitFeaturesDto {
  id: string;
  warehouseUnitId: string;
  climateControl: boolean;
  security: boolean;
  access24x7: boolean;
  loadingDock: boolean;
  forkliftAccess: boolean;
  cctv: boolean;
  fireSafety: boolean;
  insurance: boolean;
  powerSupply: boolean;
  pestControl: boolean;
  additionalFeatures?: string;
}

export interface WarehouseMediaDto {
  id: string;
  warehouseId: string;
  mediaType: MediaType;
  url: string;
  title?: string;
  description?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface WarehouseFilters {
  searchText: string;
  location: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  features: {
    climateControl: boolean;
    security: boolean;
    access24x7: boolean;
    loadingDock: boolean;
    forkliftAccess: boolean;
    cctv: boolean;
    fireSafety: boolean;
    insurance: boolean;
    powerSupply: boolean;
    pestControl: boolean;
  };
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'availability';
}
