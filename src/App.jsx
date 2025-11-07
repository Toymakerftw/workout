import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';
import WorkoutListScreen from './screens/WorkoutListScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkoutDetailScreen } from './screens/WorkoutDetailScreen';
import MainLayout from './components/MainLayout';

// Define a theme based on context or settings
const App = () => {
  // In a real app, we would get this from context
  const theme = createTheme({
    palette: {
      mode: 'light', // This would be dynamic based on context
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#e57373',
      },
      background: {
        default: '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<WorkoutListScreen />} />
              <Route path="/workouts" element={<WorkoutListScreen />} />
              <Route path="/workouts/:id" element={<WorkoutDetailScreen />} />
              <Route path="/activity" element={<ActivityScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;