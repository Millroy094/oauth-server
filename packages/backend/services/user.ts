import { AnyItem } from "dynamoose/dist/Item";
import isEmpty from "lodash/isEmpty";
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

  public static async getUserByEmail(email: string) {
    const [user] = await User.scan("email").eq(email).exec();

    if (isEmpty(user)) {
      throw new Error("User does not exists");
    }
    return user;
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

  public static async getLoginConfiguration(email: string): Promise<{
    emailVerified: boolean;
    mfa: { enabled: boolean; type: string };
  }> {
    let user = null;

    try {
      user = await UserService.getUserByEmail(email);
    } catch (err) {
      console.error("User not found");
    }

    if (!user) {
      return { emailVerified: true, mfa: { enabled: false, type: "" } };
    }

    return {
      emailVerified: true,
      mfa: { enabled: !!user.mfa.preference, type: user.mfa.preference },
    };
  }
}

export default UserService;
