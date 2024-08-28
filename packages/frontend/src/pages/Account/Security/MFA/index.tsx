import React, { FC } from 'react';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { PhonelinkLock } from '@mui/icons-material';

const MFA: FC<{}> = () => {
  return (
    <Card elevation={0}>
      <CardHeader title='Mulit-Factor Authentication' />
      <CardContent>
        <Typography>
          You can make your login more secure by enabling 2FA for your account.
          Once enabled you will be required to through an additional step of
          verification whilst logging in.
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}
      >
        <Button
          variant='outlined'
          startIcon={<PhonelinkLock />}
          color='success'
        >
          Set Up MFA
        </Button>
      </CardActions>
    </Card>
  );
};

export default MFA;
