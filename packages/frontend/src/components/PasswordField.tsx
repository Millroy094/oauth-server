import React, { FC, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { UseFormRegister } from 'react-hook-form';

interface PasswordFieldProps {
  register: UseFormRegister<any>;
  name: string;
  error: boolean;
  helperText?: string;
}

const PasswordField: FC<PasswordFieldProps> = (props) => {
  const { name, register, error, helperText } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  return (
    <TextField
      {...register(name)}
      error={error}
      helperText={helperText}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end' sx={{ p: 1 }}>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  );
};

export default PasswordField;
