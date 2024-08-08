import React, { FC } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  styled,
} from '@mui/material';

const StyledCard = styled(Card)({
  borderTop: '2px solid red',
});

const Login: FC<{}> = () => {
  return (
    <Container maxWidth='sm'>
      <StyledCard sx={{ marginTop: 15 }}>
        <CardHeader title='Log In' />
        <CardContent>
          <Grid container direction='column' spacing={2} sx={{ p: 1 }}>
            <Grid item>
              <TextField fullWidth />
            </Grid>
            <Grid item>
              <TextField fullWidth />
            </Grid>
            <Grid item alignSelf='flex-end'>
              <Button variant='contained' color='error'>
                Sign In
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default Login;
