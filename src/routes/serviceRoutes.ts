import { Router } from 'express';
import { ServiceController } from '../presentation/controllers/serviceController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const serviceController = new ServiceController();

router.post('/', authenticate, requireAdmin, serviceController.create.bind(serviceController));
router.get('/', serviceController.getAll.bind(serviceController));

export default router;