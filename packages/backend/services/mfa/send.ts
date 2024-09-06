import isEmpty from 'lodash/isEmpty';
import { OTP, User } from '../../models';
import generateOtp from '../../utils/generate-otp';
import { sendEmail, sendSMS } from '../../utils/notification';
import OTPService from '../otp';

export const sendEmailOtp = async (
  userId: string,
  subscriber: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const [otpResult] = await OTP.scan('userId')
    .eq(userId)
    .and()
    .where('type')
    .eq('EMAIL')
    .exec();

  if (!isEmpty(otpResult)) {
    await otpResult.delete();
  }

  const otp = generateOtp();
  await OTPService.storeOtp(userId, 'EMAIL', otp);
  await sendEmail(subscriber, 'Login OTP', `Here's your OTP ${otp} to login`);
};

export const sendSMSOtp = async (
  userId: string,
  subscriber: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const [otpResult] = await OTP.scan('userId')
    .eq(userId)
    .and()
    .where('type')
    .eq('EMAIL')
    .exec();

  if (!isEmpty(otpResult)) {
    await otpResult.delete();
  }

  const otp = generateOtp();
  await OTPService.storeOtp(userId, 'SMS', otp);
  await sendSMS(subscriber, `Here's your OTP ${otp} to login`);
};
