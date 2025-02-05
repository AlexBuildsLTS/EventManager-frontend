import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import { Navbar } from './components/common/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { UsersPage } from './pages/UsersPage';
import { InvitationsPage } from './pages/InvitationsPage';
import { SignInPage } from './pages/SignInPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';

function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const { isAuthenticated, isLoading } = useAuth();

  const theme = React.useMemo(() => mode === 'light' ? lightTheme : darkTheme, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => prevMode === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SignInPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar toggleTheme={toggleTheme} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/invitations" element={<InvitationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;