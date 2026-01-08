import React, { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { auth } from './Firebase';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from 'react-firebase-hooks/auth';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { InputAdornment, Tooltip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

import HeaderBar from './HeaderBar';
import PasswordStrength from './PasswordStrength.jsx';

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [curUser, curUserLoading] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createUserWithEmailAndPassword, createdUser, creating, createError] =
    useCreateUserWithEmailAndPassword(auth);

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

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createUserWithEmailAndPassword(
      String(data.get('email')),
      String(data.get('password'))
    ).then(() => navigate('/app'));
  }

  if (curUserLoading) {
    return <Typography>{t('loading')}</Typography>;
  }
  if (curUser) {
    return <Navigate replace to="/app" />;
  }

  return (
    <>
      <HeaderBar showSignOut={false} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t('signUp')}
          </Typography>

          {createdUser && (
            <>
              <span>{t('alreadyLoggedIn')}</span>
              <br />
            </>
          )}
          {createError && (
            <>
              <span>{createError.message}</span>
              <br />
            </>
          )}
          {creating && (
            <>
              <span>{t('loading')}</span>
              <br />
            </>
          )}

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
              label={t('emailAddress')}
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
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={(e) => {
                setIsCapsLockOn(
                  e.getModifierState && e.getModifierState('CapsLock')
                );
              }}
              onBlur={() => setIsCapsLockOn(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isCapsLockOn && (
                      <Tooltip title={t('capsLockOn')}>
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
            <PasswordStrength password={password} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!!emailError || email.trim() === ''}
            >
              {t('signUpButton')}
            </Button>
            <Link component={RouterLink} to={'/signin'} variant="body2">
              {t('alreadyHaveAccount')}
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
}
