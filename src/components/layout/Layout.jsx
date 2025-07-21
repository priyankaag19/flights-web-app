import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../common/Header';
import ErrorBoundary from '../common/ErrorBoundary';

const Layout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Container>
    </Box>
  );
};

export default Layout;