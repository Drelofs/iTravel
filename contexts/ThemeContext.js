import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    (async () => {
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      const storedLargeText = await AsyncStorage.getItem('largeText');

      if (storedDarkMode !== null) setDarkMode(storedDarkMode === 'true');
      if (storedLargeText !== null) setLargeText(storedLargeText === 'true');
    })();
  }, []);

  const toggleTheme = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', newValue.toString());
  };

  const toggleLargeText = async () => {
    const newValue = !largeText;
    setLargeText(newValue);
    await AsyncStorage.setItem('largeText', newValue.toString());
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, largeText, toggleLargeText }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
