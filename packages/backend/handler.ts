import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import dotenv from "dotenv";
import { getAccessTokenFromUserCredentials } from "./utils/keycloak.js";
dotenv.config();

export const handler: Handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2 | void> => {
  try {
    const { username, password } = JSON.parse(event.body ?? "");

    console.log(username, password);
    const tokens = await getAccessTokenFromUserCredentials(username, password);

    const response = {
      statusCode: 200,
      body: JSON.stringify({ tokens }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
    };

    return response;
  } catch (err: any) {
    console.log(err);
    return { statusCode: 401, body: err.message };
  }
};
