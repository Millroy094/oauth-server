import React, { FC, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import schema from './schema';

const Profile: FC<{}> = () => {
  const [disabled, setDisabled] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfileFormInput>({
    resolver: yupResolver(schema, {}),
    disabled,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      emailVerified: false,
      mobile: '',
    },
  });

  const onSubmit = async (data: IProfileFormInput): Promise<void> => {
    try {
      console.log(data);
      setDisabled(true);
    } catch (err) {}
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
            <FormControlLabel
              control={
                <Switch {...register('emailVerified')} color='success' />
              }
              label='Email verified?'
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

          <Grid item alignSelf='flex-end'>
            {disabled ? (
              <Button
                variant='contained'
                onClick={() => {
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
