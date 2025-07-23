import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';

const ExplorePage = () => {
  const destinations = [
    { city: 'Paris', country: 'France', price: '$450' },
    { city: 'Tokyo', country: 'Japan', price: '$680' },
    { city: 'London', country: 'UK', price: '$520' },
    { city: 'Dubai', country: 'UAE', price: '$390' },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Explore Destinations
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Discover amazing places around the world
      </Typography>

      <Grid container spacing={3}>
        {destinations.map((dest, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{dest.city}</Typography>
                <Typography color="text.secondary">{dest.country}</Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  {dest.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExplorePage;