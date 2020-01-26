import { useState } from 'react';

export function useThemeStatus(){
  const themeList = ['dark', 'light', 'blue'];
  const [theme, setTheme] = useState(0);

  function nextTheme(){
    setTheme(theme => (theme + 1) % themeList.length);
  }

  return {
    theme: themeList[theme],
    toggle: nextTheme
  }
}

export function useUserStatus(){
  const [user, setUser] = useState('guest');
  return [user, setUser]
}