import React, { useState, useEffect } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { FitnessCenter as FitnessCenterIcon, History as HistoryIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [value, setValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Set the active navigation item based on the current path
  useEffect(() => {
    if (location.pathname === '/workouts' || location.pathname.startsWith('/workouts/')) {
      setValue(0);
    } else if (location.pathname === '/activity') {
      setValue(1);
    } else if (location.pathname === '/settings') {
      setValue(2);
    }
  }, [location.pathname]);

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
        {children}
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
          <BottomNavigationAction label="Workouts" icon={<FitnessCenterIcon />} />
          <BottomNavigationAction label="Activity" icon={<HistoryIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MainLayout;