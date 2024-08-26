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
}

const authenicate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req?.cookies[ACCESS_TOKEN];
  const refreshToken = req?.cookies[REFRESH_TOKEN];

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: 'Access denied' });
  }

  const accessTokenSecret = getEnviromentConfiguration('ACCESS_JWT_SECRET');

  try {
    const { userId, email } = jwt.verify(
      accessToken,
      accessTokenSecret,
    ) as JwtPayload;
    req.user = { userId, email };
    next();
  } catch (error) {
    try {
      const refreshTokenSecret =
        getEnviromentConfiguration('REFRESH_JWT_SECRET');

      const { userId, email } = jwt.verify(
        refreshToken,
        refreshTokenSecret,
      ) as JwtPayload;
      const newAccessToken = jwt.sign({ userId, email }, accessTokenSecret, {
        expiresIn: getEnviromentConfiguration('ACCESS_JWT_EXPIRY'),
      });
      const newRefreshToken = jwt.sign({ userId, email }, accessTokenSecret, {
        expiresIn: getEnviromentConfiguration('REFRESH_JWT_EXPIRY'),
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

      req.user = { userId, email };

      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};

export default authenicate;
