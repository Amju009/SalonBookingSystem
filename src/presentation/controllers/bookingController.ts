import { Request, Response } from 'express';
import { BookingService } from '../../application/services/bookingService';
import { AuthRequest } from '../../middleware/authMiddleware';

const bookingService = new BookingService();

export class BookingController {
  async createUserBooking(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const booking = await bookingService.createUserBooking(userId, req.body);
      return res.status(201).json(booking);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async createGuestBooking(req: Request, res: Response) {
    try {
      const booking = await bookingService.createGuestBooking(req.body);
      return res.status(201).json(booking);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getMyBookings(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const bookings = await bookingService.getMyBookings(userId);
      return res.status(200).json(bookings);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getAllBookings();
      return res.status(200).json(bookings);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const booking = await bookingService.updateBookingStatus(id, req.body.status);
      return res.status(200).json(booking);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const booking = await bookingService.updateBooking(id, req.body);
      return res.status(200).json(booking);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}