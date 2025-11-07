import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Fab } from '@mui/material';
import { Add as AddIcon, PlayArrow as PlayArrowIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const WorkoutListScreen = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const handleCreateNewWorkout = () => {
    navigate('/workouts/new');
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Workouts
      </Typography>
      <List>
        {state.workouts.map((workout) => (
          <ListItem key={workout.id} divider>
            <ListItemText
              primary={workout.name}
              secondary={`${workout.exercises} exercises • ${workout.duration} • ${workout.description}`}
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                aria-label="edit" 
                onClick={() => navigate(`/workouts/edit/${workout.id}`)}
              >
                <EditIcon />
              </IconButton>
              <IconButton edge="end" component={Link} to={`/workouts/${workout.id}`}>
                <PlayArrowIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateNewWorkout}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default WorkoutListScreen;