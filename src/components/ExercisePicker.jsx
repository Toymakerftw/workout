import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Box,
  Chip
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { exercisesData } from '../utils/exerciseData';

const ExercisePicker = ({ open, onClose, onAddExercises, selectedExercises = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter exercises based on search term
  const filteredExercises = Object.entries(exercisesData).filter(([key, exercise]) => {
    return exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (exercise.muscles && exercise.muscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())));
  });

  const handleAddExercise = (exerciseId) => {
    const exercise = exercisesData[exerciseId];
    onAddExercises({ ...exercise });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen
    >
      <DialogTitle>
        Add Exercises
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Select exercises to add to your workout
        </DialogContentText>
        
        <TextField
          autoFocus
          margin="dense"
          label="Search exercises"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />
        
        <List>
          {filteredExercises.map(([key, exercise]) => {
            const isAdded = selectedExercises.some(ex => ex.id === exercise.id);
            return (
              <ListItem key={key} divider>
                <ListItemText
                  primary={exercise.name}
                  secondary={
                    <React.Fragment>
                      <Box component="span" sx={{ display: 'block' }}>
                        {exercise.description}
                      </Box>
                      <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                        <Chip 
                          label={exercise.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 0.5, mt: 0.5 }}
                        />
                        {exercise.muscles && exercise.muscles.map((muscle, idx) => (
                          <Chip 
                            key={idx}
                            label={muscle} 
                            size="small" 
                            variant="outlined"
                            sx={{ mr: 0.5, mt: 0.5 }}
                          />
                        ))}
                      </Box>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Button 
                    startIcon={<AddIcon />}
                    onClick={() => handleAddExercise(key)}
                    disabled={isAdded}
                  >
                    {isAdded ? 'Added' : 'Add'}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExercisePicker;