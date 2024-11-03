import {
  generateRegistrationOptions,
  verifyRegistrationResponse
} from '@simplewebauthn/server';
import { Request, Response } from 'express';
import UserService from '../services/user';
import logger from '../utils/logger';
import config from '../support/env-config';
import HTTP_STATUSES from '../constants/http-status';

class PasskeyController {
  public static async registerPasskey(req: Request, res: Response) {
    try {
      const userId = req.body.userId;

      const user = await UserService.getUserById(userId);

      const options = await generateRegistrationOptions({
        rpID: req.hostname,
        rpName: config.get('authentication.issuer'),
        userID: userId,
        userName: userId,
        userDisplayName: user.email,
        attestationType: 'none',
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred'
        }
      });

      user.currentChallenge = options.challenge;

      res.status(HTTP_STATUSES.ok).json(options);
    } catch (error) {
      logger.error(`Failed passkey registration ${(error as Error).message}`);
      res
        .status(HTTP_STATUSES.badRequest)
        .send({ error: 'There was an issue registering for passkey' });
    }
  }

  public static async verifyPasskeyRegisrtation(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const user = await UserService.getUserById(userId);

      const verification = await verifyRegistrationResponse({
        response: req.body.response,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: req.hostname,
        expectedRPID: req.hostname
      });

      if (verification.verified) {
        user.credentials.push({
          id: verification?.registrationInfo?.credential?.id,
          publicKey: verification?.registrationInfo?.credential?.publicKey,
          counter: verification?.registrationInfo?.credential?.counter
        });
        res.status(HTTP_STATUSES.ok).json({ verified: true });
      } else {
        res.status(HTTP_STATUSES.unauthorised).json({ verified: false });
      }
    } catch (error) {
      logger.error(
        `Failed verifying passkey registration ${(error as Error).message}`
      );
      res
        .status(HTTP_STATUSES.badRequest)
        .send({ error: 'There was an issue verifying passkey registration' });
    }
  }
}

export default PasskeyController;
