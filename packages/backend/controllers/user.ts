import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { MFAService, OIDCService, UserService } from '../services';
import getEnv from '../support/env-config';
import { ACCESS_TOKEN, HTTP_STATUSES, REFRESH_TOKEN } from '../constants';

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
        roles: user.roles,
      };

      const accessToken = jwt.sign(
        payload,
        getEnv('authentication.accessTokenSecret'),
        {
          expiresIn: getEnv('authentication.accessTokenExpiry'),
        },
      );

      const refreshToken = jwt.sign(
        payload,
        getEnv('authentication.refreshTokenSecret'),
        {
          expiresIn: getEnv('authentication.refreshTokenExpiry'),
        },
      );

      res
        .cookie(ACCESS_TOKEN, accessToken, {
          httpOnly: true,
          secure: getEnv('environment') === 'production',
        })
        .cookie(REFRESH_TOKEN, refreshToken, {
          httpOnly: true,
          secure: getEnv('environment') === 'production',
        })
        .status(200)
        .json({
          user: payload,
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
    res
      .clearCookie(ACCESS_TOKEN)
      .clearCookie(REFRESH_TOKEN)
      .status(HTTP_STATUSES.ok)
      .json({
        message: 'Successfully logged out',
      });
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

  public static async getMFASettings(req: Request, res: Response) {
    try {
      const { user } = req;
      const { userId } = user as any;
      const settings = await MFAService.getMFASetting(userId);
      res.status(HTTP_STATUSES.ok).json({ settings });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.notFound)
        .json({ error: 'Unable to retrieve user MFA settings' });
    }
  }
  public static async setupMFA(req: Request, res: Response) {
    try {
      const { user } = req;
      const { userId } = user as any;
      const { type, subscriber } = req.body;
      const result = await MFAService.setupMFA(userId, type, subscriber);
      res
        .status(HTTP_STATUSES.ok)
        .json({ uri: result?.uri, message: 'Initiated MFA Setup' });
    } catch (err) {
      console.log(err);
      res.status(HTTP_STATUSES.notFound).json({ error: 'Unable to setup MFA' });
    }
  }

  public static async verifyMFA(req: Request, res: Response) {
    try {
      const { user } = req;
      const { userId } = user as any;
      const { type, otp } = req.body;
      await MFAService.verifyMFA(userId, type, otp);
      res
        .status(HTTP_STATUSES.ok)
        .json({ message: 'Successfully verified MFA' });
    } catch (err) {
      console.log(err);
      res.status(HTTP_STATUSES.notFound).json({ error: 'Invalid OTP' });
    }
  }
}

export default UserController;
