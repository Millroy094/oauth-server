import { Router } from 'express';
import passport from 'passport';
import { AdminController } from '../controllers';

const router = Router();

router.get(
  '/clients',
  passport.authenticate('jwt', { session: false }),
  AdminController.getClients,
);
router.post(
  '/clients/new',
  passport.authenticate('jwt', { session: false }),
  AdminController.createClient,
);
router.get(
  '/clients/:id',
  passport.authenticate('jwt', { session: false }),
  AdminController.getClient,
);
router.put(
  '/clients/:id',
  passport.authenticate('jwt', { session: false }),
  AdminController.updateClient,
);
router.delete(
  '/clients/:id',
  passport.authenticate('jwt', { session: false }),
  AdminController.deleteClient,
);

export default router;
