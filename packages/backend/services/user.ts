import { AnyItem } from "dynamoose/dist/Item";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import map from "lodash/map";
import bcrypt from "bcryptjs";
import { User } from "../models";
import OIDCService from "./oidc";

class UserService {
  public static async validateUserCredentials(
    username: string,
    password: string
  ): Promise<AnyItem> {
    const [userAccount] = await User.scan("email").eq(username).exec();

    if (isEmpty(userAccount)) {
      throw new Error("User does not exist");
    }

    const passwordCompare = await bcrypt.compare(
      password,
      userAccount.password
    );

    if (!passwordCompare) {
      throw new Error("Invalid password");
    }

    return userAccount;
  }

  public static async createUser(fields: {
    email: string;
    firstName: string;
    lastName: string;
    mobile?: string;
    password: string;
  }): Promise<void> {
    const { email } = fields;
    const [userAccount] = await User.scan("email").eq(email).exec();

    if (!isEmpty(userAccount)) {
      throw new Error("User already exists");
    }

    await User.create(fields);
  }

  public static async getUsers(): Promise<AnyItem[]> {
    const userAccounts = await User.scan().exec();
    return userAccounts;
  }

  public static async getUserById(id: string): Promise<AnyItem> {
    const userAccount = await User.get(id, {
      attributes: [
        "userId",
        "firstName",
        "lastName",
        "email",
        "emailVerified",
        "mobile",
        "roles",
      ],
    });

    if (isEmpty(userAccount)) {
      throw new Error("User does not exists");
    }

    return userAccount;
  }

  public static async updateUser(
    userId: string,
    updatedFields: any
  ): Promise<boolean> {
    await User.update(userId, updatedFields);

    return true;
  }

  public static async deleteUser(userId: string): Promise<boolean> {
    await OIDCService.deleteAllSessions(userId);
    const user = await this.getUserById(userId);
    await user.delete();
    return true;
  }

  public static async getMFASetting(id: string): Promise<{
    types: { subscriber: string; verified: boolean }[];
    preference: string;
  }> {
    const userAccountMfaSetting = await User.get(id, {
      attributes: ["mfa"],
    });

    if (isEmpty(userAccountMfaSetting)) {
      throw new Error("User does not exists");
    }

    return {
      types: map(
        omit(userAccountMfaSetting.mfa, "preference"),
        ({ subscriber, verified }, type) => ({ type, subscriber, verified })
      ),
      preference: userAccountMfaSetting.mfa.preference,
    };
  }
}

export default UserService;
