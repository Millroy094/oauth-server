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

  const otp = generateOtp();
  await OTPService.storeOtp(userId, 'email', otp);
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

  const otp = generateOtp();
  await OTPService.storeOtp(userId, 'sms', otp);
  await sendSMS(subscriber, `Here's your OTP ${otp} to login`);
};
