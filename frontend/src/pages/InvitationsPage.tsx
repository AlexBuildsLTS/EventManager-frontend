import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
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
  Alert,
  Snackbar,
  Autocomplete,
  Stack,
  Divider,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Mail,
  Event,
  Person,
  Sort,
  Send,
  Delete,
  Schedule,
  Group,
  CheckCircle,
  Cancel,
  AccessTime,
} from '@mui/icons-material';

interface Invitation {
  id: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  recipients: string[];
  status: 'sent' | 'draft' | 'scheduled';
  responses: {
    accepted: number;
    declined: number;
    pending: number;
  };
  sentAt?: string;
  scheduledFor?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
}

export const InvitationsPage = () => {
  const [invitations] = useState<Invitation[]>([
    {
      id: 1,
      eventId: 1,
      eventTitle: 'Annual Company Meeting',
      eventDate: '2024-03-20',
      eventTime: '09:00 AM',
      recipients: ['john.doe@company.com', 'jane.smith@company.com'],
      status: 'sent',
      responses: {
        accepted: 15,
        declined: 3,
        pending: 7,
      },
      sentAt: '2024-03-15 10:00 AM',
    },
    {
      id: 2,
      eventId: 2,
      eventTitle: 'Product Launch Event',
      eventDate: '2024-03-22',
      eventTime: '02:00 PM',
      recipients: ['mike.johnson@company.com', 'sarah.wilson@company.com'],
      status: 'scheduled',
      responses: {
        accepted: 0,
        declined: 0,
        pending: 25,
      },
      scheduledFor: '2024-03-21 09:00 AM',
    },
    {
      id: 3,
      eventId: 3,
      eventTitle: 'Team Building Workshop',
      eventDate: '2024-03-25',
      eventTime: '10:00 AM',
      recipients: ['david.brown@company.com', 'lisa.taylor@company.com'],
      status: 'draft',
      responses: {
        accepted: 0,
        declined: 0,
        pending: 30,
      },
    },
  ]);

  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Marketing' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Sales' },
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  const handleOpenDialog = (invitation?: Invitation) => {
    setSelectedInvitation(invitation || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInvitation(null);
  };

  const handleSendInvitation = () => {
    setSnackbarMessage('Invitations sent successfully!');
    setOpenSnackbar(true);
    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'scheduled':
        return 'warning';
      case 'draft':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send fontSize="small" />;
      case 'scheduled':
        return <Schedule fontSize="small" />;
      case 'draft':
        return <AccessTime fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Invitations
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
          Create Invitation
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search invitations..."
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
              <MenuItem>All Invitations</MenuItem>
              <MenuItem>Sent</MenuItem>
              <MenuItem>Scheduled</MenuItem>
              <MenuItem>Draft</MenuItem>
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
        {invitations.map((invitation) => (
          <Grid item xs={12} key={invitation.id}>
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
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {invitation.eventTitle}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Chip
                            icon={getStatusIcon(invitation.status)}
                            label={invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            size="small"
                            color={getStatusColor(invitation.status)}
                            sx={{ borderRadius: 1 }}
                          />
                          {invitation.status === 'scheduled' && (
                            <Chip
                              icon={<Schedule fontSize="small" />}
                              label={`Scheduled for ${invitation.scheduledFor}`}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />
                          )}
                          {invitation.status === 'sent' && (
                            <Chip
                              icon={<Send fontSize="small" />}
                              label={`Sent at ${invitation.sentAt}`}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />
                          )}
                        </Stack>
                        <Stack spacing={1}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <Event fontSize="small" />
                            {invitation.eventDate} at {invitation.eventTime}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <Group fontSize="small" />
                            {invitation.recipients.length} recipients
                          </Typography>
                        </Stack>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      borderRadius: 2,
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Response Summary
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle fontSize="small" color="success" />
                            Accepted
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            {invitation.responses.accepted}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Cancel fontSize="small" color="error" />
                            Declined
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            {invitation.responses.declined}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" color="action" />
                            Pending
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {invitation.responses.pending}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
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
          handleOpenDialog(invitations.find(i => i.id === selectedInvitation?.id));
        }}>
          <Send fontSize="small" sx={{ mr: 1 }} />
          Send Now
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Schedule fontSize="small" sx={{ mr: 1 }} />
          Schedule
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedInvitation ? 'Edit Invitation' : 'Create New Invitation'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Event</InputLabel>
              <Select
                label="Event"
                defaultValue=""
              >
                <MenuItem value="1">Annual Company Meeting</MenuItem>
                <MenuItem value="2">Product Launch Event</MenuItem>
                <MenuItem value="3">Team Building Workshop</MenuItem>
              </Select>
            </FormControl>

            <Divider>Recipients</Divider>

            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              defaultValue={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Recipients"
                  placeholder="Search users..."
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                    icon={<Person />}
                    sx={{ borderRadius: 1 }}
                  />
                ))
              }
            />

            <FormControl fullWidth>
              <InputLabel>Send Options</InputLabel>
              <Select
                label="Send Options"
                defaultValue="now"
              >
                <MenuItem value="now">Send Immediately</MenuItem>
                <MenuItem value="schedule">Schedule for Later</MenuItem>
                <MenuItem value="draft">Save as Draft</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Additional Message"
              multiline
              rows={4}
              placeholder="Add a personal message to the invitation..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSendInvitation}>
            {selectedInvitation ? 'Update Invitation' : 'Create Invitation'}
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