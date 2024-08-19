import React, { FC } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import { AxiosError } from 'axios';

import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import authorizeInteraction from '../../api/authorize-interaction';

const StyledCard = styled(Card)({
  borderTop: '2px solid red',
});

const Confirm: FC<{}> = () => {
  const { interactionId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const onAuthorize = async (authorize: boolean): Promise<void> => {
    try {
      const response = await authorizeInteraction(
        interactionId ?? '',
        authorize,
      );
      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      }
    } catch (err) {
      enqueueSnackbar(
        err instanceof AxiosError && err?.response?.data?.error
          ? err.response.data.error
          : 'Failed to authorize request, please try again.',
        { variant: 'error' },
      );
    }
  };

  return (
    <Container maxWidth='sm'>
      <StyledCard sx={{ marginTop: 15 }}>
        <CardHeader title='Authorize' />
        <CardContent>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <Typography>
                Can you confirm you want to authorize this request?
              </Typography>
            </Grid>
            <Grid item container spacing={1}>
              <Grid item>
                <Button
                  variant='contained'
                  onClick={() => onAuthorize(true)}
                  color='success'
                >
                  Yes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='contained'
                  onClick={() => onAuthorize(false)}
                  color='error'
                >
                  No
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default Confirm;
