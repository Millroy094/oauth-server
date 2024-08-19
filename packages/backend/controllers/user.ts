import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OIDCService, UserService } from '../services';
import {
  doesEnvironmentVariableValueMatch,
  getEnviromentConfiguration,
} from '../support/get-environment-configuration';
import { ACCESS_TOKEN, HTTP_STATUSES } from '../constants';

class UserController {
  public static async register(req: Request, res: Response) {
    try {
      await UserService.createUser(req.body);
      res
        .json({ message: 'Successfully registered user!' })
        .status(HTTP_STATUSES.ok);
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.serverError)
        .json({ error: 'Failed registering user' });
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
          Date.now() +
          parseInt(getEnviromentConfiguration('JWT_EXPIRATION_TIME', '600000')),
      };

      const token = jwt.sign(
        JSON.stringify(payload),
        getEnviromentConfiguration('JWT_SECRET', 'TEST'),
      );

      res
        .cookie(ACCESS_TOKEN, token, {
          httpOnly: true,
          secure: doesEnvironmentVariableValueMatch('NODE_ENV', 'production'),
        })
        .status(200)
        .json({
          message: 'Login Successful',
        });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.unauthorised)
        .json({ error: 'Invalid username or password' });
    }
  }

  public static async logout(req: Request, res: Response) {
    if (req.cookies[ACCESS_TOKEN]) {
      res.clearCookie(ACCESS_TOKEN).status(HTTP_STATUSES.ok).json({
        message: 'Successfully logged out',
      });
    } else {
      res.status(HTTP_STATUSES.unauthorised).json({
        error: 'Failed to logout user',
      });
    }
  }

  public static async isAuthenticated(req: Request, res: Response) {
    res.status(HTTP_STATUSES.ok).json({
      user: req.user,
    });
  }

  public static async getProfileDetails(req: Request, res: Response) {
    try {
      const { user } = req;
      const { userId } = user as any;

      const userRecord = await UserService.getUserById(userId);
      res.status(HTTP_STATUSES.ok).json({ user: userRecord });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'There was an issue fetching user info' });
    }
  }

  public static async updateProfileDetails(req: Request, res: Response) {
    try {
      const { user } = req;
      const { userId } = user as any;
      await UserService.updateUser(userId, req.body);
      res
        .status(HTTP_STATUSES.ok)
        .json({ message: 'Successfully updated user record!' });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'There was an issue updating user info' });
    }
  }

  public static async getSessions(req: Request, res: Response) {
    try {
      const { user } = req;
      const { userId } = user as any;
      const sessions = await OIDCService.getSessions(userId);
      res.status(HTTP_STATUSES.ok).json({ sessions });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'Unable to retreive user sessions' });
    }
  }

  public static async deleteAllSessions(req: Request, res: Response) {
    try {
      const { user } = req;
      const { userId } = user as any;
      await OIDCService.deleteAllSessions(userId);
      res
        .status(HTTP_STATUSES.ok)
        .json({ message: 'Successfully deleted all user sessions' });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'Unable to delete user sessions' });
    }
  }

  public static async deleteSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      await OIDCService.deleteSession(sessionId);
      res
        .status(HTTP_STATUSES.ok)
        .json({ message: 'Successfully deleted all user sessions' });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'Unable to delete user sessions' });
    }
  }
}

export default UserController;
