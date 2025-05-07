import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import PostList from '../Feed/PostList';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {user ? 'Your Feed' : 'Welcome to Feeds App'}
      </Typography>
      <Typography variant="body1" paragraph>
        {!user && 'Please login or register to view and create posts.'}
      </Typography>
      {user && <PostList />}
    </Box>
  );
};

export default HomePage;