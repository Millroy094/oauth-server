import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  styled,
  TextField,
} from '@mui/material';
import PasswordField from '../../components/PasswordField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import schema from './schema';
import PasswordPopover from '../../components/PasswordPopover';

const StyledCard = styled(Card)({
  borderTop: '2px solid red',
});

const ForgotPassword = () => {
  const {
    register,
    // handleSubmit,
    formState: { errors, dirtyFields },
    // reset,
  } = useForm<IForgotPasswordFormInput>({
    resolver: yupResolver(schema, {}),
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      email: '',
      emailSent: false,
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.target.parentElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth='sm'>
      <StyledCard sx={{ marginTop: 15 }}>
        <CardHeader
          title='Forgot Password'
          titleTypographyProps={{ align: 'center' }}
        />
        <CardContent>
          <Grid container direction='column' spacing={2} sx={{ p: 2 }}>
            <Grid item>
              <TextField
                {...register('email')}
                label='Email Address'
                variant='outlined'
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
            </Grid>
            <Grid item>
              <TextField
                {...register('otp')}
                label='OTP'
                variant='outlined'
                fullWidth
                error={!!errors.otp}
                helperText={errors.otp ? errors.otp.message : ''}
              />
            </Grid>
            <Grid item>
              <PasswordField
                name='password'
                label='Password'
                onFocus={handleFocus}
                onBlur={handleClose}
                register={register}
                error={!!errors.password}
              />
            </Grid>
            <Grid item>
              <PasswordField
                name='confirmPassword'
                label='Confirm Password'
                onFocus={handleFocus}
                onBlur={handleClose}
                register={register}
                error={!!errors.confirmPassword}
              />
            </Grid>
          </Grid>
          <PasswordPopover
            open={open}
            anchorEl={anchorEl}
            errors={errors}
            dirtyFields={dirtyFields}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', padding: '20px 20px' }}>
          <Button variant='contained' type='submit' color='error'>
            Reset Password
          </Button>
        </CardActions>
      </StyledCard>
    </Container>
  );
};

export default ForgotPassword;
