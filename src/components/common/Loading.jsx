import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Flight } from '@mui/icons-material';

const Loading = ({ message = 'Searching for flights...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Box sx={{ position: 'relative', mb: 3 }}>
        <CircularProgress size={60} thickness={4} />
        <Flight
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'primary.main',
          }}
        />
      </Box>
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Finding the best deals for you
      </Typography>
    </Box>
  );
};

export default Loading;