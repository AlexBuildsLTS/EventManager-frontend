import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Edit,
  Lock,
  Email,
  Phone,
  Badge,
  PhotoCamera,
  Save,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = () => {
    setSnackbarMessage('Profile updated successfully!');
    setOpenSnackbar(true);
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    setOpenPasswordDialog(false);
    setSnackbarMessage('Password updated successfully!');
    setOpenSnackbar(true);
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker and handle image upload
    setSnackbarMessage('Profile picture updated successfully!');
    setOpenSnackbar(true);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Profile Settings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={profileData.avatar}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    mx: 'auto',
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }}
                  onClick={handleAvatarChange}
                >
                  <PhotoCamera sx={{ color: 'white' }} />
                </IconButton>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {profileData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setEditMode(!editMode)}
                startIcon={editMode ? <Save /> : <Edit />}
                sx={{ borderRadius: 2 }}
              >
                {editMode ? 'Save Profile' : 'Edit Profile'}
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setOpenPasswordDialog(true)}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                Change Password
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                sx={{ borderRadius: 2 }}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Personal Information" />
                <Tab label="Security" />
                <Tab label="Preferences" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={profileData.department}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      sx={{ borderRadius: 2 }}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Last changed 3 months ago
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => setOpenPasswordDialog(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Change Password
                </Button>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add an extra layer of security to your account
              </Typography>
              <Button
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Enable 2FA
              </Button>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              {/* Add notification preferences here */}
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};