import { Request, Response } from 'express';
import AccountService from '../models/Account';

class UserController {
  public static async registerUser(req: Request, res: Response) {
    try {
      await AccountService.create(req.body);
      res.json({ message: 'success' }).status(200);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed registering user' });
    }
  }
}

export default UserController;
