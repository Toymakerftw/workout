import React from 'react';
import { Container, Typography, Box, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import WorkoutCard from '../components/WorkoutCard';

const WorkoutListScreen = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  // Log workouts to help debug
  console.log('WorkoutListScreen render - current workouts:', state.workouts);

  const handleCreateNewWorkout = () => {
    navigate('/workouts/new');
  };

  const handleEditWorkout = (workoutId) => {
    navigate(`/workouts/edit/${workoutId}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Workouts
      </Typography>
      <Box sx={{ mb: 4 }}>
        {state.workouts.length > 0 ? (
          state.workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onEdit={handleEditWorkout}
            />
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No workouts created yet. Tap the + button to create your first workout!
          </Typography>
        )}
      </Box>
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