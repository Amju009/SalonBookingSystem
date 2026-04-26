export interface CreateBookingDto {
  serviceId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface CreateGuestBookingDto {
  guestName: string;
  guestEmail: string;
  serviceId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateBookingStatusDto {
  status: string;
}