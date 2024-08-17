import { Router } from 'express';
import passport from 'passport';
import { UserController } from '../controllers';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.get(
  '/is-authenticated',
  passport.authenticate('jwt', { session: false }),
  UserController.isAuthenticated,
);

export default router;
