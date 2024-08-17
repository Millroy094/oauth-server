import { Configuration } from 'oidc-provider';
import DynamoDBAdapter from '../adapter/DynamoDbAdapter';
import jwks from '../keys.json' assert { type: 'json' };
import AccountService from '../models/Account';

const getConfiguration = (): Configuration => ({
  adapter: DynamoDBAdapter,
  jwks,
  cookies: {
    keys: [...JSON.parse(process?.env?.COOKIE_SECRETS ?? '[]')],
    long: { httpOnly: true, sameSite: 'strict' },
    short: { httpOnly: true, sameSite: 'strict' },
  },
  features: {
    devInteractions: { enabled: false },
  },
  findAccount: async (_, id) => {
    const account = await AccountService.get(id);
    return (
      account && {
        accountId: id,
        claims: async (_, scope, claims) => {
          console.log(scope);
          console.log(claims);
          return {
            sub: id,
            ...(scope.includes('email') && {
              email: account.email,
              emailVerified: account.emailVerified,
            }),
            ...(scope.includes('phone') && {
              mobile: account.mobile,
            }),
            ...(scope.includes('profile') && {
              firstName: account.firstName,
              lastName: account.lastName,
            }),
          };
        },
      }
    );
  },
  clients: [
    {
      client_id: 'local',
      client_secret: 'localhosttest',
      redirect_uris: ['http://localhost:3002/cb'],
      grant_types: ['authorization_code'],
      scope: 'openid email',
    },
  ],
  pkce: { required: () => false, methods: ['S256'] },
  claims: {
    openid: ['sub'],
    email: ['email', 'emailVerified'],
    phone: ['mobile'],
    profile: ['firstName', 'lastName'],
  },
  interactions: {
    url: (ctx, interaction) =>
      `http://localhost:5173?interactionId=${interaction.jti}`,
  },
});

export default getConfiguration;
