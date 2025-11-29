import React, { useState } from 'react';
import { auth } from './Firebase';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  linkWithCredential,
  GoogleAuthProvider,
  linkWithPopup,
} from 'firebase/auth';
import { Navigate } from 'react-router';
import {useAuthState} from "react-firebase-hooks/auth";

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import HeaderBar from './HeaderBar';
import {
  evaluatePasswordStrength,
  getPasswordStrengthProgressValue,
  passwordStrengthColorMap,
  passwordStrengthHintMap,
} from './passwordStrength';

export default function Profile() {
  const [user, loading, ] = useAuthState(auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [upgradePassword, setUpgradePassword] = useState('');

  const [passwordStrength, setPasswordStrength] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!user) {
    return <Navigate replace to="/signin" />;
  }

  const isEmailPassword = user.providerData.some((profile) => profile.providerId === 'password');
  const isAnonymous = user.isAnonymous;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        setStatus('No user is signed in.');
        return;
      }

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);
      setStatus('Password updated successfully!');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleUpgradeAccount = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(upgradeEmail, upgradePassword);
      await linkWithCredential(currentUser, credential);
      setStatus('Account upgraded successfully! You now have a permanent account.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleUpgradeWithGoogle = async () => {
    try {
      const currentUser = auth.currentUser;
      const provider = new GoogleAuthProvider();

      await linkWithPopup(currentUser, provider);

      setStatus('Account upgraded successfully with Google!');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <>
      <HeaderBar showSignOut={true} />
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Profile Settings
          </Typography>

          {isEmailPassword && (
            <Box component="form" onSubmit={handlePasswordChange} sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Change Password
              </Typography>
              <TextField
                fullWidth
                required
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                }}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                required
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  const pwd = e.target.value;
                  setNewPassword(e.target.value);
                  setPasswordStrength(evaluatePasswordStrength(pwd));
                }}
                onKeyDown={(e) =>
                  setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'))
                }
                onBlur={() => setIsCapsLockOn(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isCapsLockOn && (
                        <Tooltip title="Caps Lock is ON">
                          <WarningAmberIcon color="warning" />
                        </Tooltip>
                      )}
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Password Strength: {passwordStrength}
              </Typography>
              <Tooltip title={passwordStrengthHintMap[passwordStrength] || ''}>
                <LinearProgress
                  variant="determinate"
                  value={getPasswordStrengthProgressValue(passwordStrength)}
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: passwordStrengthColorMap[passwordStrength] || '#90caf9',
                    },
                  }}
                />
              </Tooltip>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={!currentPassword || !newPassword}
              >
                Update Password
              </Button>
            </Box>
          )}

          {isAnonymous && (
            <Box component="form" onSubmit={handleUpgradeAccount} sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Upgrade your guest account to a permanent account:
              </Typography>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                value={upgradeEmail}
                onChange={(e) => setUpgradeEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={upgradePassword}
                onChange={(e) => {
                  const pwd = e.target.value;
                  setUpgradePassword(pwd);
                  setPasswordStrength(evaluatePasswordStrength(pwd));
                }}
                onKeyDown={(e) =>
                  setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'))
                }
                onBlur={() => setIsCapsLockOn(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isCapsLockOn && (
                        <Tooltip title="Caps Lock is ON">
                          <WarningAmberIcon color="warning" />
                        </Tooltip>
                      )}
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Password Strength: {passwordStrength}
              </Typography>
              <Tooltip title={passwordStrengthHintMap[passwordStrength] || ''}>
                <LinearProgress
                  variant="determinate"
                  value={getPasswordStrengthProgressValue(passwordStrength)}
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: passwordStrengthColorMap[passwordStrength] || '#90caf9',
                    },
                  }}
                />
              </Tooltip>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={!upgradeEmail || !upgradePassword}
              >
                Upgrade Account
              </Button>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={handleUpgradeWithGoogle}>
                Upgrade with Google
              </Button>
            </Box>
          )}

          {status && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {status}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
