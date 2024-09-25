import { Router } from 'express';
import { AdminController } from '../controllers';
import { authenicate, authorize } from '../middleware';

const router = Router();

router.get(
  '/clients',
  authenicate,
  authorize(['admin']),
  AdminController.getClients,
);
router.post(
  '/clients/new',
  authenicate,
  authorize(['admin']),
  AdminController.createClient,
);
router.get(
  '/clients/:id',
  authenicate,
  authorize(['admin']),
  AdminController.getClient,
);
router.put(
  '/clients/:id',
  authenicate,
  authorize(['admin']),
  AdminController.updateClient,
);
router.delete(
  '/clients/:id',
  authenicate,
  authorize(['admin']),
  AdminController.deleteClient,
);

router.get(
  '/users',
  authenicate,
  authorize(['admin']),
  AdminController.getUsers,
);
router.get(
  '/users/:id',
  authenicate,
  authorize(['admin']),
  AdminController.getUser,
);
router.put(
  '/users/:id',
  authenicate,
  authorize(['admin']),
  AdminController.updateUser,
);
router.delete(
  '/users/:id',
  authenicate,
  authorize(['admin']),
  AdminController.deleteUser,
);
router.delete(
  '/users/:id/sessions',
  authenicate,
  authorize(['admin']),
  AdminController.deleteUserSessions,
);

router.post(
  '/users/:id/mfa-reset',
  authenicate,
  authorize(['admin']),
  AdminController.resetMFA,
);

export default router;
