import React from 'react';
import { Link as RouterLink, NavLink } from 'react-router';

import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import Link from '@mui/material/Link';
import { useColorScheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { auth } from './Firebase';
import Logo from './icons/logo.png';
import { useTour } from '@reactour/tour';

export default function HeaderBar({ showSignOut = false }) {
  const { setIsOpen, setCurrentStep } = useTour();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link
          component={RouterLink}
          to="/app"
          underline="none"
          color="inherit"
          sx={{ fontWeight: 600 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <img src={Logo} alt="logo" style={{ width: 28, height: 28 }} />
            <Typography variant="h6" component="div">
              Short Term Memo
            </Typography>
          </Stack>
        </Link>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Help">
            <IconButton
              aria-label="help"
              onClick={() => {
                setIsOpen(true);
                setCurrentStep(0);
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          <ThemeToggle />
          {showSignOut && (
            <Tooltip title="Profile">
              <IconButton
                component={NavLink}
                to="/profile"
                color="primary"
                aria-label="profile"
                style={({ isActive }) => ({
                  color: isActive ? '#1976d2' : 'inherit',
                })}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          {showSignOut && <SignOut />}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  if (!mode) return null;

  return (
    <IconButton
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      color="inherit"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

function SignOut() {
  function handleSignOut() {
    auth.signOut();
  }

  return (
    <Tooltip title="Sign Out" enterDelay={0} leaveDelay={0}>
      <IconButton color="primary" onClick={handleSignOut} aria-label="sign out">
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}
