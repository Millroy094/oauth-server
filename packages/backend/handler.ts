import {
  Handler,
  Context,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import dotenv from "dotenv";
import { getAccessTokenFromUserCredentials } from "./utils/keycloak.js";
dotenv.config();

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2 | void> => {
  try {
    const { username, password } = JSON.parse(event.body ?? "");

    console.log(username, password);
    const tokens = await getAccessTokenFromUserCredentials(username, password);

    // const response = {
    //   statusCode: 200,
    //   body: JSON.stringify({ tokens }),
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    //     "Access-Control-Allow-Headers": "Content-Type",
    //     "Access-Control-Allow-Credentials": true,
    //   },
    // };

    // const response = {
    //   statusCode: 307,
    //   statusDescription: "Temporary Redirect",
    //   headers: {
    //     location: "https://jwt.io",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    //     "Access-Control-Allow-Headers": "Content-Type",
    //     "Access-Control-Allow-Credentials": true,
    //   },
    //   cookies: [],
    // };

    context.succeed({ location: "https://jwt.io" });

    // return response;
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: 401,
      body: err.message,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};
