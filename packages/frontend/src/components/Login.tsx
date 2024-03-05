import React, { useState } from "react";
import {
  Container,
  Card,
  Grid,
  TextField,
  Button,
  CardHeader,
} from "@mui/material";
import Logo from "../assets/mtech.svg";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 10 }}>
      <Card>
        <Grid container spacing={2} p={4}>
          <Grid container item xs={12} justifyContent="center">
            <img src={Logo} alt="MTech Logo" width={130} height={100} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              variant="filled"
              type="password"
              fullWidth
            />
          </Grid>
          <Grid container item xs={12} justifyContent="flex-end">
            <Button variant="contained">Log In</Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Login;
