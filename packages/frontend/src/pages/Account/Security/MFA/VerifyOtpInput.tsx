import React, { FC } from "react";
import { QRCodeSVG } from "qrcode.react";
import { APP_MFA, EMAIL_MFA, SMS_MFA } from "../../../../constants";
import { Button, FormHelperText, Grid, Typography } from "@mui/material";
import OTPInput from "react-otp-input";
import useTimer from "../../../../hooks/useTimer";
import sendMFAOtp from "../../../../api/send-mfa-otp";
import { useAuth } from "../../../../context/AuthProvider";
import useFeedback from "../../../../hooks/useFeedback";

interface IVerifyOtpInput {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  uri?: string;
  error: boolean;
}

const VerifyOtpInput: FC<IVerifyOtpInput> = (props) => {
  const { type, onChange, value, uri, error } = props;

  const { timer, resetTimer } = useTimer();
  const auth = useAuth();
  const { feedbackAxiosError } = useFeedback();

  const handleResendOtp = async (): Promise<void> => {
    try {
      await sendMFAOtp({ type, email: auth!.user!.email });
      resetTimer();
    } catch (err) {
      feedbackAxiosError(err, "Failed to resend OTP");
    }
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={4}>
      {type === APP_MFA && (
        <Grid direction="column" container item spacing={2}>
          <Grid container item direction="column">
            <Typography variant="h6">Scan the QR Code</Typography>
            <Typography>
              Scan the QR Code into your preferred authenticator app and then
              enter one-time code provided below
            </Typography>
          </Grid>
          <Grid container item justifyContent="center">
            <QRCodeSVG value={uri ?? ""} />
          </Grid>
        </Grid>
      )}
      {type === EMAIL_MFA && (
        <Grid direction="column" container item>
          <Grid container item direction="column" alignItems="center">
            <Grid item>
              <Typography>
                Please enter the 6 digit OTP sent to your selected email
              </Typography>
            </Grid>
            <Grid item container alignItems="center" justifyContent="center">
              <Typography>Haven't received OTP?</Typography>
              <Button onClick={handleResendOtp} disabled={timer !== 0}>
                {timer ? `Click here in ${timer} seconds` : "Click here"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
      {type === SMS_MFA && (
        <Grid direction="column" container item>
          <Grid container item direction="column" alignItems="center">
            <Grid item>
              <Typography>
                Please enter the 6 digit OTP sent to your selected phone number
              </Typography>
            </Grid>
            <Grid item container alignItems="center" justifyContent="center">
              <Typography>Haven't received OTP?</Typography>
              <Button onClick={handleResendOtp} disabled={timer !== 0}>
                {timer ? `Click here in ${timer} seconds` : "Click here"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item container direction="column" justifyContent="center">
        <OTPInput
          value={value}
          onChange={onChange}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          inputType="tel"
          containerStyle={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
          inputStyle={{ width: "50px", height: "50px", fontSize: "20px" }}
        />
        {error && (
          <Grid container justifyContent="center">
            <FormHelperText error>OTP must be 6 digits</FormHelperText>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default VerifyOtpInput;
