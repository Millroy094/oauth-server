import isEmpty from 'lodash/isEmpty';
import { OTP } from '../models';

class OTPService {
  public static async storeOtp(
    userId: string,
    type: 'APP' | 'SMS' | 'EMAIL',
    otp: string,
  ): Promise<void> {
    await OTP.create({
      userId,
      type,
      otp,
      expiresAt: Math.floor(Date.now() / 1000) + 300,
    });
  }

  public static async validateOtp(
    userId: string,
    type: 'SMS' | 'EMAIL',
    otp: string,
  ): Promise<boolean> {
    let isValid = false;
    console.log(otp);
    const [otpResult] = await OTP.scan('userId')
      .eq(userId)
      .and()
      .where('type')
      .eq(type)
      .and()
      .where('otp')
      .eq(otp)
      .exec();

    if (!isEmpty(otpResult)) {
      isValid = otpResult.expiresAt && Date.now() > otpResult.expiresAt * 1000;
      await otpResult.delete();
    }

    return isValid;
  }
}

export default OTPService;
