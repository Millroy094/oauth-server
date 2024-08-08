import { Configuration } from 'oidc-provider';
import DynamoDBAdapter from '../adapter/DynamoDbAdapter';
import jwks from '../keys.json' assert { type: 'json' };

const getConfiguration = (): Configuration => ({
  adapter: DynamoDBAdapter,
  jwks,
  cookies: {
    keys: [...JSON.parse(process?.env?.COOKIE_SECRETS ?? '[]')],
  },
  features: {
    devInteractions: { enabled: false },
  },
  findAccount: async (_, id) => {
    return {
      accountId: id,
      claims: async (_, scope) => {
        return { sub: id };
      },
    };
  },
  clients: [
    {
      client_id: 'local',
      client_secret: 'localhosttest',
      redirect_uris: ['http://localhost:3002/cb'],
      grant_types: ['authorization_code'],
      scope: 'openid',
    },
  ],
  pkce: { required: () => false, methods: ['S256'] },
  claims: {
    openid: ['sub'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: [
      'birthdate',
      'family_name',
      'gender',
      'given_name',
      'locale',
      'middle_name',
      'name',
      'nickname',
      'picture',
      'preferred_username',
      'profile',
      'updated_at',
      'website',
      'zoneinfo',
    ],
  },
  interactions: {
    url() {
      // eslint-disable-line no-unused-vars
      return '/interaction/intiate';
    },
  },
});

export default getConfiguration;
