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

import { useParams } from 'react-router-dom';
import authoriseLogin from '../../api/authorise-login';

const StyledCard = styled(Card)({
  borderTop: '2px solid red',
});

const Confirm: FC<{}> = () => {
  const { interactionId } = useParams();

  const onAuthorize = async (): Promise<void> => {
    await authoriseLogin(interactionId ?? '');
  };

  return (
    <Container maxWidth='sm'>
      <StyledCard sx={{ marginTop: 15 }}>
        <CardHeader title='Authorize' />
        <CardContent>
          <Grid container direction='column' spacing={1}>
            <Grid item>
              <Typography>Can you confirm you want to authorize?</Typography>
            </Grid>
            <Grid item>
              <Button variant='contained' onClick={onAuthorize}>
                Authorize
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default Confirm;
