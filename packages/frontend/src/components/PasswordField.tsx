import React, { FC, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { UseFormRegister } from "react-hook-form";

interface PasswordFieldProps {
  register: UseFormRegister<any>;
  name: string;
  label?: string;
  required?: boolean;
  error: boolean;
  helperText?: string;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
}

const PasswordField: FC<PasswordFieldProps> = (props) => {
  const {
    name,
    label,
    register,
    error,
    helperText,
    required,
    onFocus,
    onBlur,
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <TextField
      {...register(name)}
      label={label ?? name}
      required={required ?? false}
      error={error}
      helperText={helperText}
      type={showPassword ? "text" : "password"}
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" sx={{ p: 1 }}>
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      fullWidth
    />
  );
};

export default PasswordField;
