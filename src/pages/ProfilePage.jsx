import React from 'react';
import { Container, Typography, Paper, Box, Avatar, Divider } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>U</Avatar>
          <Box>
            <Typography variant="h5">Maya</Typography>
            <Typography color="text.secondary">maya@sharma.com</Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1">
          Manage your account settings and preferences here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProfilePage;