import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import AuthContext from './context/AuthContext';
import { Logout, AdminPanelSettings, Home, PostAdd } from '@mui/icons-material';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            Feeds App
          </Typography>
        </Box>

        {/* Right side - Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Tooltip title="Home">
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to="/"
                  size="large"
                >
                  <Home />
                </IconButton>
              </Tooltip>

              <Tooltip title="Create Post">
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to="/create-post"
                  size="large"
                >
                  <PostAdd />
                </IconButton>
              </Tooltip>

              {user.role === 'admin' && (
                <Tooltip title="Admin Panel">
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to="/admin"
                    size="large"
                  >
                    <AdminPanelSettings />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}
                    alt={user.username}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user.username}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;