import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services';

class UserController {
  public static async register(req: Request, res: Response) {
    try {
      await UserService.createUser(req.body);
      res.json({ message: 'Successfully registered user!' }).status(200);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed registering user' });
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const user = await UserService.validateUserCredentials(
        req.body.email,
        req.body.password,
      );
      const payload = {
        userId: user.userId,
        email: user.email,
        expiration:
          Date.now() + parseInt(process.env.JWT_EXPIRATION_TIME ?? ''),
      };

      const token = jwt.sign(
        JSON.stringify(payload),
        process.env.JWT_SECRET ?? '',
      );

      res
        .cookie('admin_access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({
          message: 'Login Successful',
        });
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: 'Invalid username or password' });
    }
  }

  public static async logout(req: Request, res: Response) {
    if (req.cookies['admin_access_token']) {
      res.clearCookie('admin_access_token').status(200).json({
        message: 'Successfully logged out',
      });
    } else {
      res.status(401).json({
        error: 'Failed to logout user',
      });
    }
  }

  public static async isAuthenticated(req: Request, res: Response) {
    res.send(200).json({
      user: req.user,
    });
  }
}

export default UserController;
