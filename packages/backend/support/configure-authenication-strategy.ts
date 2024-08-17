import { Request } from 'express';
import passportJWT from 'passport-jwt';
import { PassportStatic } from 'passport';
import { getEnviromentConfiguration } from './get-environment-configuration';
import { ACCESS_TOKEN } from '../constants';

const JWTStrategy = passportJWT.Strategy;

const secret = getEnviromentConfiguration('JWT_SECRET', 'TEST');

const cookieExtractor = (req: Request) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies[ACCESS_TOKEN];
  }

  return jwt;
};

const configureAuthenicationStrategy = (passport: PassportStatic) => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: secret,
      },
      (jwtPayload, done) => {
        const { expiration } = jwtPayload;

        if (Date.now() > expiration) {
          done('Unauthorized', false);
        }

        done(null, jwtPayload);
      },
    ),
  );
};

export default configureAuthenicationStrategy;
