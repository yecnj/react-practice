import React from 'react';

export const ThemeContext = React.createContext({
  theme: 'dark',
  toggle: () => {}
});

export const UserContext = React.createContext('guest');