import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';
import { LinearProgress, Tooltip } from '@mui/material';

const passwordStrengthColorMap = {
  veryWeak: '#d32f2f', // red
  weak: '#f57c00', // orange
  moderate: '#fbc02d', // yellow
  strong: '#388e3c', // green
  veryStrong: '#2e7d32', // dark green
};

const passwordStrengthHintKeyMap = {
  veryWeak: 'veryWeakHint',
  weak: 'weakHint',
  moderate: 'moderateHint',
  strong: 'strongHint',
  veryStrong: 'veryStrongHint',
};

function evaluatePasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  switch (score) {
    case 0:
    case 1:
      return 'veryWeak';
    case 2:
      return 'weak';
    case 3:
      return 'moderate';
    case 4:
      return 'strong';
    case 5:
      return 'veryStrong';
    default:
      return '';
  }
}

function getPasswordStrengthProgressValue(strength) {
  switch (strength) {
    case 'veryWeak':
      return 20;
    case 'weak':
      return 40;
    case 'moderate':
      return 60;
    case 'strong':
      return 80;
    case 'veryStrong':
      return 100;
    default:
      return 0;
  }
}

export default function PasswordStrength({ password }) {
  const { t } = useTranslation();

  const passwordStrength = evaluatePasswordStrength(password);

  return (
    <>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {t('passwordStrength')}: {t(passwordStrength)}
      </Typography>
      <Tooltip title={t(passwordStrengthHintKeyMap[passwordStrength]) || ''}>
        <LinearProgress
          variant="determinate"
          value={getPasswordStrengthProgressValue(passwordStrength)}
          sx={{
            mt: 1,
            height: 8,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor:
                passwordStrengthColorMap[passwordStrength] || '#90caf9',
            },
          }}
        />
      </Tooltip>
    </>
  );
}
