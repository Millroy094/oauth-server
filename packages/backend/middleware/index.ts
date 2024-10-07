import Provider from "oidc-provider";

declare global {
  namespace Express {
    interface Request {
      oidcProvider: Provider;
      user?: { userId: string; email: string };
    }
  }
}

export { default as addOIDCProvider } from "./add-oidc-provider";
export { default as authenticate } from "./authenticate";
export { default as authorize } from "./authorize";
