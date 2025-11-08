import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import { PlayArrow as PlayArrowIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const WorkoutCard = ({ workout, onEdit }) => {
  // Generate a color based on the workout name for visual distinction
  const getColorByWorkout = (name) => {
    const colors = [
      'primary.main',
      'secondary.main', 
      'success.main',
      'warning.main',
      'error.main',
      'info.main'
    ];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[colorIndex];
  };

  const cardColor = getColorByWorkout(workout.name);

  return (
    <Card 
      sx={{ 
        mb: 2,
        borderLeft: 4,
        borderLeftColor: cardColor,
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {workout.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {workout.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`${workout.exercises || 0} exercises`}
                size="small"
                variant="outlined"
              />
              <Chip 
                label={workout.duration || '0 min'}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => onEdit(workout.id)}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              edge="end" 
              component={Link} 
              to={`/workouts/${workout.id}`}
            >
              <PlayArrowIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;