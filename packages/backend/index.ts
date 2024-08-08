import express from 'express';
import dynamoose from 'dynamoose';
import Provider from 'oidc-provider';
import dotenv from 'dotenv';
import getConfiguration from './support/get-configuration';

dotenv.config();
const app = express();

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

app.get('/interaction/intiate', async (req, res) => {
  const { prompt, jti } = await oidc.interactionDetails(req, res);

  switch (prompt.name) {
    case 'login':
      res.redirect(`http://localhost:5173/login/interaction/${jti}`);
      break;
  }
});

app.use('/oidc', oidc.callback());

app.listen(3000);
