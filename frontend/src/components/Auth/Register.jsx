import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '80vh',
      alignItems: 'center'
    }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Register
        </Typography>
        
        {error && (
          <Typography color="error" textAlign="center" gutterBottom>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, mb: 2 }}
          >
            Register
          </Button>
        </form>
        
        <Typography textAlign="center">
          Already have an account?{' '}
          <Link href="/login" underline="hover">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;