import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem('darkMode');
      if (saved !== null) setDarkMode(saved === 'true');
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = !darkMode;
    setDarkMode(next);
    await AsyncStorage.setItem('darkMode', next.toString());
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
