import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Fade,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Event,
  LocationOn,
  People,
  Sort,
} from '@mui/icons-material';

export const EventsPage = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  const events = [
    {
      id: 1,
      title: 'Annual Company Meeting',
      date: '2024-03-20',
      time: '09:00 AM',
      location: 'Main Conference Room',
      attendees: 45,
      status: 'Upcoming',
    },
    {
      id: 2,
      title: 'Product Launch Event',
      date: '2024-03-22',
      time: '02:00 PM',
      location: 'Innovation Center',
      attendees: 120,
      status: 'Planning',
    },
    {
      id: 3,
      title: 'Team Building Workshop',
      date: '2024-03-25',
      time: '10:00 AM',
      location: 'Recreation Center',
      attendees: 30,
      status: 'Draft',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'success';
      case 'planning':
        return 'warning';
      case 'draft':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Events
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Create Event
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
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
              <MenuItem>All Events</MenuItem>
              <MenuItem>Upcoming Events</MenuItem>
              <MenuItem>Past Events</MenuItem>
              <MenuItem>Draft Events</MenuItem>
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
        {events.map((event) => (
          <Grid item xs={12} key={event.id}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {event.title}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Event fontSize="small" />
                          {event.date} at {event.time}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <LocationOn fontSize="small" />
                          {event.location}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <People fontSize="small" />
                          {event.attendees} attendees
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={event.status}
                      color={getStatusColor(event.status)}
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
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
        <MenuItem>Edit Event</MenuItem>
        <MenuItem>Duplicate Event</MenuItem>
        <MenuItem>Send Invitations</MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>Delete Event</MenuItem>
      </Menu>
    </Box>
  );
};