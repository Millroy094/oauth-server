import React, { FC } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Switch,
  Typography,
} from "@mui/material";

const MFA: FC<{}> = () => {
  const MFATypes = [
    { name: "App MFA" },
    { name: "SMS MFA" },
    { name: "Email MFA" },
  ];
  return (
    <Card elevation={0}>
      <CardHeader title="Mulit-Factor Authentication" />
      <CardContent>
        <Typography>
          You can make your login more secure by enabling 2FA for your account.
          Once enabled you will be required to through an additional step of
          verification whilst logging in.
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
      >
        <Grid container spacing={2}>
          {MFATypes.map((type) => (
            <Grid item key={type.name}>
              <Paper
                elevation={2}
                sx={{ p: "10px", width: "230px", height: "80px" }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography variant="body1">{type.name}</Typography>
                    </Grid>
                    <Grid item>
                      <Switch size="small" />
                    </Grid>
                  </Grid>
                  <Grid container item justifyContent="flex-end">
                    <Button variant="outlined" color="success">
                      Setup MFA
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default MFA;
