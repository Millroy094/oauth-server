import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { add, getUnixTime } from "date-fns";

import dotenv from "dotenv";
import { getAccessTokenFromUserCredentials } from "./utils/keycloak.js";
dotenv.config();

export const handler: Handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2 | void> => {
  try {
    const { username, password, redirectUri } = JSON.parse(event.body ?? "");

    const token = await getAccessTokenFromUserCredentials(username, password);

    const response = {
      statusCode: 307,
      statusDescription: "Temporary Redirect",
      headers: {
        location: redirectUri,
      },
      multiValueHeaders: {
        "Set-Cookie": [
          `accessToken=${
            token.access_token
          }; Domain=${redirectUri}; Expires=${getUnixTime(
            add(new Date(), { seconds: token.expires_in })
          )}; HttpOnly; Secure`,
          `refreshToken=${
            token.refresh_token
          }; Domain=${redirectUri}; Expires=${getUnixTime(
            add(new Date(), { seconds: token.refresh_expires_in })
          )}; HttpOnly; Secure`,
          `idToken=${
            token.id_token
          }; Domain=${redirectUri}; Expires=${getUnixTime(
            add(new Date(), { seconds: token.id_expires_in })
          )}; HttpOnly; Secure`,
        ],
      },
    };

    return response;
  } catch (err) {
    console.log(err);
  }
};
