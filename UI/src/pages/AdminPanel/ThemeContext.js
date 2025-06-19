import { createContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material';

export const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children, theme }) => {
  const [mode, setMode] = useState('light');
  const toggleTheme = () => setMode(mode === 'light' ? 'dark' : 'light');

  const themeOverride = useMemo(
    () => ({
      ...theme,
      palette: { ...theme.palette, mode },
    }),
    [theme, mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={themeOverride}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};