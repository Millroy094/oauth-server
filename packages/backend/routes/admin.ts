import { Router } from 'express';
import { AdminController } from '../controllers';
import { authenicate } from '../middleware';

const router = Router();

router.get('/clients', authenicate, AdminController.getClients);
router.post('/clients/new', authenicate, AdminController.createClient);
router.get('/clients/:id', authenicate, AdminController.getClient);
router.put('/clients/:id', authenicate, AdminController.updateClient);
router.delete('/clients/:id', authenicate, AdminController.deleteClient);

export default router;
