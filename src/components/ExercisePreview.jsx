import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import ExerciseInfoDialog from './ExerciseInfoDialog';

const ExercisePreview = ({ exercise, showInfoButton = true }) => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  return (
    <>
      <Card 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          height: 'auto',
          boxShadow: 2,
          '&:hover': {
            boxShadow: 3
          }
        }}
      >
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0 // This allows flex children to shrink below their content size
        }}>
          <CardContent sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {exercise.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {exercise.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  <Chip 
                    label={exercise.category} 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                  />
                  {exercise.muscles && exercise.muscles.map((muscle, idx) => (
                    <Chip 
                      key={idx} 
                      label={muscle} 
                      size="small" 
                      variant="outlined" 
                    />
                  ))}
                </Box>
              </Box>
              
              {showInfoButton && (
                <Tooltip title="View more info">
                  <IconButton
                    size="small"
                    onClick={() => setInfoDialogOpen(true)}
                    sx={{ 
                      alignSelf: 'flex-start',
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardContent>
        </Box>
        
        {exercise.image && (
          <CardMedia
            component="img"
            sx={{ 
              width: { xs: '100%', md: 120 },
              height: 120,
              objectFit: 'contain',
              flexShrink: 0,
              backgroundColor: '#f5f5f5',
              m: 1,
              borderRadius: 1
            }}
            image={`/exercise_images/${exercise.image}.webp`}
            alt={exercise.name}
          />
        )}
      </Card>
      
      <ExerciseInfoDialog
        exercise={exercise}
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
      />
    </>
  );
};

export default ExercisePreview;