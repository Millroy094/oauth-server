import { FC, useMemo } from 'react';
import {
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import {
  AddLinkRounded,
  Business,
  BusinessCenter,
  Delete,
} from '@mui/icons-material';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema';
import has from 'lodash/has';
import get from 'lodash/get';
import { useSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { snakeCase, uniqueId } from 'lodash';

import ControlledSelect from '../../../../components/ControlledSelect';
import createClient from '../../../../api/create-client';

interface ClientPopupProps {
  open: boolean;
  onClose: () => void;
}

const ClientPopup: FC<ClientPopupProps> = (props) => {
  const { open, onClose } = props;
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IClientPopupInput>({
    resolver: yupResolver(schema),
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      clientName: '',
      grants: [],
      scopes: [],
      redirectUris: [{ id: uniqueId(), value: '' }],
    },
  });

  const clientName = watch('clientName', '');
  const clientId = useMemo(() => snakeCase(clientName), [clientName]);

  const {
    fields: redirectUriFields,
    append: addRedirectUri,
    remove: removeRedirectUri,
  } = useFieldArray<any>({
    control,
    name: 'redirectUris',
  });

  const canDeleteRedirectUris = redirectUriFields.length > 1;

  const isLastRedirectUri = (index: number): boolean =>
    redirectUriFields.length - 1 === index;
  console.log(errors);
  const onSubmit = async (data: IClientPopupInput): Promise<void> => {
    try {
      const response = await createClient({
        ...data,
        clientId,
        redirectUris: data.redirectUris.map((redirectUri) => redirectUri.value),
      });
      enqueueSnackbar(
        response?.data?.message ?? 'Successfully created client',
        { variant: 'success' },
      );
      reset();
      onClose();
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'There was an issue creating the client, please try again',
        { variant: 'error' },
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
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
        <Grid container spacing={1} sx={{ p: '10px 0' }}>
          <Grid item>
            <Business color='primary' />
          </Grid>
          <Grid item>
            <Typography variant='h6' color='primary'>
              Create Client
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction='column' spacing={2} sx={{ p: 2 }}>
            <Grid item>
              <TextField
                label='Client Id'
                variant='outlined'
                fullWidth
                disabled
                value={clientId}
              />
            </Grid>
            <Grid item>
              <TextField
                {...register('clientName')}
                label='Client Name'
                variant='outlined'
                fullWidth
                error={!!errors.clientName}
                helperText={errors.clientName ? errors.clientName.message : ''}
              />
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <ControlledSelect
                  control={control}
                  name='grants'
                  label='Grants'
                  multiple
                  options={[
                    {
                      label: 'Authorization Code Flow',
                      value: 'authorization_code',
                    },
                  ]}
                  errors={errors}
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledSelect
                  control={control}
                  name='scopes'
                  label='Scopes'
                  multiple
                  options={[
                    { label: 'Open ID', value: 'openid' },
                    { label: 'Email', value: 'email' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Profile', value: 'profile' },
                  ]}
                  errors={errors}
                />
              </Grid>
              <Grid item container direction='column' spacing={2}>
                {redirectUriFields.map((field, index) => (
                  <Grid
                    container
                    item
                    key={field.id}
                    spacing={1}
                    alignItems='flex-start'
                  >
                    <Grid item xs={10}>
                      <TextField
                        {...register(`redirectUris.${index}.value`)}
                        label={`Redirect URI ${index + 1}`}
                        variant='outlined'
                        fullWidth
                        error={has(errors, `redirectUris.${index}.value`)}
                        helperText={get(
                          errors,
                          `redirectUris.${index}.value.message`,
                          '',
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Card
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          p: '10px 0',
                          gap: '6px',
                        }}
                      >
                        {isLastRedirectUri(index) && (
                          <IconButton
                            size='small'
                            aria-label='add'
                            color='success'
                            onClick={() =>
                              addRedirectUri({ id: uniqueId(), value: '' })
                            }
                          >
                            <AddLinkRounded />
                          </IconButton>
                        )}
                        {isLastRedirectUri(index) && canDeleteRedirectUris && (
                          <Divider orientation='vertical' flexItem />
                        )}
                        {canDeleteRedirectUris && (
                          <IconButton
                            size='small'
                            aria-label='remove'
                            color='error'
                            onClick={() => removeRedirectUri(index)}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Card>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item alignSelf='flex-end'>
              <Button variant='contained' color='success' type='submit'>
                Create Client
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Modal>
  );
};

export default ClientPopup;
