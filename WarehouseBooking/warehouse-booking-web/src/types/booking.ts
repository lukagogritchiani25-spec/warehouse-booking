export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3
}

export interface BookingDto {
  id: string;
  userId: string;
  warehouseUnitId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  warehouseUnit?: {
    unitNumber: string;
    squareMeters: number;
    warehouse?: {
      name: string;
      location: string;
      address: string;
    };
  };
}

export interface CreateBookingRequest {
  warehouseUnitId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
}
