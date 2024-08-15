import { Request, Response } from 'express';
import isEmpty from 'lodash/isEmpty';
import AccountService from '../models/Account';

class UserController {
  public static async registerUser(req: Request, res: Response) {
    try {
      const [userAccount] = await AccountService.scan('email')
        .eq(req.body.email)
        .exec();

      if (!isEmpty(userAccount)) {
        throw new Error('User already exists');
      }

      await AccountService.create(req.body);
      res.json({ message: 'Successfully registered user!' }).status(200);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed registering user' });
    }
  }
}

export default UserController;
