import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HeaderBar from './HeaderBar.jsx';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <HeaderBar />
      <Box
        sx={{
          textAlign: 'center',
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />

        <Typography variant="h3" gutterBottom>
          {t('notFoundTitle')}
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          {t('notFoundMessage')}
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {t('goHome')}
        </Button>
      </Box>
    </>
  );
}
