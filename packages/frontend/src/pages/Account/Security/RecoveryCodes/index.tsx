import React, { FC } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';

const RecoveryCodes: FC<{}> = () => {
  return (
    <Card elevation={0}>
      <CardHeader title='Recovery codes' />
      <CardContent>
        <Typography variant='body1'>
          Recovery codes can be used when your MFA method isn't available to you
          or if you have completely lost access to your MFA method.
        </Typography>
        <Typography variant='body1' sx={{ marginTop: '10px' }}>
          Recovery codes are one time use only. So once you have used one of
          them won't be able to use it again.
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          padding: '20px 20px 0 20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant='outlined' color='success'>
          Set up recovery codes
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecoveryCodes;
