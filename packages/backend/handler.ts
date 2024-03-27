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
    const { username, password } = JSON.parse(event.body ?? "");

    const tokens = await getAccessTokenFromUserCredentials(username, password);

    const response = {
      statusCode: 200,
      body: JSON.stringify({ tokens }),
    };

    return response;
  } catch (err: any) {
    console.log(err);
    return { statusCode: 401, body: err.message };
  }
};
