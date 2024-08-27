import { FC, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  FormControlLabel,
  Grid,
  Modal,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema';
import updateUser from '../../../../api/update-user';
import useFeedback from '../../../../hooks/useFeedback';
import getUser from '../../../../api/get-user';
import { MobileNumberInput } from '../../../../components/MobileNumberInput';

interface UserPopupProps {
  open: boolean;
  userIdentifier: string;
  onClose: () => void;
}

const defaultValues: IUserPopupInput = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  isAdmin: false,
  emailVerified: false,
};

const UserPopup: FC<UserPopupProps> = (props) => {
  const { userIdentifier, open, onClose } = props;
  const [user, setUser] = useState<IUserPopupInput>(defaultValues);
  const { feebackAxiosResponse, feedbackAxiosError } = useFeedback();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUserPopupInput>({
    resolver: yupResolver(schema),
    criteriaMode: 'all',
    mode: 'onChange',
    values: user,
  });

  const handleClose = (): void => {
    setUser(defaultValues);
    onClose();
  };

  const fetchUser = async (id: string): Promise<void> => {
    try {
      const response = await getUser(id);
      setUser({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        mobile: response.data.user.mobile,
        isAdmin: response.data.user.isAdmin,
        emailVerified: response.data.user.emailVerified,
      });
    } catch (err) {
      feedbackAxiosError(
        err,
        'There was an issue retrieving the user, please try again',
      );
      handleClose();
    }
  };

  useEffect(() => {
    if (open && userIdentifier) {
      fetchUser(userIdentifier);
    }
  }, [open, userIdentifier]);

  const onSubmit = async (data: IUserPopupInput): Promise<void> => {
    try {
      let response;

      response = await updateUser(userIdentifier, data);

      feebackAxiosResponse(response, 'Successfully updated user', 'success');
      reset();
      handleClose();
    } catch (err) {
      feedbackAxiosError(
        err,
        'There was an issue updating the user, please try again',
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          p: 2,
        }}
      >
        <Grid container spacing={1} sx={{ p: '10px 0' }} alignItems='center'>
          <Grid item>
            <AccountCircle color='primary' />
          </Grid>
          <Grid item>
            <Typography variant='h6' color='primary'>
              Update user
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction='column' spacing={2} sx={{ p: 2 }}>
            <Grid item>
              <TextField
                {...register('email')}
                InputLabelProps={{ shrink: true }}
                label='Email Address'
                variant='outlined'
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                disabled
              />
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  {...register('firstName')}
                  InputLabelProps={{ shrink: true }}
                  label='First Name'
                  variant='outlined'
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ''}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register('lastName')}
                  InputLabelProps={{ shrink: true }}
                  label='Last Name'
                  variant='outlined'
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName ? errors.lastName.message : ''}
                />
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item>
                <Controller
                  name='emailVerified'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label='Email verified?'
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  name='isAdmin'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={<Switch checked={value} onChange={onChange} />}
                      label='Is Admin?'
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Controller
                name='mobile'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MobileNumberInput
                    InputLabelProps={{ shrink: true }}
                    label='Mobile Number'
                    variant='outlined'
                    fullWidth
                    onChange={onChange}
                    value={value ?? ''}
                    error={!!errors.mobile}
                    helperText={errors.mobile ? errors.mobile.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item alignSelf='flex-end'>
              <Button variant='contained' color='success' type='submit'>
                Update User
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Modal>
  );
};

export default UserPopup;
