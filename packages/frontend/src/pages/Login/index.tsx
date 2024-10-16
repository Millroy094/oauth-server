import { FC, ReactElement, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  styled
} from '@mui/material';
import PasswordField from '../../components/PasswordField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import schema from './schema';
import { useNavigate, useParams } from 'react-router-dom';
import authenticateInteraction from '../../api/oidc/authenticate-interaction';
import useFeedback from '../../hooks/useFeedback';
import { useAuth } from '../../context/AuthProvider';
import getLoginConfiguration from '../../api/user/get-login-configuration';
import VerifyMFAOtpInput from './VerifyOtpInput';
import { EMAIL_VERIFICATION } from '../../constants';
import RecoveryCodeInput from './RecoveryCodeInput';
import { ILoginFormInput } from './types';

const StyledCard = styled(Card)({
  borderTop: '2px solid red'
});

type ILoginStage = 'USERNAME' | 'PASSWORD' | 'MFA' | 'RECOVERY_CODE';

const Login: FC = () => {
  const [loginStage, setLoginStage] = useState<ILoginStage>('USERNAME');
  const { interactionId } = useParams();
  const navigate = useNavigate();
  const { feedbackAxiosError } = useFeedback();
  const Auth = useAuth();

  const {
    control,
    reset,
    setValue,
    getValues,
    trigger,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      mfaType: '',
      otp: '',
      loginWithRecoveryCode: false,
      recoveryCode: '',
      resetMfa: false
    }
  });

  const email = getValues('email');
  const mfaType = getValues('mfaType');

  const onReset = () => {
    setLoginStage('USERNAME');
    reset();
  };

  const onNextStep = async () => {
    if (loginStage === 'USERNAME') {
      const isEmailValid = await trigger('email');

      if (isEmailValid) {
        try {
          const email = getValues('email');
          const response = await getLoginConfiguration(email);
          if (!response.data.emailVerified) {
            setValue('mfaType', EMAIL_VERIFICATION);
          } else if (response.data.mfa.enabled) {
            setValue('mfaType', response.data.mfa.type);
          }
        } catch (err) {
          feedbackAxiosError(err, 'Failed to retrieve login configuration');
        }
        setLoginStage('PASSWORD');
      }
    } else if (loginStage === 'PASSWORD') {
      const isPasswordValid = await trigger('password');
      if (isPasswordValid && !mfaType) {
        handleSubmit(onSubmit)();
      } else if (isPasswordValid && mfaType) {
        setLoginStage('MFA');
      }
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data: ILoginFormInput): Promise<void> => {
    try {
      if (interactionId) {
        const response = await authenticateInteraction({
          ...data,
          interactionId: interactionId
        });

        if (response.data.redirect) {
          window.location.href = response.data.redirect;
        }
      } else {
        await Auth?.login(data);
      }
    } catch (err) {
      feedbackAxiosError(
        err,
        'Failed to authenticate credentials, please try again.'
      );
    }
    setLoginStage('USERNAME');
    reset();
  };

  const navigateToForgotPassword = () => {
    navigate(
      `/forgot-password${
        interactionId ? `?interactionId=${interactionId}` : ''
      }`
    );
  };

  const loginViaRecoveryCode = () => {
    setValue('loginWithRecoveryCode', true);
    setLoginStage('RECOVERY_CODE');
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
          sx={{ cursor: 'pointer' }}
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
      justifyContent: 'center'
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
          <Grid container direction='column' spacing={2} sx={{ p: 2 }}>
            {!['MFA', 'RECOVERY_CODE'].includes(loginStage) && (
              <>
                <Grid item>
                  {loginStage === 'USERNAME' ? (
                    <TextField
                      {...register('email')}
                      label='Email Address'
                      variant='outlined'
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                    />
                  ) : (
                    <Typography variant='body2'>{email}</Typography>
                  )}
                </Grid>
                {loginStage !== 'USERNAME' && (
                  <Grid container item direction='column'>
                    <Grid item>
                      <PasswordField
                        name='password'
                        label='Password'
                        register={register}
                        error={!!errors.password}
                        helperText={
                          errors.password ? errors.password.message : ''
                        }
                      />
                    </Grid>
                    <Grid item alignSelf='flex-end'>
                      <Button color='error' onClick={navigateToForgotPassword}>
                        <Typography variant='caption'>
                          Forgot Password?
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </>
            )}

            {loginStage === 'MFA' && (
              <VerifyMFAOtpInput
                email={email}
                control={control}
                type={mfaType ?? ''}
              />
            )}
            {loginStage === 'RECOVERY_CODE' && (
              <RecoveryCodeInput
                register={register}
                control={control}
                errors={errors}
              />
            )}
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            padding: '20px 20px',
            justifyContent:
              loginStage === 'USERNAME' ? 'flex-end' : 'space-between'
          }}
        >
          {!['USERNAME', 'MFA'].includes(loginStage) && (
            <Button color='error' onClick={onReset}>
              Sign in with a different user
            </Button>
          )}

          {loginStage === 'MFA' && (
            <Button color='error' onClick={loginViaRecoveryCode}>
              Don't have OTP?
            </Button>
          )}

          <Button
            variant='contained'
            color='error'
            sx={{ display: 'flex', justifySelf: 'flex-start' }}
            onClick={onNextStep}
          >
            {(!mfaType || loginStage === 'MFA') && loginStage !== 'USERNAME'
              ? 'Sign in'
              : 'Next'}
          </Button>
        </CardActions>
      </StyledCard>
    </Container>
  );
};

export default Login;
