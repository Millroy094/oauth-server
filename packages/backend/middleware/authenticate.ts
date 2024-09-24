import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import getEnv from '../support/env-config';
import { UserService } from '../services';

interface JwtPayload {
  userId: string;
  email: string;
}

const accessTokenSecret = getEnv('authentication.accessTokenSecret');
const accessTokenExpiry = getEnv('authentication.accessTokenExpiry');
const refreshTokenSecret = getEnv('authentication.refreshTokenSecret');
const refreshTokenExpiry = getEnv('authentication.accessTokenExpiry');

const generateNewTokensFromRefreshToken = (
  refreshToken: any,
  req: Request,
  res: Response,
) => {
  try {
    const { userId, email } = jwt.verify(
      refreshToken,
      refreshTokenSecret,
    ) as JwtPayload;
    const newAccessToken = jwt.sign({ userId, email }, accessTokenSecret, {
      expiresIn: accessTokenExpiry,
    });
    const newRefreshToken = jwt.sign({ userId, email }, accessTokenSecret, {
      expiresIn: refreshTokenExpiry,
    });

    res
      .cookie(ACCESS_TOKEN, newAccessToken, {
        httpOnly: true,
        secure: getEnv('environment') === 'production',
      })
      .cookie(REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        secure: getEnv('environment') === 'production',
      });

    req.user = { userId, email };
  } catch (error) {
    throw new Error(
      'Authentication failed, authentication tokens have expired',
    );
  }
};

const validateTokensFromCookies = (req: Request, res: Response) => {
  const accessToken = req?.cookies[ACCESS_TOKEN];
  const refreshToken = req?.cookies[REFRESH_TOKEN];

  if (!accessToken || !refreshToken) {
    throw new Error(
      'Authentication failed, authentication tokens missing from header cookies',
    );
  }

  try {
    const { userId, email } = jwt.verify(
      accessToken,
      accessTokenSecret,
    ) as JwtPayload;

    req.user = { userId, email };
  } catch (error) {
    if ((error as Error).name === 'TokenExpiredError') {
      generateNewTokensFromRefreshToken(refreshToken, req, res);
    } else {
      console.error(error);
      throw new Error('Authentication failed, for an unexpected reason');
    }
  }
};

const authenicate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateTokensFromCookies(req, res);

    const userAccount = await UserService.getUserById(req.user?.userId ?? '');

    if (userAccount.suspended) {
      throw new Error('Authenication failed! User is suspened');
    }
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      error: 'Authenication failed, please check if you are still logged in',
    });
  }
};

export default authenicate;
