import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Event,
  LocationOn,
  People,
  MoreVert,
  CheckCircle,
  AccessTime,
} from '@mui/icons-material';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    attendees: {
      total: number;
      confirmed: number;
    };
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  };
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const EventCard = ({ event, onMenuClick }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const attendeeProgress = (event.attendees.confirmed / event.attendees.total) * 100;

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {event.title}
            </Typography>
            <Chip
              label={event.status}
              color={getStatusColor(event.status)}
              size="small"
              sx={{ borderRadius: 1 }}
            />
          </Box>
          <IconButton onClick={onMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {event.date} at {event.time}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {event.location}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Attendees
              </Typography>
            </Box>
            <Tooltip title="Confirmed attendees" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="body2">
                  {event.attendees.confirmed}/{event.attendees.total}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={attendeeProgress}
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: 'background.default',
            }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};