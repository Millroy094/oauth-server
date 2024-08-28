import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import getEnv from '../support/env-config';

interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
}

const authenicate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req?.cookies[ACCESS_TOKEN];
  const refreshToken = req?.cookies[REFRESH_TOKEN];

  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      error: 'Authenication failed, please check if you are still logged in',
    });
  }

  const accessTokenSecret = getEnv('authentication.accessTokenSecret');

  try {
    const { userId, email, roles } = jwt.verify(
      accessToken,
      accessTokenSecret,
    ) as JwtPayload;
    req.user = { userId, email, roles };
    next();
  } catch (error) {
    try {
      const refreshTokenSecret = getEnv('authentication.refreshTokenSecret');

      const { userId, email, roles } = jwt.verify(
        refreshToken,
        refreshTokenSecret,
      ) as JwtPayload;
      const newAccessToken = jwt.sign({ userId, email }, accessTokenSecret, {
        expiresIn: getEnv('authentication.accessTokenExpiry'),
      });
      const newRefreshToken = jwt.sign({ userId, email }, accessTokenSecret, {
        expiresIn: getEnv('authentication.refreshTokenExpiry'),
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

      req.user = { userId, email, roles };

      next();
    } catch (error) {
      res.status(401).json({
        error: 'Authenication failed, please check if you are still logged in',
      });
    }
  }
};

export default authenicate;
