import React, { FC } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { PhonelinkLock } from '@mui/icons-material';

const Security: FC<{}> = () => {
  return (
    <Card elevation={0}>
      <CardHeader
        title='Security'
        subheader='Mulit-Factor Authentication'
        action={
          <Button
            variant='outlined'
            startIcon={<PhonelinkLock />}
            color='success'
          >
            Set Up MFA
          </Button>
        }
      />
      <CardContent>
        <Typography>
          Multi-factor Authentication (MFA) is an authentication method that
          requires the user to provide two or more verification factors to gain
          access. To get started click on setup MFA
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Security;
