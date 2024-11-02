import OIDCService from './oidc';
import OIDCStore from '../models/OIDCStore';

jest.mock('../models/OIDCStore', () => ({
  scan: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  and: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue({
    toJSON: jest.fn(() => [
      {
        payload: {
          jti: 'sessionId123',
          loginTs: 1633036800000,
          authorizations: {
            client1: {},
            client2: {}
          },
          iat: 1633036800,
          exp: 1633040400
        }
      }
    ])
  })
}));

describe('OIDCService', () => {
  describe('getSessions', () => {
    it('should return formatted session data for a given userId', async () => {
      const userId = 'user123';
      const result = await OIDCService.getSessions(userId);

      expect(OIDCStore.scan).toHaveBeenCalledWith('payload.accountId');
      expect(OIDCStore.eq).toHaveBeenCalledWith(userId);
      expect(result).toEqual([
        {
          id: 'sessionId123',
          loggedInAt: 1633036800000,
          clients: ['client1', 'client2'],
          iat: 1633036800,
          exp: 1633040400
        }
      ]);
    });
  });
});
