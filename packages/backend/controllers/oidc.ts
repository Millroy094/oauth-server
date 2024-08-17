import { Request, Response } from 'express';
import Provider from 'oidc-provider';
import getConfiguration from '../support/get-configuration';
import { UserService } from '../services';
import { HTTP_STATUSES } from '../constants';

class OIDCController {
  private static readonly oidc = new Provider(
    'http://localhost:3000',
    getConfiguration(),
  );

  public static async getInteractionStatus(req: Request, res: Response) {
    try {
      const {
        prompt: { name },
      } = await OIDCController.oidc.interactionDetails(req, res);
      res.status(HTTP_STATUSES.ok).json({ status: name });
    } catch (err) {
      console.log(err);
      res
        .status(HTTP_STATUSES.badRequest)
        .json({ error: 'Unable to process authentication' });
    }
  }

  public static async authenticateInteraction(req: Request, res: Response) {
    let result = {};
    try {
      const interactionDetails = await OIDCController.oidc.interactionDetails(
        req,
        res,
      );
      const {
        prompt: { name },
      } = interactionDetails;

      if (name !== 'login') {
        throw new Error('Interaction is not at login stage');
      }

      const userAccount = await UserService.validateUserCredentials(
        req.body.email,
        req.body.password,
      );

      result = {
        login: {
          accountId: userAccount.userId,
        },
      };
      const redirect = await OIDCController.oidc.interactionResult(
        req,
        res,
        result,
        {
          mergeWithLastSubmission: false,
        },
      );
      res
        .status(HTTP_STATUSES.ok)
        .json({ redirect, message: 'Login successful!' });
    } catch (err) {
      console.log(err);
      if ((err as Error).message === 'Interaction is not at login stage') {
        result = {
          error: 'access_denied',
          error_description: 'Username or password is incorrect.',
        };
        const redirect = await OIDCController.oidc.interactionResult(
          req,
          res,
          result,
          {
            mergeWithLastSubmission: false,
          },
        );
        res.status(HTTP_STATUSES.ok).json({ redirect });
      } else {
        res
          .status(HTTP_STATUSES.unauthorised)
          .json({ error: 'Invalid email or password' });
      }
    }
  }

  public static async authorizeInteraction(req: Request, res: Response) {
    let result = {};
    try {
      const interactionDetails = await OIDCController.oidc.interactionDetails(
        req,
        res,
      );
      const {
        prompt: { name, details },
        params,
        session: { accountId },
      } = interactionDetails as any;

      if (name !== 'consent') {
        throw new Error('Interaction is not at consent stage');
      }

      const grant = interactionDetails.grantId
        ? await OIDCController.oidc.Grant.find(interactionDetails.grantId)
        : new OIDCController.oidc.Grant({
            accountId,
            clientId: params.client_id as string,
          });

      if (grant) {
        if (details.missingOIDCScope) {
          grant.addOIDCScope(details.missingOIDCScope.join(' '));
        }
        if (details.missingOIDCClaims) {
          grant.addOIDCClaims(details.missingOIDCClaims);
        }
        if (details.missingResourceScopes) {
          for (const [indicator, scopes] of Object.entries(
            details.missingResourceScopes,
          )) {
            grant.addResourceScope(indicator, (scopes as any).join(' '));
          }
        }

        const grantId = await grant.save();

        const result = { consent: { grantId } };
        const redirect = await OIDCController.oidc.interactionResult(
          req,
          res,
          result,
          {
            mergeWithLastSubmission: true,
          },
        );
        res
          .json({ redirect, message: 'Authorisation successful!' })
          .status(HTTP_STATUSES.ok);
      }
    } catch (err) {
      console.log(err);
      if ((err as Error).message === 'Interaction is not at consent stage') {
        result = {
          error: 'access_denied',
          error_description: 'Authorisation failed.',
        };
        const redirect = await OIDCController.oidc.interactionResult(
          req,
          res,
          result,
          {
            mergeWithLastSubmission: false,
          },
        );
        res.status(HTTP_STATUSES.ok).json({ redirect });
      } else {
        res
          .status(HTTP_STATUSES.unauthorised)
          .json({ error: 'Authorisation failed' });
      }
    }
  }

  public static async setupOidc(req: Request, res: Response) {
    const cb = OIDCController.oidc.callback();
    return cb(req, res);
  }
}

export default OIDCController;
