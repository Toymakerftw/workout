import React from 'react';
import { Outlet, Routes, Route, NavLink } from 'react-router-dom';
import { Home as HomeIcon, History as HistoryIcon, Settings as SettingsIcon } from '@mui/icons-material';

const NavItem = ({ to, icon, label }) => {
  const navLinkClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <NavLink to={to} className={navLinkClasses}>
      {icon}
      <span className="mt-1">{label}</span>
    </NavLink>
  );
};

const HomePageWithRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-t-md">
        <div className="flex justify-around">
          <NavItem to="/workouts" icon={<HomeIcon />} label="Home" />
          <NavItem to="/activity" icon={<HistoryIcon />} label="Activity" />
          <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" />
        </div>
      </nav>
    </div>
  );
};

// This component will be used by the router
const HomePage = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePageWithRoutes />}>
        <Route index element={
          <div className="p-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Chapter Two</h2>
            <p className="text-gray-600 dark:text-gray-400">Select a tab below to get started</p>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default HomePage;