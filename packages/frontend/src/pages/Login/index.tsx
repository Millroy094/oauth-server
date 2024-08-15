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
import schema from './schema';
import { useParams } from 'react-router-dom';
import authenticateInteraction from '../../api/authenicate-interaction';

const StyledCard = styled(Card)({
  borderTop: '2px solid red',
});

const Login: FC<{}> = () => {
  const { interactionId } = useParams();
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
      const response = await authenticateInteraction({
        ...data,
        interactionId: interactionId ?? '',
      });

      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth='sm'>
      <StyledCard sx={{ marginTop: 15 }}>
        <CardHeader title='Log In' />
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
