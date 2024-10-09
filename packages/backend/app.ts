import express from "express";
import path from "path";
import https from "https";
import fs from "fs";
import dynamoose from "dynamoose";
import Provider from "oidc-provider";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.ts";
import oidcRoutes from "./routes/oidc.ts";
import userRoutes from "./routes/user.ts";
import addOIDCProvider from "./middleware/add-oidc-provider.ts";
import config from "./support/env-config.ts";

declare global {
  namespace Express {
    interface Request {
      oidcProvider: Provider;
      user?: { userId: string; email: string };
    }
  }
}

class Application {
  private readonly expressApp;
  private readonly environment;

  constructor() {
    this.expressApp = express();
    this.environment = config.get("env");
  }

  private setupDependencies(): void {
    if (this.environment === "development") {
      const ddb = new dynamoose.aws.ddb.DynamoDB({
        endpoint: config.get("db"),
        credentials: {
          accessKeyId: "LOCAL",
          secretAccessKey: "LOCAL",
        },
        region: "local",
      });
      dynamoose.aws.ddb.set(ddb);
    }
  }

  private setupMiddleware(): void {
    if (this.environment === "development") {
      this.expressApp.use(
        cors({
          origin: ["http://localhost:5173"],
          credentials: true,
        })
      );
    }
    this.expressApp.use(cookieParser());
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(addOIDCProvider);
  }

  private setupWebsite(): void {
    this.expressApp.use(express.static(`${path.resolve()}/public`));
    this.expressApp.use((req, res, next) => {
      if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
      } else {
        res.header(
          "Cache-Control",
          "private, no-cache, no-store, must-revalidate"
        );
        res.header("Expires", "-1");
        res.header("Pragma", "no-cache");
        res.sendFile(`${path.resolve()}/public/index.html`);
      }
    });
  }

  private setupRoutes(): void {
    this.expressApp.use("/api/oidc", oidcRoutes);
    this.expressApp.use("/api/user", userRoutes);
    this.expressApp.use("/api/admin", adminRoutes);
  }

  private openConnection(): void {
    const httpsServer = https.createServer(
      {
        key: fs.readFileSync("./certs/key.pem"),
        cert: fs.readFileSync("./certs/cert.pem"),
      },
      this.expressApp
    );

    httpsServer.listen(3000, () => {
      console.log("HTTPS Server running on port 3000");
    });
  }

  public start() {
    this.setupDependencies();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebsite();
    this.openConnection();
  }
}

const app = new Application();
export default app;
