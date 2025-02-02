import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Event,
  People,
  Email,
  MoreVert,
  TrendingUp,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';

export const DashboardPage = () => {
  const stats = [
    { icon: <Event />, label: 'Total Events', value: '24', trend: '+3 this week' },
    { icon: <People />, label: 'Active Users', value: '156', trend: '+12 this month' },
    { icon: <Email />, label: 'Pending Invites', value: '38', trend: '82% response rate' },
  ];

  const upcomingEvents = [
    { title: 'Team Meeting', date: '2024-03-20', time: '10:00 AM', attendees: 12, responses: 8 },
    { title: 'Product Launch', date: '2024-03-22', time: '2:00 PM', attendees: 45, responses: 38 },
    { title: 'Training Session', date: '2024-03-25', time: '11:00 AM', attendees: 20, responses: 15 },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)'
                    : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}>
                    {stat.icon}
                  </Box>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 1,
                    color: 'success.main',
                  }}
                >
                  <TrendingUp fontSize="small" />
                  {stat.trend}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Events */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Upcoming Events
        </Typography>
        <Grid container spacing={3}>
          {upcomingEvents.map((event, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {event.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule fontSize="small" />
                          {event.date} at {event.time}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <People fontSize="small" />
                          {event.attendees} invited
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography 
                        variant="body2" 
                        color="success.main" 
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <CheckCircle fontSize="small" />
                        {event.responses} responses
                      </Typography>
                      <Box sx={{ width: 100, mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(event.responses / event.attendees) * 100}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};