import React from 'react';
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, Box } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

export const ActivityScreen = () => {
  const { state } = useAppContext();
  const history = state.workoutHistory;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Activity
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">This Week</Typography>
          <Typography variant="h4">3 Workouts</Typography>
          <Typography variant="body2" color="text.secondary">1.2h total • 580 kcal</Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarToday sx={{ mr: 1 }} />
        <Typography variant="h6">Workout History</Typography>
      </Box>
      
      <List>
        {history.map((record) => (
          <ListItem key={record.id} divider>
            <ListItemText
              primary={record.name}
              secondary={`${record.date} • ${record.duration} • ${record.calories} kcal`}
            />
          </ListItem>
        ))}
      </List>
      
      {history.length === 0 && (
        <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
          No workout history yet. Complete a workout to see it here!
        </Typography>
      )}
    </Container>
  );
};