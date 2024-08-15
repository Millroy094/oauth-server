import { Router } from 'express';
import bcrypt from 'bcryptjs';
import isEmpty from 'lodash/isEmpty';
import Provider from 'oidc-provider';
import getConfiguration from '../support/get-configuration';
import AccountService from '../models/Account';

const oidc = new Provider('http://localhost:3000', getConfiguration());
const router = Router();

router.get('/interaction/:uid/status', async (req, res) => {
  try {
    const {
      prompt: { name },
    } = await oidc.interactionDetails(req, res);

    res.status(200).json({ status: name });
  } catch (err) {
    res.status(400).json({ error: 'Unable to process authentication' });
  }
});

router.post('/interaction/:uid/login', async (req, res) => {
  let result = {};
  try {
    const interactionDetails = await oidc.interactionDetails(req, res);
    const {
      prompt: { name },
    } = interactionDetails;

    if (true) {
      throw new Error('Interaction is not at login stage');
    }

    const [userAccount] = await AccountService.scan('email')
      .eq(req.body.email)
      .exec();

    if (isEmpty(userAccount)) {
      throw new Error('User does not exist');
    }

    const passwordCompare = await bcrypt.compare(
      req.body.password,
      userAccount.password,
    );

    if (!passwordCompare) {
      throw new Error('Invalid password');
    }
    result = {
      login: {
        accountId: userAccount.userId,
      },
    };
    const redirect = await oidc.interactionResult(req, res, result, {
      mergeWithLastSubmission: false,
    });
    res.status(200).json({ redirect, message: 'Login successful!' });
  } catch (err) {
    if ((err as Error).message === 'Interaction is not at login stage') {
      result = {
        error: 'access_denied',
        error_description: 'Username or password is incorrect.',
      };
      const redirect = await oidc.interactionResult(req, res, result, {
        mergeWithLastSubmission: false,
      });
      res.status(200).json({ redirect });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  }
});

router.post('/interaction/:uid/confirm', async (req, res) => {
  let result = {};
  try {
    const interactionDetails = await oidc.interactionDetails(req, res);
    const {
      prompt: { name, details },
      params,
      session: { accountId },
    } = interactionDetails as any;

    if (name !== 'consent') {
      throw new Error('Interaction is not at consent stage');
    }

    const grant = interactionDetails.grantId
      ? await oidc.Grant.find(interactionDetails.grantId)
      : new oidc.Grant({
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
      const redirect = await oidc.interactionResult(req, res, result, {
        mergeWithLastSubmission: true,
      });
      res.json({ redirect, message: 'Authorisation successful!' });
    }
  } catch (err) {
    if ((err as Error).message === 'Interaction is not at consent stage') {
      result = {
        error: 'access_denied',
        error_description: 'Authorisation failed.',
      };
      const redirect = await oidc.interactionResult(req, res, result, {
        mergeWithLastSubmission: false,
      });
      res.status(200).json({ redirect });
    } else {
      res.status(401).json({ error: 'Authorisation failed' });
    }
  }
});

router.use('/', oidc.callback());

export default router;
