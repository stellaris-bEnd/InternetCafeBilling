import api from './api';

interface BookingRequest {
  computerId: number;
  hours: number;
}

interface BookingResponse {
  success: boolean;
  message: string;
  qrCode: string; // base64 string
}

export const bookingService = {
  createBooking: (data: BookingRequest) => {
    return api.post<BookingResponse>('/booking/create', data);
  },
};