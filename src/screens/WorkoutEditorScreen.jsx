import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Fab
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ExercisePicker from '../components/ExercisePicker';
import { exercisesData } from '../utils/exerciseData';

const WorkoutEditorScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const isEditing = id !== undefined && id !== 'new';
  
  const [workout, setWorkout] = useState({
    id: null,
    name: '',
    description: '',
    exercises: [],
    category: 'strength',
    exerciseDuration: 30,
    breakDuration: 15
  });
  
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existingWorkout = state.workouts.find(w => w.id === parseInt(id));
      if (existingWorkout) {
        // For editing, we need to get the actual exercise data
        setWorkout({
          id: existingWorkout.id,
          name: existingWorkout.name,
          description: existingWorkout.description || '',
          exercises: existingWorkout.exercises_list || [], // Use exercises_list if available, otherwise empty array
          category: existingWorkout.category || 'strength',
          exerciseDuration: existingWorkout.exerciseDuration || 30,
          breakDuration: existingWorkout.breakDuration || 15
        });
      }
    }
  }, [id, isEditing, state.workouts]);

  const handleSave = () => {
    if (!workout.name.trim()) {
      alert('Please enter a workout name');
      return;
    }
    
    if (workout.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }
    
    const totalDuration = workout.exercises.reduce((total, exercise, index) => {
      // Add exercise duration
      const exerciseTime = exercise.duration || workout.exerciseDuration;
      // Add break duration only if it's not the last exercise
      const breakTime = index < workout.exercises.length - 1 ? workout.breakDuration : 0;
      return total + exerciseTime + breakTime;
    }, 0);
    
    const workoutPayload = {
      ...workout,
      id: isEditing ? parseInt(id) : (state.workouts.length > 0 ? Math.max(...state.workouts.map(w => w.id)) : 0) + 1,
      exercises: workout.exercises.length,
      duration: `${Math.round(totalDuration / 60)} min`,
      exercises_list: workout.exercises,  // Save the actual exercise list
      exerciseDuration: workout.exerciseDuration,
      breakDuration: workout.breakDuration
    };
    
    // Ensure the ID is valid for editing
    if (isEditing && (isNaN(parseInt(id)) || parseInt(id) <= 0)) {
      console.error('Invalid workout ID for editing:', id);
      alert('Invalid workout ID. Cannot edit this workout.');
      return;
    }
    
    console.log('About to dispatch action', { 
      actionType: isEditing ? 'UPDATE_WORKOUT' : 'CREATE_WORKOUT', 
      payload: workoutPayload,
      stateWorkouts: state.workouts
    });

    if (isEditing) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: workoutPayload });
    } else {
      dispatch({ type: 'CREATE_WORKOUT', payload: workoutPayload });
    }
    
    console.log('Dispatch completed, navigating to /workouts');
    navigate('/workouts');
  };

  const handleAddExercise = (exerciseId) => {
    const exercise = exercisesData[exerciseId];
    if (exercise) {
      setWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...exercise, duration: prev.exerciseDuration }]
      }));
    }
  };

  const handleRemoveExercise = (index) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const handleExerciseReorder = (fromIndex, toIndex) => {
    const newExercises = [...workout.exercises];
    const [movedItem] = newExercises.splice(fromIndex, 1);
    newExercises.splice(toIndex, 0, movedItem);
    setWorkout(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Edit Workout' : 'Create Workout'}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<DoneIcon />}
          onClick={handleSave}
          color="primary"
        >
          Save Workout
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Workout Name"
            value={workout.name}
            onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description (Optional)"
            value={workout.description}
            onChange={(e) => setWorkout(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={workout.category}
              onChange={(e) => setWorkout(prev => ({ ...prev, category: e.target.value }))}
            >
              <MenuItem value="strength">Strength</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="stretching">Stretching</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Exercises</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => setShowExercisePicker(!showExercisePicker)}
            >
              Add Exercise
            </Button>
          </Box>

          <ExercisePicker
            open={showExercisePicker}
            onClose={() => setShowExercisePicker(false)}
            onAddExercises={(exercise) => {
              setWorkout(prev => ({
                ...prev,
                exercises: [...prev.exercises, { ...exercise, duration: prev.exerciseDuration }]
              }));
              setShowExercisePicker(false);
            }}
            selectedExercises={workout.exercises}
          />

          {workout.exercises.length > 0 ? (
            <List>
              {workout.exercises.map((exercise, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={exercise.name}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {exercise.description}
                          </Typography>
                          <TextField
                            label="Duration (seconds)"
                            type="number"
                            value={exercise.duration || workout.exerciseDuration}
                            onChange={(e) => handleExerciseChange(index, 'duration', parseInt(e.target.value) || workout.exerciseDuration)}
                            inputProps={{ min: 1 }}
                            size="small"
                            sx={{ mt: 1, width: '120px' }}
                          />
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleRemoveExercise(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
              No exercises added yet. Add exercises to build your workout!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Workout Timing Controls */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Workout Timing</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Exercise Duration (seconds)"
              type="number"
              value={workout.exerciseDuration}
              onChange={(e) => setWorkout(prev => ({ 
                ...prev, 
                exerciseDuration: parseInt(e.target.value) || 30 
              }))}
              inputProps={{ min: 1 }}
              fullWidth
            />
            <TextField
              label="Break Duration (seconds)"
              type="number"
              value={workout.breakDuration}
              onChange={(e) => setWorkout(prev => ({ 
                ...prev, 
                breakDuration: parseInt(e.target.value) || 15 
              }))}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      <Fab
        variant="extended"
        color="primary"
        onClick={handleSave}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <DoneIcon sx={{ mr: 1 }} />
        Save Workout
      </Fab>
    </Container>
  );
};

export default WorkoutEditorScreen;