import express from 'express';
import dynamoose from 'dynamoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { oidcRoutes, userRoutes } from './routes';

class Application {
  private readonly expressApp;

  constructor() {
    this.expressApp = express();
  }

  private setupDependencies(): void {
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
  }

  private setupRoutes(): void {
    this.expressApp.use('/oidc', oidcRoutes);
    this.expressApp.use('/user', userRoutes);
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
