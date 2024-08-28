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
          Multi-factor Authentication (MFA) is an authentication method that
          requires the user to provide two or more verification factors to gain
          access. To get started click on setup MFA
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
