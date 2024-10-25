import { Router } from 'express';
import HealthCheckController from '../controllers/health-check';

const router = Router();

router.get('/status', HealthCheckController.getStatus)

export default router;
