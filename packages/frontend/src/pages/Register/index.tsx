import React, { FC } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  styled,
} from '@mui/material';
import PasswordField from '../../components/PasswordField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { omit } from 'lodash';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import schema from './schema';
import PasswordPopover from './PasswordPopover';
import registerUser from '../../api/register-user';

const StyledCard = styled(Card)({
  borderTop: '2px solid red',
});

const Register: FC<{}> = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<IRegisterFormInput>({
    resolver: yupResolver(schema, {}),
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
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

  const onSubmit = async (data: IRegisterFormInput): Promise<void> => {
    try {
      const response = await registerUser(omit(data, 'confirmPassword'));
      enqueueSnackbar(
        response?.data?.message ?? 'Successfully registered user',
        { variant: 'success' },
      );
      reset();
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue registering the user, please try again',
        { variant: 'error' },
      );
    }
  };

  return (
    <Container maxWidth='sm'>
      <StyledCard sx={{ marginTop: 15 }}>
        <CardHeader title='Register' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction='column' spacing={2} sx={{ p: 2 }}>
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    {...register('firstName')}
                    label='First Name'
                    variant='outlined'
                    fullWidth
                    error={!!errors.firstName}
                    helperText={
                      errors.firstName ? errors.firstName.message : ''
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...register('lastName')}
                    label='Last Name'
                    variant='outlined'
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                  />
                </Grid>
              </Grid>
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
                  {...register('mobile')}
                  label='Mobile Number'
                  variant='outlined'
                  fullWidth
                  error={!!errors.mobile}
                  helperText={errors.mobile ? errors.mobile.message : ''}
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
              <Grid item alignSelf='flex-end'>
                <Button variant='contained' color='error' type='submit'>
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
          <PasswordPopover
            open={open}
            anchorEl={anchorEl}
            errors={errors}
            dirtyFields={dirtyFields}
          />
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default Register;
