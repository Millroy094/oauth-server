import express from 'express';
import dynamoose from 'dynamoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { adminRoutes, oidcRoutes, userRoutes } from './routes';
import { getEnviromentConfiguration } from './support/get-environment-configuration';
import { addOIDCProvider } from './middleware';

class Application {
  private readonly expressApp;

  constructor() {
    this.expressApp = express();
  }

  private setupDependencies(): void {
    const NODE_ENV = getEnviromentConfiguration('NODE_ENV', 'development');

    if (NODE_ENV === 'development') {
      const ddb = new dynamoose.aws.ddb.DynamoDB({
        endpoint: getEnviromentConfiguration(
          'DYNAMO_DB_ENDPOINT',
          'http://localhost:8000',
        ),
        credentials: {
          accessKeyId: 'LOCAL',
          secretAccessKey: 'LOCAL',
        },
        region: 'local',
      });
      dynamoose.aws.ddb.set(ddb);
    }
  }

  private setupMiddleware(): void {
    this.expressApp.use(
      cors({
        origin: ['http://localhost:5173'],
        credentials: true,
      }),
    );
    this.expressApp.use(cookieParser());
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(addOIDCProvider);
  }

  private setupRoutes(): void {
    this.expressApp.use('/oidc', oidcRoutes);
    this.expressApp.use('/user', userRoutes);
    this.expressApp.use('/admin', adminRoutes);
  }

  public start() {
    this.setupDependencies();
    this.setupMiddleware();
    this.setupRoutes();
    this.expressApp.listen(3000);
  }
}

const app = new Application();
export default app;
