import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home as HomeIcon, History as HistoryIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useNavigate, Outlet, Routes, Route } from 'react-router-dom';

const HomePageWithRoutes = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch(newValue) {
      case 0:
        navigate('/workouts');
        break;
      case 1:
        navigate('/activity');
        break;
      case 2:
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ pb: 7, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>
      <Paper 
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} 
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Activity" icon={<HistoryIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

// This component will be used by the router
const HomePage = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePageWithRoutes />}>
        <Route index element={
          <div style={{ padding: '20px' }}>
            <h2>Welcome to Feeel Web</h2>
            <p>Select a tab below to get started</p>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default HomePage;