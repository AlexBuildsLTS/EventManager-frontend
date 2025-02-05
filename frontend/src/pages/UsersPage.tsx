import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Fade,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Mail,
  Phone,
  Badge,
  AdminPanelSettings,
  Person,
  Sort,
} from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'member';
  department: string;
  status: 'active' | 'inactive';
  avatar: string;
}

export const UsersPage = () => {
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      department: 'Engineering',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678',
      role: 'member',
      department: 'Marketing',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 345-6789',
      role: 'member',
      department: 'Sales',
      status: 'inactive',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    setSnackbarMessage(selectedUser ? 'User updated successfully!' : 'User created successfully!');
    setOpenSnackbar(true);
    handleCloseDialog();
  };

  const handleDeleteUser = () => {
    setSnackbarMessage('User deleted successfully!');
    setOpenSnackbar(true);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: '100%',
              }}
            >
              Filter
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
              TransitionComponent={Fade}
            >
              <MenuItem>All Users</MenuItem>
              <MenuItem>Admins</MenuItem>
              <MenuItem>Active Users</MenuItem>
              <MenuItem>Inactive Users</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Sort />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                height: '100%',
              }}
            >
              Sort
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card
              sx={{
                borderRadius: 2,
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[4],
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {user.name}
                      </Typography>
                      <Chip
                        icon={user.role === 'admin' ? <AdminPanelSettings fontSize="small" /> : <Person fontSize="small" />}
                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        size="small"
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Mail fontSize="small" />
                    {user.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Phone fontSize="small" />
                    {user.phone}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Badge fontSize="small" />
                    {user.department}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={user.status}
                    size="small"
                    color={user.status === 'active' ? 'success' : 'default'}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null);
          handleOpenDialog(users.find(u => u.id === selectedUser?.id));
        }}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              defaultValue={selectedUser?.name}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              defaultValue={selectedUser?.email}
            />
            <TextField
              fullWidth
              label="Phone"
              defaultValue={selectedUser?.phone}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                defaultValue={selectedUser?.role || 'member'}
              >
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Department"
              defaultValue={selectedUser?.department}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                defaultValue={selectedUser?.status || 'active'}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {selectedUser ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

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