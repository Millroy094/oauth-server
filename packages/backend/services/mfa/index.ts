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
    type: 'app' | 'sms' | 'email',
    subscriber: string,
  ): Promise<void | {
    uri: string;
  }> {
    const setup = { app: setupAppMFA, sms: setupSMSMFA, email: setupEmailMFA };
    const response = await setup[type](userId, subscriber);
    return response;
  }

  public static async verifyMFA(
    userId: string,
    type: 'app' | 'sms' | 'email',
    otp: string,
  ): Promise<void> {
    const verify = {
      app: verifyAppMFA,
      sms: verifySMSMFA,
      email: verifyEmailMFA,
    };
    await verify[type](userId, otp);
  }

  public static async resetMFA(
    userId: string,
    type: 'app' | 'sms' | 'email',
  ): Promise<void> {
    const user = await User.get(userId);

    if (!user) {
      throw new Error('User does not exist');
    }

    user.mfa[type].subscriber = '';
    user.mfa[type].verified = false;

    if (user.mfa.preference === type) {
      user.mfa.preference = '';
    }

    if (type === 'app') {
      user.mfa[type].secret = '';
    }

    await user.save();
  }

  public static async changePreference(
    userId: string,
    preference: 'app' | 'sms' | 'email',
  ): Promise<void> {
    const user = await User.get(userId);

    if (!user) {
      throw new Error('User does not exist');
    }

    user.mfa.preference = preference;

    await user.save();
  }

  public static async sendOtp(
    email: string,
    type: 'sms' | 'email',
  ): Promise<void> {
    const sendOtp = {
      sms: sendSMSOtp,
      email: sendEmailOtp,
    };

    const [user] = await User.scan('email').eq(email).exec();

    if (!user) {
      throw new Error('User does not exist');
    }

    if (!user.mfa[type].subscriber) {
      throw new Error('User MFA method does not have a subscriber set');
    }

    await sendOtp[type](user.userId, user.mfa[type].subscriber);
  }

  public static async getSelectedMFAConfigurationByEmail(
    email: string,
  ): Promise<{ enabled: boolean; type: string }> {
    const [user] = await User.scan('email').eq(email).exec();

    if (!user) {
      return { enabled: false, type: '' };
    }

    return { enabled: !!user.mfa.preference, type: user.mfa.preference };
  }
}

export default MFAService;
