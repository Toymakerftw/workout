import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, Box, Paper } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const ActivityScreen = () => {
  const { state } = useAppContext();
  const history = state.workoutHistory;
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Group workout history by date
  const historyByDate = history.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  // Convert selected date to string format for comparison
  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // Get workouts for the selected date
  const workoutsForSelectedDate = historyByDate[selectedDateString] || [];

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Activity
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">This Week</Typography>
          <Typography variant="h4">{history.length} Workouts</Typography>
          <Typography variant="body2" color="text.secondary">
            {history.reduce((total, record) => {
              // Convert duration to minutes for total calculation
              const durationMatch = record.duration.match(/(\d+)\s*min/) || record.duration.match(/(\d+)\s*h/);
              if (durationMatch) {
                const value = parseInt(durationMatch[1]);
                if (record.duration.includes('h')) {
                  return total + value * 60; // Convert hours to minutes
                }
                return total + value;
              }
              return total;
            }, 0)} min total • {history.reduce((total, record) => total + record.calories, 0)} kcal
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarToday sx={{ mr: 1 }} />
            <Typography variant="h6">Calendar</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                  // Highlight dates that have workouts
                  const dateString = date.toISOString().split('T')[0];
                  return historyByDate[dateString] ? 'react-calendar__tile--has-workouts' : null;
                }}
                minDetail="month"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" gutterBottom>
                {selectedDateString}
              </Typography>
              <List>
                {workoutsForSelectedDate.length > 0 ? (
                  workoutsForSelectedDate.map((record) => (
                    <ListItem key={record.id} divider>
                      <ListItemText
                        primary={record.name}
                        secondary={`${record.duration} • ${record.calories} kcal`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No workouts on this date"
                      secondary="Complete a workout to see it here"
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarToday sx={{ mr: 1 }} />
            <Typography variant="h6">All Workout History</Typography>
          </Box>

          <List>
            {history.map((record) => (
              <ListItem key={record.id} divider>
                <ListItemText
                  primary={record.name}
                  secondary={`${record.date} • ${record.duration} • ${record.calories} kcal`}
                />
                {record.status === 'incomplete' && (
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color="orange">
                      Incomplete
                    </Typography>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>

          {history.length === 0 && (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
              No workout history yet. Complete a workout to see it here!
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};