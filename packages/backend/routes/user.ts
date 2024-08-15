import { Router } from 'express';
import AccountService from '../models/Account';
import { UserController } from '../controllers';

const router = Router();

router.post('/register', UserController.registerUser);

export default router;
