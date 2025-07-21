import React from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Switch, Divider } from '@mui/material';

const SettingsPage = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <List>
          <ListItem>
            <ListItemText primary="Email Notifications" secondary="Receive flight updates via email" />
            <Switch defaultChecked />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Push Notifications" secondary="Get notifications on your device" />
            <Switch />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Dark Mode" secondary="Use dark theme" />
            <Switch />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
