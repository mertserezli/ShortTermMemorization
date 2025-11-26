import React, { useState } from 'react';
import { auth } from './Firebase';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Link as RouterLink } from 'react-router';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import HeaderBar from "./HeaderBar";

export default function ForgotPassword() {
  const [sendPasswordResetEmail, , error] = useSendPasswordResetEmail(auth);
  const [result, setResult] = useState(undefined);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    sendPasswordResetEmail(String(data.get('email'))).then((result) => setResult(result));
  };

  return (
    <>
      <HeaderBar showSignOut={false} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          {error && (
            <span>
              {error.message}
              <br />
            </span>
          )}
          {result === true && (
            <span>
              E-mail sent.
              <br />
            </span>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Reset Password
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/signin" variant="body2">
                  Sign-in
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to={'/signup'} variant="body2">
                  Don&#39;t have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
