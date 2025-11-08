import React, { createContext, useContext, useReducer } from 'react';

// Define the initial state
const initialState = {
  theme: 'light', // 'light' or 'dark'
  workouts: [
    { id: 1, name: 'Beginner Workout', description: 'Great for starting your fitness journey', exercises: 5, duration: '15 min' },
    { id: 2, name: 'Cardio Blast', description: 'Intense cardio workout to get your heart pumping', exercises: 8, duration: '20 min' },
    { id: 3, name: 'Strength Training', description: 'Build muscle with this strength-focused routine', exercises: 10, duration: '25 min' },
    { id: 4, name: 'Morning Stretch', description: 'Start your day with gentle stretching', exercises: 6, duration: '10 min' },
  ],
  workoutHistory: [
    { id: 1, name: 'Cardio Blast', date: '2023-06-15', duration: '22 min', calories: 250 },
    { id: 2, name: 'Strength Training', date: '2023-06-14', duration: '28 min', calories: 180 },
    { id: 3, name: 'Morning Stretch', date: '2023-06-12', duration: '11 min', calories: 75 },
    { id: 4, name: 'Beginner Workout', date: '2023-06-10', duration: '16 min', calories: 150 },
    { id: 5, name: 'Cardio Blast', date: '2023-06-08', duration: '20 min', calories: 230 },
  ],
  settings: {
    darkMode: false,
    remindersEnabled: true,
    language: 'en',
    personalizedColors: false,
    openRouterApiKey: ''
  }
};

// Define the reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        settings: {
          ...state.settings,
          darkMode: !state.settings.darkMode
        }
      };
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value
        }
      };
    case 'ADD_WORKOUT':
      return {
        ...state,
        workouts: [...state.workouts, action.payload]
      };
    case 'CREATE_WORKOUT':
      console.log('CREATE_WORKOUT action received:', action.payload);
      // Use the ID from the payload if it exists, otherwise generate a new one
      const newWorkout = action.payload.id 
        ? action.payload 
        : {
            ...action.payload,
            id: Math.max(0, ...state.workouts.map(w => w.id)) + 1
          };
      console.log('Creating new workout with ID:', newWorkout.id, 'Current workouts:', state.workouts);
      const newState = {
        ...state,
        workouts: [...state.workouts, newWorkout]
      };
      console.log('New state after CREATE_WORKOUT:', newState.workouts);
      return newState;
    case 'ADD_WORKOUT_HISTORY':
      return {
        ...state,
        workoutHistory: [action.payload, ...state.workoutHistory]
      };
    case 'UPDATE_WORKOUT_HISTORY':
      return {
        ...state,
        workoutHistory: state.workoutHistory.map(record => 
          record.id === action.payload.id ? { ...record, ...action.payload } : record
        )
      };
    case 'RESET_WORKOUT_HISTORY':
      return {
        ...state,
        workoutHistory: []
      };
    case 'UPDATE_WORKOUT':
      console.log('UPDATE_WORKOUT action received:', action.payload);
      const updatedWorkouts = state.workouts.map(workout => 
        workout.id === action.payload.id ? { ...workout, ...action.payload } : workout
      );
      console.log('New state after UPDATE_WORKOUT:', updatedWorkouts);
      return {
        ...state,
        workouts: updatedWorkouts
      };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout.id !== action.payload)
      };
    default:
      return state;
  }
};

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    const localData = localStorage.getItem('feeel-app-state');
    return localData ? JSON.parse(localData) : initialState;
  });

  React.useEffect(() => {
    localStorage.setItem('feeel-app-state', JSON.stringify(state));
  }, [state]);

  // Apply dark mode to document
  React.useEffect(() => {
    if (state.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};