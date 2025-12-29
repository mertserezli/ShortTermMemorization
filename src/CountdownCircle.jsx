import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function CountdownCircle({ targetTime }) {
  const [now, setNow] = useState(Date.now());
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalDuration = targetTime - startTime;
  const remaining = Math.max(0, Math.ceil((targetTime - now) / 1000));

  const elapsed = Math.min(totalDuration, now - startTime);
  const progress = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 100;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100 - progress}
        size={80}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {Math.floor(remaining / 60)}:
          {(remaining % 60).toString().padStart(2, '0')}
        </Typography>
      </Box>
    </Box>
  );
}
