import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Box, Typography } from '@mui/material';

CountdownCircle.propTypes = {
  duration: PropTypes.number.isRequired,
};
export default function CountdownCircle({ duration }) {
  const [remaining, setRemaining] = useState(duration);
  duration = Math.ceil(duration);

  useEffect(() => {
    setRemaining(Math.ceil(duration));
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [duration]);

  const progress = ((duration - remaining) / duration) * 100;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={progress} size={80} />
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
