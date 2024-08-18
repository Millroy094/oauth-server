import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import schema from './schema';
import getUserProfileDetails from '../../api/get-user-profile-details';
import updateUserProfileDetails from '../../api/update-user-profile-details';

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  emailVerified: false,
  mobile: '',
};

const Profile: FC<{}> = () => {
  const [form, setForm] = useState(defaultValues);
  const [disabled, setDisabled] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const response = await getUserProfileDetails();
      const user = response?.data?.user;
      setForm({
        firstName: user?.firstName ?? defaultValues.firstName,
        lastName: user?.lastName ?? defaultValues.lastName,
        email: user?.email ?? defaultValues.email,
        emailVerified: user?.emailVerified ?? defaultValues.emailVerified,
        mobile: user?.mobile ?? defaultValues.mobile,
      });
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'Failed to retreive user data, please reload the page.',
        { variant: 'error' },
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfileFormInput>({
    resolver: yupResolver(schema, {}),
    disabled,
    defaultValues,
    values: form,
  });

  const onSubmit = async (data: IProfileFormInput): Promise<void> => {
    try {
      const response = await updateUserProfileDetails(data);
      setDisabled(true);
      enqueueSnackbar(
        response?.data?.message ?? 'Successfully updated user details',
        { variant: 'success' },
      );
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue updating the user details, please try again',
        { variant: 'error' },
      );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Typography variant='h6'>Account Profile</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction='column' spacing={2}>
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
          <Grid item>
            <TextField
              {...register('email')}
              InputLabelProps={{ shrink: true }}
              label='Email Address'
              variant='outlined'
              fullWidth
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
          </Grid>
          <Grid item>
            <Controller
              name='emailVerified'
              control={control}
              render={({ field: { onChange, value, disabled } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      disabled={disabled}
                    />
                  }
                  label='Email verified?'
                />
              )}
            />
          </Grid>
          <Grid item>
            <TextField
              {...register('mobile')}
              InputLabelProps={{ shrink: true }}
              label='Mobile Number'
              variant='outlined'
              fullWidth
              error={!!errors.mobile}
              helperText={errors.mobile ? errors.mobile.message : ''}
            />
          </Grid>

          <Grid item alignSelf='flex-end'>
            {disabled ? (
              <Button
                variant='contained'
                onClick={(e) => {
                  e.preventDefault();
                  setDisabled(false);
                }}
                startIcon={<Edit />}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant='contained'
                color='success'
                type='submit'
                startIcon={<Save />}
              >
                Update Profile
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Profile;
