import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';

const TripsPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Trips
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          You don't have any trips yet. Start searching for flights to plan your next adventure!
        </Alert>
      </Box>
    </Container>
  );
};

export default TripsPage;