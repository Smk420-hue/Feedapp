import { useContext } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AdminPanel from '../Admin/AdminPanel';
import AuthContext from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useContext(AuthContext);

  if (user?.role !== 'admin') {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Access Denied - Admin privileges required
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          Welcome, {user.username}. You have admin privileges.
        </Typography>
      </Paper>
      <AdminPanel />
    </Box>
  );
};

export default AdminPage;