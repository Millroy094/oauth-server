import { Configuration } from 'oidc-provider';
import fs from 'fs';
import DynamoDBAdapter from '../adapter/DynamoDbAdapter';
import { User } from '../models';
import getEnv from './env-config';
import { ClientService } from '../services';

const getConfiguration = async (): Promise<Configuration> => {
  const clients = await ClientService.getClients();
  const keys = fs.readFileSync(`${__dirname}/../keys.json`);

  return {
    adapter: DynamoDBAdapter,
    jwks: JSON.parse(keys.toString('utf-8') ?? ''),
    cookies: {
      keys: [...JSON.parse(getEnv('oidc.cookieSecrets'))],
      long: { httpOnly: true, sameSite: 'strict' },
      short: { httpOnly: true, sameSite: 'strict' },
    },
    features: {
      devInteractions: { enabled: false },
    },
    findAccount: async (_, id) => {
      const account = await User.get(id);
      return (
        account && {
          accountId: id,
          claims: async (_, scope, claims) => {
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
    clients: clients.map((client) => ({
      client_id: client.clientId,
      client_secret: client.secret,
      redirect_uris: client.redirectUris,
      grant_types: client.grants,
      scope: client.scopes.join(' '),
    })),
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
  };
};

export default getConfiguration;
