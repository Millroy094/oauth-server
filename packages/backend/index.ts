import express from 'express';
import dynamoose from 'dynamoose';
import Provider from 'oidc-provider';
import DynamoDBAdapter from './adapter/DynamoDbAdapter';

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

const oidc = new Provider('http://localhost:3000', {
  adapter: DynamoDBAdapter,
});

app.use('/oidc', oidc.callback());

app.listen(3000);
