import dotenv from 'dotenv';
import get from 'lodash/get';
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

const config = {
  oidc: {
    cookieSecrets: envs?.COOKIE_SECRETS ?? '[]',
  },
  environment: envs?.NODE_ENV ?? 'development',
  db: {
    endpoint: envs?.DYNAMO_DB_ENDPOINT ?? 'http://localhost:8000',
  },
  authentication: {
    accessTokenSecret: envs?.ACCESS_JWT_SECRET ?? 'AccessTokenSecret',
    accessTokenExpiry: envs?.ACCESS_JWT_EXPIRY ?? '2h',
    refreshTokenSecret: envs!.REFRESH_JWT_SECRET ?? 'RefreshTokenSecret',
    refreshTokenExpiry: envs?.REFRESH_JWT_EXPIRY ?? '1d',
  },
  encryption: {
    secret: envs?.ENCRYPTION_SECRET_KEY ?? 'VeryBigSecret',
    secretiv: envs?.ENCRYPTION_SECRET_IV ?? 'EvenMoreVeryBigSecret',
    method: envs?.ECNRYPTION_METHOD ?? 'aes-256-cbc',
  },
};

const getEnv = (key: string): string => get(config, key, '');

export default getEnv;
