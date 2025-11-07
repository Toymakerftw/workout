# Feeel Web

A simple home workout app that respects your privacy. This web version mirrors the functionality of the Android app with the following features:

- **Workout Management**: Create, edit, and manage custom workouts
- **Exercise Library**: Browse and select from a comprehensive exercise database
- **Workout Player**: Interactive workout sessions with timer and progress tracking
- **Activity Tracking**: Comprehensive workout history with calendar view
- **Settings**: Customize app appearance with dark mode and personalized colors
- **Workout Timing**: Adjustable exercise and break durations per workout

## Features

### Workout Management
- Create new custom workouts with the workout editor
- Add exercises from the comprehensive exercise library
- Edit existing workouts to customize exercises and timing
- Set custom exercise durations and break times

### Activity Tracking
- View workout history with a calendar interface
- Track both completed and incomplete workouts
- Detailed statistics on workout duration and calories burned

### Settings
- Toggle between light and dark themes
- Enable personalized color schemes
- Language selection
- Notification preferences

## Tech Stack

- React with Vite
- Material UI for styling
- React Router for navigation
- React Calendar for calendar views

## Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
