import { prisma } from '../../infrastructure/database/prismaClient';
import { logger } from '../../infrastructure/logging/logger';
import { CreateBookingDto, CreateGuestBookingDto } from '../dtos/bookingDto';

export class BookingService {
  private async checkTimeConflict(
  bookingDate: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: number
) 
{
  const conflict = await prisma.booking.findFirst({
    where: {
      bookingDate,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: {
        notIn: ['DECLINED', 'CANCELLED']
      },
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } }
      ]
    }
  });

  if (conflict) {
    throw new Error('This time slot is already booked');
  }
}

  async createUserBooking(userId: number, data: CreateBookingDto) {
    await this.checkTimeConflict(data.bookingDate, data.startTime, data.endTime);

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId: data.serviceId,
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
        status: 'PENDING'
      },
      include: {
        service: true,
        user: true
      }
    });

    logger.info(`Booking created by user ${userId}`);
    return booking;
  }

  async createGuestBooking(data: CreateGuestBookingDto) {
    await this.checkTimeConflict(data.bookingDate, data.startTime, data.endTime);

    const booking = await prisma.booking.create({
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        serviceId: data.serviceId,
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
        status: 'PENDING'
      },
      include: {
        service: true
      }
    });

    logger.info(`Guest booking created for ${data.guestEmail}`);
    return booking;
  }

  async getMyBookings(userId: number) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
        user: true
      }
    });
  }

  async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        service: true,
        user: true
      }
    });
  }

  async updateBookingStatus(id: number, status: string) {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        service: true,
        user: true
      }
    });

    logger.info(`Booking ${id} status updated to ${status}`);
    return booking;
  }

  async updateBooking(id: number, data: CreateBookingDto) {
    await this.checkTimeConflict(data.bookingDate, data.startTime, data.endTime, id);

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        serviceId: data.serviceId,
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes
      },
      include: {
        service: true,
        user: true
      }
    });

    logger.info(`Booking ${id} updated by admin`);
    return booking;
  }
}