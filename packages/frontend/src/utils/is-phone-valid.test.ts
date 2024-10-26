// isPhoneValid.test.ts
import isPhoneValid from './is-phone-valid';
import { PhoneNumberUtil } from 'google-libphonenumber';

vi.mock('google-libphonenumber', () => {
  const mockPhoneNumberUtil = {
    parseAndKeepRawInput: vi.fn(),
    isValidNumber: vi.fn()
  };

  return {
    PhoneNumberUtil: {
      getInstance: () => mockPhoneNumberUtil
    }
  };
});

describe('isPhoneValid', () => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true for a valid phone number', () => {
    const validPhoneNumber = '+14155552671'; // Example valid phone number
    phoneUtil.parseAndKeepRawInput.mockReturnValue(validPhoneNumber);
    phoneUtil.isValidNumber.mockReturnValue(true);

    const result = isPhoneValid(validPhoneNumber);
    expect(result).toBe(true);
    expect(phoneUtil.parseAndKeepRawInput).toHaveBeenCalledWith(
      validPhoneNumber
    );
    expect(phoneUtil.isValidNumber).toHaveBeenCalled();
  });

  it('should return false for an invalid phone number', () => {
    const invalidPhoneNumber = '123'; // Example invalid phone number
    phoneUtil.parseAndKeepRawInput.mockReturnValue(invalidPhoneNumber);
    phoneUtil.isValidNumber.mockReturnValue(false);

    const result = isPhoneValid(invalidPhoneNumber);
    expect(result).toBe(false);
    expect(phoneUtil.parseAndKeepRawInput).toHaveBeenCalledWith(
      invalidPhoneNumber
    );
    expect(phoneUtil.isValidNumber).toHaveBeenCalled();
  });

  it('should return false if an error is thrown during parsing', () => {
    const errorPhoneNumber = 'invalid-phone-number'; // Example phone number that causes an error
    phoneUtil.parseAndKeepRawInput.mockImplementation(() => {
      throw new Error('Invalid phone number format');
    });

    const result = isPhoneValid(errorPhoneNumber);
    expect(result).toBe(false);
    expect(phoneUtil.parseAndKeepRawInput).toHaveBeenCalledWith(
      errorPhoneNumber
    );
    expect(phoneUtil.isValidNumber).not.toHaveBeenCalled(); // isValidNumber should not be called
  });
});
