import React, { useState } from 'react';
import { auth } from './Firebase';
import { signInAnonymously } from 'firebase/auth';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

import { Link as RouterLink, Navigate, useNavigate } from 'react-router';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from 'react-firebase-hooks/auth';
import { Divider, InputAdornment, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import HeaderBar from './HeaderBar';

export default function SignIn() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithGoogle, , , error] = useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, , , error2] =
    useSignInWithEmailAndPassword(auth);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (user) {
    return <Navigate replace to="/" />;
  }

  const handleEmailChange = (event) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = event.target.value;
    setEmail(emailValue);

    if (emailValue.trim() === '') {
      setEmailError('');
    } else if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const signInWithGoogleHandler = () => {
    signInWithGoogle().then((result) => {
      if (result.user) navigate('/');
    });
  };

  const signInAnonymouslyHandler = () => {
    signInAnonymously(auth)
      .then((result) => {
        if (result.user) navigate('/');
      })
      .catch((err) => {
        console.error('Anonymous sign-in error:', err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signInWithEmailAndPassword(
      String(data.get('email')),
      String(data.get('password'))
    ).then((result) => {
      if (result.user) navigate('/');
    });
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
            Sign in
          </Typography>
          <span>{error && error.message}</span>
          <br />
          <span>{error2 && error2.message}</span>
          <br />
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogleHandler}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            startIcon={<PersonIcon />}
            onClick={signInAnonymouslyHandler}
          >
            Continue as Guest
          </Button>

          <Divider sx={{ mt: 2, width: '100%' }} textAlign="center">
            or
          </Divider>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              onKeyDown={(e) => {
                setIsCapsLockOn(
                  e.getModifierState && e.getModifierState('CapsLock')
                );
              }}
              onBlur={() => {
                setIsCapsLockOn(false);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isCapsLockOn && (
                      <Tooltip title="Caps Lock is ON">
                        <WarningAmberIcon color="warning" />
                      </Tooltip>
                    )}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!!emailError || email.trim() === ''}
            >
              Sign In
            </Button>
            <Grid container justifyContent="space-between">
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/forgotpassword"
                  variant="body2"
                >
                  Forgot password?
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
