import { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("📡 Fetching all users...");
      try {
        const res = await api.get('/admin/users');
        console.log("✅ Users fetched:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error fetching users:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    console.log(`🔄 Changing role for user ID: ${userId} → ${newRole}`);
    try {
      const res = await api.put(`/admin/update-user-role/${userId}`, { role: newRole });
      console.log("✅ Role updated:", res.data);
      setUsers((prev) => 
        prev.map(user => user.id === userId ? { ...user, role: newRole } : user)
      );
    } catch (err) {
      console.error("❌ Error updating user role:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Debug: Loading user list...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>

      {users.length === 0 ? (
        <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
          <Typography>No users found.</Typography>
          <Typography variant="caption" color="textSecondary">
            Debug: users array empty
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => console.log(`🚨 Delete user clicked: ${user.username}`)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserManagement;
