import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppProvider, useAppContext } from './context/AppContext';
import WorkoutListScreen from './screens/WorkoutListScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkoutDetailScreen } from './screens/WorkoutDetailScreen';
import MainLayout from './components/MainLayout';
import WorkoutEditorScreen from './screens/WorkoutEditorScreen';

// Separate component that consumes the context after it's provided
const ThemedApp = () => {
  const { state } = useAppContext();

  // Create theme based on context settings
  const theme = createTheme({
    palette: {
      mode: state.settings.darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#e57373',
      },
      background: {
        default: state.settings.darkMode ? '#121212' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<WorkoutListScreen />} />
            <Route path="/workouts" element={<WorkoutListScreen />} />
            <Route path="/workouts/:id" element={<WorkoutDetailScreen />} />
            <Route path="/workouts/edit/:id" element={<WorkoutEditorScreen />} />
            <Route path="/workouts/new" element={<WorkoutEditorScreen />} />
            <Route path="/activity" element={<ActivityScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  );
};

export default App;