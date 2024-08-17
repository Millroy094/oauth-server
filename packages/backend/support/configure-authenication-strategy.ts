import { Request } from 'express';
import passportJWT from 'passport-jwt';
import { PassportStatic } from 'passport';
const JWTStrategy = passportJWT.Strategy;

const secret = process?.env?.JWT_SECRET ?? 'sssss';

const cookieExtractor = (req: Request) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['admin_access_token'];
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
