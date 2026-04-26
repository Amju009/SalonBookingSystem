import { Router } from 'express';
import { BookingController } from '../presentation/controllers/bookingController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const bookingController = new BookingController();

router.post('/', authenticate, bookingController.createUserBooking.bind(bookingController));
router.post('/guest', bookingController.createGuestBooking.bind(bookingController));
router.get('/my', authenticate, bookingController.getMyBookings.bind(bookingController));

router.get('/', authenticate, requireAdmin, bookingController.getAllBookings.bind(bookingController));
router.put('/:id/status', authenticate, requireAdmin, bookingController.updateStatus.bind(bookingController));
router.put('/:id', authenticate, requireAdmin, bookingController.updateBooking.bind(bookingController));

export default router;