/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { ReactNode, useEffect, useState } from 'react';
import { createContext, useContext } from "react";

import '@ly_styles/custom.css';
import { ThemeProvider } from '@emotion/react';
import GlobalStyles from '../styles/GlobalStyles';
import { Theme, ThemeContextType } from '@ly_types/lyThemes';
import { useMediaQuery } from '@ly_common/UseMediaQuery';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme = (darkMode: boolean): Theme => ({
  palette: {
    mode: darkMode ? "dark" : "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#ff4081" },
    text: {
      primary: darkMode ? "#fff" : "#000",
      secondary: darkMode ? "#bbb" : "#555",
      disabled: darkMode ? "#666" : "#ccc",
    },
    background: {
      default: darkMode ? "#121212" : "#ffffff",
      paper: darkMode ? "#1d1d1d" : "#f5f5f5",
    },
    divider: darkMode ? "#444" : "#ddd",
    action: {
      hover: darkMode ? "#333" : "#eee",
      selected: darkMode ? "#444" : "#ddd",
      disabled: darkMode ? "#666" : "#ccc",
    },
    grey: {
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
    },
  },
  background: {
    default: darkMode ? "#121212" : "#ffffff",
    loginPage: darkMode ? "#1d1d1d" : "#f0f0f0",
  },
  color: { default: darkMode ? "#ffffff" : "#000000" },
  spacing: (factor: number) => `${8 * factor}px`,
  shadows: ["none", "0px 1px 3px rgba(0,0,0,0.2)", "0px 3px 6px rgba(0,0,0,0.3)"],
});


// Theme Provider Component
export const LYThemeProvider = ({ children, customTheme }: { children: ReactNode; customTheme?: ((darkMode: boolean) => Theme)}) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const getTheme = (darkMode: boolean) => (customTheme ? customTheme(darkMode) : defaultTheme(darkMode));
  const [theme, setTheme] = useState<Theme>(getTheme(darkMode));

  useEffect(() => {
    setTheme(getTheme(darkMode)); 
  }, [customTheme, darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    setTheme(getTheme(!darkMode));
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom Hook for Accessing Theme Context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a LYThemeProvider");
  }
  return context;
};
