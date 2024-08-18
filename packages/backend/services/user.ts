import { AnyItem } from 'dynamoose/dist/Item';
import isEmpty from 'lodash/isEmpty';
import bcrypt from 'bcryptjs';
import { User } from '../models';

class UserService {
  public static async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<AnyItem> {
    const [userAccount] = await User.scan('email').eq(username).exec();

    if (isEmpty(userAccount)) {
      throw new Error('User does not exist');
    }

    const passwordCompare = await bcrypt.compare(
      password,
      userAccount.password,
    );

    if (!passwordCompare) {
      throw new Error('Invalid password');
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
    const [userAccount] = await User.scan('email').eq(email).exec();

    if (!isEmpty(userAccount)) {
      throw new Error('User already exists');
    }

    await User.create(fields);
  }

  public static async getUserById(id: string): Promise<AnyItem> {
    const userAccount = await User.get(id);

    if (isEmpty(userAccount)) {
      throw new Error('User does not exists');
    }

    return userAccount;
  }

  public static async updateUser(
    userId: string,
    updatedFields: any,
  ): Promise<boolean> {
    await User.update(userId, updatedFields);

    return true;
  }
}

export default UserService;
