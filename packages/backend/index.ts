import express from 'express';
import dynamoose from 'dynamoose';
import Provider from 'oidc-provider';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import getConfiguration from './support/get-configuration';
import AccountService from './models/Account';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    endpoint: process.env.DYNAMO_DB_ENDPOINT,
    credentials: {
      accessKeyId: 'LOCAL',
      secretAccessKey: 'LOCAL',
    },
    region: 'local',
  });
  dynamoose.aws.ddb.set(ddb);
}

const oidc = new Provider('http://localhost:3000', getConfiguration());

app.get('/interaction/:uid/status', async (req, res) => {
  const {
    prompt: { name },
  } = await oidc.interactionDetails(req, res);

  res.send({ status: name });
});

app.post('/interaction/:uid/login', async (req, res) => {
  const {
    prompt: { name },
  } = await oidc.interactionDetails(req, res);
  console.log(name);
  if (name === 'login') {
    const [userAccount] = await AccountService.scan('email')
      .eq(req.body.email)
      .exec();

    if (!userAccount) {
      res.send('Not Found').status(404);
    }

    const redirect = await oidc.interactionResult(
      req,
      res,
      {
        login: {
          accountId: userAccount.userId,
        },
      },
      { mergeWithLastSubmission: false },
    );
    res.send({ redirect });
  }
});

app.post('/interaction/:uid/confirm', async (req, res) => {
  const interactionDetails = await oidc.interactionDetails(req, res);
  const {
    prompt: { name, details },
    params,
    session: { accountId },
  } = interactionDetails as any;
  if (name === 'consent') {
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
      console.log(redirect);
      res.send({ redirect });
    }
  }
});

app.use('/oidc', oidc.callback());

app.listen(3000);
