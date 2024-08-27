import { Router } from 'express';
import { AdminController } from '../controllers';
import { authenicate } from '../middleware';

const router = Router();

router.get('/clients', authenicate, AdminController.getClients);
router.post('/clients/new', authenicate, AdminController.createClient);
router.get('/clients/:id', authenicate, AdminController.getClient);
router.put('/clients/:id', authenicate, AdminController.updateClient);
router.delete('/clients/:id', authenicate, AdminController.deleteClient);

router.get('/users', authenicate, AdminController.getUsers);
router.get('/users/:id', authenicate, AdminController.getUser);
router.put('/users/:id', authenicate, AdminController.updateUser);
router.delete('/users/:id', authenicate, AdminController.deleteUser);
router.delete(
  '/users/:id/sessions',
  authenicate,
  AdminController.deleteUserSessions,
);

export default router;
