import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import WorkoutListScreen from './screens/WorkoutListScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkoutDetailScreen } from './screens/WorkoutDetailScreen';
import MainLayout from './components/MainLayout';
import WorkoutEditorScreen from './screens/WorkoutEditorScreen';
import CustomWorkoutScreen from './screens/CustomWorkoutScreen';
import { Howler } from 'howler';

const App = () => {
  useEffect(() => {
    const unlockAudio = () => {
      if (Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<WorkoutListScreen />} />
            <Route path="/workouts" element={<WorkoutListScreen />} />
            <Route path="/workouts/:id" element={<WorkoutDetailScreen />} />
            <Route path="/workouts/edit/:id" element={<WorkoutEditorScreen />} />
            <Route path="/workout/edit/new" element={<WorkoutEditorScreen />} />
            <Route path="/workouts/new" element={<WorkoutEditorScreen />} />
            <Route path="/workouts/generate" element={<CustomWorkoutScreen />} />
            <Route path="/activity" element={<ActivityScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </MainLayout>
      </Router>
    </AppProvider>
  );
};

export default App;
