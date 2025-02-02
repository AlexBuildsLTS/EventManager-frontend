import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Dashboard,
  Event,
  People,
  Email,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const user = {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          EventSync
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <IconButton
            component={Link}
            to="/dashboard"
            color="inherit"
            sx={{
              borderRadius: 2,
              padding: '8px 16px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <Dashboard sx={{ mr: 1 }} />
            <Typography variant="body2">Dashboard</Typography>
          </IconButton>

          <IconButton
            component={Link}
            to="/events"
            color="inherit"
            sx={{
              borderRadius: 2,
              padding: '8px 16px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <Event sx={{ mr: 1 }} />
            <Typography variant="body2">Events</Typography>
          </IconButton>

          <IconButton
            component={Link}
            to="/users"
            color="inherit"
            sx={{
              borderRadius: 2,
              padding: '8px 16px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <People sx={{ mr: 1 }} />
            <Typography variant="body2">Users</Typography>
          </IconButton>

          <IconButton
            component={Link}
            to="/invitations"
            color="inherit"
            sx={{
              borderRadius: 2,
              padding: '8px 16px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <Email sx={{ mr: 1 }} />
            <Typography variant="body2">Invitations</Typography>
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <UserMenu user={user} onLogout={handleLogout} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};