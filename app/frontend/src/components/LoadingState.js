import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        animation: `${fadeIn} 0.5s ease-in`,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: 'primary.main',
          mb: 2,
        }}
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState; 