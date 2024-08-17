import React, { FC, ReactElement } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import PasswordField from '../../components/PasswordField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import schema from './schema';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import authenticateInteraction from '../../api/authenicate-interaction';
import authenicateUser from '../../api/authenicate-user';

const StyledCard = styled(Card)({
  borderTop: '2px solid red',
});

const Login: FC<{}> = () => {
  const { interactionId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInput>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: ILoginFormInput): Promise<void> => {
    try {
      if (interactionId) {
        const response = await authenticateInteraction({
          ...data,
          interactionId: interactionId,
        });

        if (response.data.redirect) {
          window.location.href = response.data.redirect;
        }
      } else {
        await authenicateUser({
          ...data,
        });

        navigate('/account');
      }
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'Failed to authenticate credentials, please try again.',
        { variant: 'error' },
      );
    }
  };

  const extraProps: {
    subheader?: ReactElement;
    subheaderTypographyProps?: Record<string, string | number>;
  } = {};

  if (!interactionId) {
    extraProps.subheader = (
      <>
        <Typography variant='caption'>Not registered?</Typography>
        <Link
          variant='caption'
          underline='none'
          onClick={() => navigate('/registration')}
        >
          Click here
        </Link>
        <Typography variant='caption'>to register</Typography>
      </>
    );

    extraProps.subheaderTypographyProps = {
      display: 'flex',
      gap: '4px',
      justifyContent: 'center',
    };
  }

  return (
    <Container maxWidth='sm'>
      <StyledCard sx={{ marginTop: 15 }}>
        <CardHeader
          title='Log In'
          titleTypographyProps={{ align: 'center' }}
          {...extraProps}
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <PasswordField
                  name='password'
                  label='Password'
                  register={register}
                  required
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ''}
                />
              </Grid>
              <Grid item alignSelf='flex-end'>
                <Button variant='contained' color='error' type='submit'>
                  Sign In
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default Login;
