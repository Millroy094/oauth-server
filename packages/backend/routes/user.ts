import { Router } from 'express';
import AccountService from '../models/Account';

const router = Router();

router.post('/register', async (req, res) => {
  await AccountService.create(req.body);
  res.send('success').status(200);
});

export default router;
