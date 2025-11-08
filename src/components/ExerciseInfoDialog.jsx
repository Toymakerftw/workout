import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ExerciseInfoDialog = ({ exercise, open, onClose }) => {
  if (!exercise) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Typography variant="h5" component="div">
          {exercise.name}
        </Typography>
        <Button
          onClick={onClose}
          sx={{ 
            minWidth: 0,
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ mb: 2 }}>
          {exercise.description}
        </DialogContentText>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Category
          </Typography>
          <Chip
            label={exercise.category}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>

        {exercise.muscles && exercise.muscles.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Primary Muscles
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exercise.muscles.map((muscle, idx) => (
                <Chip
                  key={idx}
                  label={muscle}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Exercise image */}
        {exercise.image && (
          <Box sx={{ 
            mt: 2, 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'center',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
            p: 2
          }}>
            <img
              src={`/exercise_images/${exercise.image}.webp`}
              alt={exercise.name}
              style={{
                maxWidth: '100%',
                maxHeight: '250px',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        
        <DialogContentText>
          <Typography variant="body2" color="text.secondary">
            <strong>Disclaimer:</strong> The exercises provided are for informational and educational purposes only. 
            Consult with a healthcare professional before beginning any fitness program. 
            Individual results may vary.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExerciseInfoDialog;