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
router.get(
  '/profile-details',
  passport.authenticate('jwt', { session: false }),
  UserController.getProfileDetails,
);

router.put(
  '/profile-details',
  passport.authenticate('jwt', { session: false }),
  UserController.updateProfileDetails,
);

router.get(
  '/sessions',
  passport.authenticate('jwt', { session: false }),
  UserController.getSessions,
);

router.delete(
  '/sessions',
  passport.authenticate('jwt', { session: false }),
  UserController.deleteAllSessions,
);

router.delete(
  '/sessions/:sessionId',
  passport.authenticate('jwt', { session: false }),
  UserController.deleteSession,
);

export default router;