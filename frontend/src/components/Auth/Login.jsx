import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Link 
} from '@mui/material';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && (
          <Typography color="error" gutterBottom>{error}</Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          Don't have an account? <Link href="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;