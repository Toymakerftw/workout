import React from 'react';
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useAppContext } from '../context/AppContext';

export const SettingsScreen = () => {
  const { state, dispatch } = useAppContext();

  const handleDarkModeChange = (event) => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const handleRemindersChange = (event) => {
    dispatch({
      type: 'UPDATE_SETTING',
      payload: { key: 'remindersEnabled', value: event.target.checked }
    });
  };

  const handleLanguageChange = (event) => {
    dispatch({
      type: 'UPDATE_SETTING',
      payload: { key: 'language', value: event.target.value }
    });
  };

  const handlePersonalizedColorsChange = (event) => {
    dispatch({
      type: 'UPDATE_SETTING',
      payload: { key: 'personalizedColors', value: event.target.checked }
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Appearance</Typography>

          <List>
            <ListItem disablePadding>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.settings.darkMode}
                    onChange={handleDarkModeChange}
                    name="darkMode"
                  />
                }
                label="Dark Mode"
              />
            </ListItem>
            <ListItem disablePadding>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.settings.personalizedColors}
                    onChange={handlePersonalizedColorsChange}
                    name="personalizedColors"
                  />
                }
                label="Personalized Colors"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Notifications</Typography>

          <List>
            <ListItem disablePadding>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.settings.remindersEnabled}
                    onChange={handleRemindersChange}
                    name="reminders"
                  />
                }
                label="Workout Reminders"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Language</Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={state.settings.language}
              label="Language"
              onChange={handleLanguageChange}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
              <MenuItem value="it">Italiano</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>About</Typography>
          <Typography variant="body2" color="text.secondary">
            Feeel Web v1.0.0<br />
            A simple home workout app that respects your privacy
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};