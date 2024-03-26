import axios from "axios";
import qs from "querystring";

export const getAccessTokenFromUserCredentials = async (
  username: string,
  password: string
) => {
  const url = `${process.env.keycloak_auth_server_url}/realms/${process.env.keycloak_realm}/protocol/openid-connect/token`;

  const body = {
    grant_type: "password",
    client_id: process.env.keycloak_client_id,
    client_secret: process.env.keycloak_client_secret,
    username,
    password,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    let result = await axios.post(url, qs.stringify(body), config);
    if (result.status >= 400) {
      throw new Error(result.statusText);
    }
    return result.data;
  } catch (error) {
    console.error(
      "error getting access token from username & password -",
      error
    );
    throw error;
  }
};
