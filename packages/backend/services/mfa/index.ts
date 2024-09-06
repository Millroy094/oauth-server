import omit from 'lodash/omit';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { User } from '../../models';
import { setupAppMFA, setupEmailMFA, setupSMSMFA } from './setup';
import { verifyAppMFA, verifyEmailMFA, verifySMSMFA } from './verify';
import { sendEmailOtp, sendSMSOtp } from './send';

class MFAService {
  public static async getMFASetting(userId: string): Promise<{
    types: { subscriber: string; verified: boolean }[];
    preference: string;
  }> {
    const userAccountMfaSetting = await User.get(userId, {
      attributes: ['mfa'],
    });

    if (isEmpty(userAccountMfaSetting)) {
      throw new Error('User does not exists');
    }

    return {
      types: map(
        omit(userAccountMfaSetting.mfa, 'preference'),
        ({ subscriber, verified }, type) => ({ type, subscriber, verified }),
      ),
      preference: userAccountMfaSetting.mfa.preference,
    };
  }

  public static async setupMFA(
    userId: string,
    type: 'APP' | 'SMS' | 'EMAIL',
    subscriber: string,
  ): Promise<void | {
    uri: string;
  }> {
    const setup = { APP: setupAppMFA, SMS: setupSMSMFA, EMAIL: setupEmailMFA };
    const response = await setup[type](userId, subscriber);
    return response;
  }

  public static async verifyMFA(
    userId: string,
    type: 'APP' | 'SMS' | 'EMAIL',
    otp: string,
  ): Promise<void> {
    const verify = {
      APP: verifyAppMFA,
      SMS: verifySMSMFA,
      EMAIL: verifyEmailMFA,
    };
    await verify[type](userId, otp);
  }

  public static async resetMFA(
    userId: string,
    type: 'APP' | 'SMS' | 'EMAIL',
  ): Promise<void> {
    const user = await User.get(userId);

    if (!user) {
      throw new Error('User does not exist');
    }

    user.mfa[type].subscriber = '';
    user.mfa[type].verified = false;

    if (type === 'APP') {
      user.mfa[type].secret = '';
    }

    await user.save();
  }

  public static async changePreference(
    userId: string,
    preference: 'APP' | 'SMS' | 'EMAIL',
  ): Promise<void> {
    const user = await User.get(userId);

    if (!user) {
      throw new Error('User does not exist');
    }

    user.mfa.preference = preference;

    await user.save();
  }

  public static async sendOtp(
    userId: string,
    type: 'SMS' | 'EMAIL',
    subscriber: string,
  ): Promise<void> {
    const sendOtp = {
      SMS: sendSMSOtp,
      EMAIL: sendEmailOtp,
    };

    await sendOtp[type](userId, subscriber);
  }
}

export default MFAService;
