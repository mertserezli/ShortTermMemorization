import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

import { auth } from './Firebase';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

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

import HeaderBar from './HeaderBar';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [sendPasswordResetEmail, , error] = useSendPasswordResetEmail(auth);
  const [result, setResult] = useState(undefined);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    sendPasswordResetEmail(String(data.get('email'))).then((result) =>
      setResult(result)
    );
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
            {t('forgotPasswordPage')}
          </Typography>
          {error && (
            <span>
              {error.message}
              <br />
            </span>
          )}
          {result === true && (
            <span>
              {t('emailSent')}
              <br />
            </span>
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('resetPassword')}
            </Button>
            <Grid container>
              <Grid size="grow">
                <Link component={RouterLink} to="/signin" variant="body2">
                  {t('signInLink')}
                </Link>
              </Grid>
              <Grid>
                <Link component={RouterLink} to={'/signup'} variant="body2">
                  {t('dontHaveAccount')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
