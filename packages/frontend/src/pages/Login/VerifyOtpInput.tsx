import React, { FC, useEffect } from "react";
import {
  APP_MFA,
  EMAIL_MFA,
  EMAIL_VERIFICATION,
  SMS_MFA,
} from "../../constants";
import { Button, FormHelperText, Grid, Typography } from "@mui/material";
import OTPInput from "react-otp-input";
import useTimer from "../../hooks/useTimer";
import sendOtp from "../../api/send-otp";
import useFeedback from "../../hooks/useFeedback";
import { Control, Controller } from "react-hook-form";

interface IVerifyOtpInput {
  email: string;
  type: string;
  control: Control<ILoginFormInput>;
}

const VerifyOtpInput: FC<IVerifyOtpInput> = React.memo((props) => {
  const { email, type, control } = props;

  const { timer, resetTimer } = useTimer();
  const { feedbackAxiosError } = useFeedback();

  useEffect(() => {
    if ([SMS_MFA, EMAIL_MFA, EMAIL_VERIFICATION].includes(type)) {
      handleResendOtp();
    }
  }, []);

  const handleResendOtp = async (): Promise<void> => {
    try {
      await sendOtp({ type, email });
      resetTimer();
    } catch (err) {
      feedbackAxiosError(err, "Failed to resend OTP");
    }
  };

  return (
    <Grid item container direction="column" alignItems="center" spacing={4}>
      {type === APP_MFA && (
        <Grid container item direction="column" alignItems="center">
          <Grid item>
            <Typography align="center">
              Please enter the 6 digit one time passcode shown on your chosen
              authenticator app
            </Typography>
          </Grid>
        </Grid>
      )}
      {type === EMAIL_MFA && (
        <Grid direction="column" container item>
          <Grid container item direction="column" alignItems="center">
            <Grid item>
              <Typography align="center">
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
              <Typography align="center">
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
      {type === EMAIL_VERIFICATION && (
        <Grid direction="column" container item>
          <Grid container item direction="column" alignItems="center">
            <Grid item>
              <Typography align="center">
                Please enter the 6 digit OTP sent to your email to verify your
                email
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
      <Grid item container>
        <Controller
          name="otp"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Grid container spacing={1} justifyContent="center">
              <Grid item>
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
                  inputStyle={{
                    width: "50px",
                    height: "50px",
                    fontSize: "20px",
                  }}
                />
              </Grid>
              {error && (
                <Grid item container justifyContent="center">
                  <FormHelperText error>OTP must be 6 digits</FormHelperText>
                </Grid>
              )}
            </Grid>
          )}
        />
      </Grid>
    </Grid>
  );
});

export default VerifyOtpInput;
