import { FC } from 'react';
import get from 'lodash/get';
import { Grid, Popover, Typography, styled } from '@mui/material';
import { Close, Check } from '@mui/icons-material';
import { FieldErrors } from 'react-hook-form';

const StyledPopover = styled(Popover)({
  marginLeft: '10px',
});

interface PasswordPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  errors: FieldErrors<IRegisterFormInput>;
  dirtyFields: Record<string, boolean>;
}

const passwordFieldValidationMessages = {
  password: [
    'Password is required',
    'Must Contain 8 Characters',
    'Must Contain One Lowercase Character',
    'Must Contain One Uppercase Character',
    'Must Contain One Number Character',
    'Must Contain  One Special Case Character',
  ],
  confirmPassword: [
    'Password confirmation is required',
    'Passwords must match',
  ],
};

const PasswordPopover: FC<PasswordPopoverProps> = (props) => {
  const { open, anchorEl, handleClose, errors, dirtyFields } = props;
  const fieldName = anchorEl?.firstElementChild?.getAttribute('name') ?? '';

  const fieldValidationMessages = get(
    passwordFieldValidationMessages,
    fieldName,
    [],
  );

  if (fieldValidationMessages.length === 0) {
    return null;
  }
  const fieldErrorsByType = get(errors, `${fieldName}.types`, {});
  const fieldErrors = Object.keys(fieldErrorsByType).reduce(
    (errors: string[], errorTypeKey: string): string[] => {
      const foundErrors = get(fieldErrorsByType, errorTypeKey);
      return foundErrors ? errors.concat(foundErrors) : errors;
    },
    [],
  );

  return (
    <StyledPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorPosition={{ left: 500, top: 0 }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
    >
      <Grid container direction='column' sx={{ p: '10px' }}>
        {fieldValidationMessages.map((fieldValidationMessage) => (
          <Grid key={fieldValidationMessage} container item alignItems='center'>
            {fieldErrors.includes(fieldValidationMessage) ||
            !dirtyFields[fieldName] ? (
              <Close color='error' />
            ) : (
              <Check color='success' />
            )}
            <Typography sx={{ p: '5px' }}>{fieldValidationMessage}</Typography>
          </Grid>
        ))}
      </Grid>
    </StyledPopover>
  );
};

export default PasswordPopover;
