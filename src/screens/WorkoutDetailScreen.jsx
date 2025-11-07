import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Fab, CircularProgress, Slider } from '@mui/material';
import { PlayArrow, Pause, Replay, SkipNext } from '@mui/icons-material';
import { workoutExercises } from '../utils/exerciseData';
import { useAppContext } from '../context/AppContext';

export const WorkoutDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const exercises = workoutExercises[id] || [];
  const currentExercise = exercises[currentExerciseIndex];
  const currentWorkout = state.workouts.find(workout => workout.id === parseInt(id));

  useEffect(() => {
    let interval = null;
    
    if (currentExercise && isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (currentExerciseIndex < exercises.length - 1) {
              setCurrentExerciseIndex(prevIndex => prevIndex + 1);
              return exercises[currentExerciseIndex + 1]?.duration || 0;
            } else {
              setIsPlaying(false);
              setIsCompleted(true);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, currentExerciseIndex, exercises]);

  useEffect(() => {
    if (currentExercise) {
      setTimeLeft(currentExercise.duration);
    }
  }, [currentExerciseIndex, currentExercise]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentExerciseIndex(0);
    setTimeLeft(exercises[0]?.duration || 0);
    setIsCompleted(false);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeLeft(exercises[currentExerciseIndex + 1]?.duration || 0);
      setIsPlaying(false);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    const handleDoAgain = () => {
      setIsPlaying(false);
      setCurrentExerciseIndex(0);
      setTimeLeft(exercises[0]?.duration || 0);
      setIsCompleted(false);
    };

    const handleBackToWorkouts = () => {
      // Add workout to history
      if (currentWorkout) {
        const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
        const calories = Math.round(totalDuration * 0.15); // Estimate calories burned
        
        dispatch({
          type: 'ADD_WORKOUT_HISTORY',
          payload: {
            id: Date.now(), // Use timestamp as ID
            name: currentWorkout.name,
            date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
            duration: `${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`,
            calories: calories
          }
        });
      }
      navigate('/workouts');
    };

    return (
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Workout Completed! 🎉
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Great job completing your workout!
        </Typography>
        <Button variant="contained" size="large" onClick={handleDoAgain} sx={{ mt: 2, mr: 1 }}>
          Do Again
        </Button>
        <Button variant="outlined" size="large" onClick={handleBackToWorkouts} sx={{ mt: 2, ml: 1 }}>
          Back to Workouts
        </Button>
      </Container>
    );
  }

  if (!currentExercise) {
    return (
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">
          No exercises found for this workout
        </Typography>
        <Button variant="outlined" onClick={() => window.history.back()} sx={{ mt: 2 }}>
          Back to Workouts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 3 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Exercise {currentExerciseIndex + 1} of {exercises.length}
        </Typography>
        
        <Typography variant="h4" align="center" gutterBottom>
          {currentExercise.name}
        </Typography>
        
        <Typography variant="h6" align="center" gutterBottom>
          {currentExercise.description}
        </Typography>

        <Box sx={{ 
          width: 250, 
          height: 250, 
          borderRadius: '10px', 
          overflow: 'hidden', 
          position: 'relative', 
          my: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd'
        }}>
          {currentExercise.image ? (
            <img
              src={`/exercise_images/${currentExercise.image}.webp`}
              alt={currentExercise.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Exercise Image
            </Typography>
          )}
        </Box>

        <Box sx={{ width: 200, height: 200, borderRadius: '50%', border: '10px solid #e0e0e0', position: 'relative', my: 2 }}>
          <CircularProgress 
            variant="determinate" 
            value={100 - (timeLeft / currentExercise.duration * 100)} 
            size={200} 
            thickness={4}
            sx={{ 
              position: 'absolute', 
              top: -10, 
              left: -10, 
              color: '#1976d2',
              zIndex: 1
            }} 
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" component="div">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" align="center" color="text.secondary">
          {Math.floor((currentExerciseIndex / exercises.length) * 100)}% Complete
        </Typography>
        
        <Slider
          value={(currentExerciseIndex / exercises.length) * 100}
          disabled
          sx={{ width: '80%', mt: 2 }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 'auto', pb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleRestart}
          startIcon={<Replay />}
        >
          Restart
        </Button>
        <Button
          variant={isPlaying ? "outlined" : "contained"}
          onClick={handlePlayPause}
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
        >
          {isPlaying ? "Pause" : "Start"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleNext}
          endIcon={<SkipNext />}
        >
          Skip
        </Button>
      </Box>
    </Container>
  );
};