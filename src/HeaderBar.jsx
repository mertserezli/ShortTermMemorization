import React from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router';

import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
} from '@mui/material';
import Link from '@mui/material/Link';
import { useColorScheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LanguageIcon from '@mui/icons-material/Language';

import { auth } from './Firebase';
import Logo from './icons/logo.png';
import { useTour } from '@reactour/tour';
import { useLanguage } from './MUIWrapper.jsx';
import { useTranslation } from 'react-i18next';

export default function HeaderBar({ showSignOut = false }) {
  const { t } = useTranslation();
  const location = useLocation();
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
          {location.pathname === '/app' && (
            <Tooltip title={t('help')}>
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
          )}
          <LanguagePicker />
          <ThemeToggle />
          {showSignOut && (
            <Tooltip title={t('profile')}>
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

function LanguagePicker() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
      size="small"
      variant="outlined"
      sx={{ ml: 1, minWidth: 60 }}
      renderValue={(value) => {
        switch (value) {
          case 'en':
            return '🇬🇧';
          case 'tr':
            return '🇹🇷';
          default:
            return <LanguageIcon />;
        }
      }}
    >
      <MenuItem value="en">🇬🇧 English</MenuItem>
      <MenuItem value="tr">🇹🇷 Türkçe</MenuItem>
    </Select>
  );
}

function ThemeToggle() {
  const { t } = useTranslation();
  const { mode, setMode } = useColorScheme();

  if (!mode) return null;

  return (
    <Tooltip title={t('theme')} enterDelay={0} leaveDelay={0}>
      <IconButton
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        color="inherit"
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}

function SignOut() {
  const { t } = useTranslation();
  function handleSignOut() {
    auth.signOut();
  }

  return (
    <Tooltip title={t('signOut')} enterDelay={0} leaveDelay={0}>
      <IconButton color="primary" onClick={handleSignOut} aria-label="sign out">
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}
