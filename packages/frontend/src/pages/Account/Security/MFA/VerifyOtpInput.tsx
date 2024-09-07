import React, { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { APP_MFA } from '../../../../constants';
import { FormHelperText, Grid, Typography } from '@mui/material';
import OTPInput from 'react-otp-input';

interface IVerifyOtpInput {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  uri?: string;
  error: boolean;
}

const VerifyOtpInput: FC<IVerifyOtpInput> = (props) => {
  const { type, onChange, value, uri, error } = props;

  return (
    <Grid container direction='column' alignItems='center' spacing={4}>
      {type === APP_MFA && (
        <Grid direction='column' container item spacing={2}>
          <Grid container item direction='column'>
            <Typography variant='h6'>Scan the QR Code</Typography>
            <Typography>
              Scan the QR Code into your preferred authenticator app and then
              enter one-time code provided below
            </Typography>
          </Grid>
          <Grid container item justifyContent='center'>
            <QRCodeSVG value={uri ?? ''} />
          </Grid>
        </Grid>
      )}
      <Grid item container direction='column' justifyContent='center'>
        <OTPInput
          value={value}
          onChange={onChange}
          numInputs={6}
          renderSeparator={<span> </span>}
          renderInput={(props) => <input {...props} type='number' />}
          containerStyle={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
          }}
          inputStyle={{ width: '50px', height: '50px', fontSize: '20px' }}
        />
        {error && (
          <Grid container justifyContent='center'>
            <FormHelperText error>OTP must be 6 digits</FormHelperText>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default VerifyOtpInput;
