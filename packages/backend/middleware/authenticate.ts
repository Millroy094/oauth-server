import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import {
  doesEnvironmentVariableValueMatch,
  getEnviromentConfiguration,
} from '../support/get-environment-configuration';

interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

const authenicate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req?.cookies[ACCESS_TOKEN];
  const refreshToken = req?.cookies[REFRESH_TOKEN];

  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      error: 'Authenication failed, please check if you are still logged in',
    });
  }

  const accessTokenSecret = getEnviromentConfiguration('ACCESS_JWT_SECRET');

  try {
    const { userId, email, isAdmin } = jwt.verify(
      accessToken,
      accessTokenSecret,
    ) as JwtPayload;
    req.user = { userId, email, isAdmin };
    next();
  } catch (error) {
    try {
      const refreshTokenSecret =
        getEnviromentConfiguration('REFRESH_JWT_SECRET');

      const { userId, email, isAdmin } = jwt.verify(
        refreshToken,
        refreshTokenSecret,
      ) as JwtPayload;
      const newAccessToken = jwt.sign({ userId, email }, accessTokenSecret, {
        expiresIn: getEnviromentConfiguration('ACCESS_JWT_EXPIRY', '1h'),
      });
      const newRefreshToken = jwt.sign({ userId, email }, accessTokenSecret, {
        expiresIn: getEnviromentConfiguration('REFRESH_JWT_EXPIRY', '1d'),
      });

      res
        .cookie(ACCESS_TOKEN, newAccessToken, {
          httpOnly: true,
          secure: doesEnvironmentVariableValueMatch('NODE_ENV', 'production'),
        })
        .cookie(REFRESH_TOKEN, newRefreshToken, {
          httpOnly: true,
          secure: doesEnvironmentVariableValueMatch('NODE_ENV', 'production'),
        });

      req.user = { userId, email, isAdmin };

      next();
    } catch (error) {
      res.status(401).json({
        error: 'Authenication failed, please check if you are still logged in',
      });
    }
  }
};

export default authenicate;
