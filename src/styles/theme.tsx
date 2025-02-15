/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { ReactNode, useEffect, useState } from 'react';
import { createContext, useContext } from "react";

import '@ly_styles/custom.css';
import { ThemeProvider } from '@emotion/react';
import GlobalStyles from './GlobalStyles';

declare module '@emotion/react' {
  export interface Theme {
    mixins: {
      toolbar: {
        minHeight: number;
      };
    };

    palette: {
      primary: { main: string };
      secondary: { main: string };
      text: { primary: string; secondary: string; disabled: string };
      background: { default: string, paper: string };
      divider: string;
      mode: string
      action: {
        hover: string;
        selected: string;
        disabled: string;
      };
      grey: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
      };
    };
    background: {
      default: string;
      loginPage: string;
    };
    backgroundShades: {
      light: {
        start: string;
        middle: string;
      },
      dark: {
        start: string;
        middle: string;
      };
    };
    color: {
      default: string;
    };
    shadows: string[];
    spacing: (factor: number) => string;
  }
}

interface Theme {
  palette: {
    mode: string;
    primary: { main: string };
    secondary: { main: string };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    background: {
      default: string;
      paper: string;
    };
    divider: string;
    action: {
      hover: string;
      selected: string;
      disabled: string;
    };
    grey: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
    };
  };
  background: {
    default: string;
    loginPage: string;
  };
  color: {
    default: string;
  };
  spacing: (factor: number) => string;
  shadows: string[];
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (update: Partial<Theme> | ((prevTheme: Theme) => Theme)) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface LYThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<Theme>;
}

// Define types for theme colors
export type ThemeColors = Record<string, string | Record<string, string>>;
export interface ThemeColorItem {
    TCL_KEY: string;
    TCL_LIGHT: string;
    TCL_DARK: string;
}

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
export const LYThemeProvider = ({ children, customTheme }: { children: ReactNode; customTheme?: Partial<Theme> }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [theme, setTheme] = useState<Theme>({ ...defaultTheme(true), ...customTheme });

  useEffect(() => {
      setTheme({ ...defaultTheme(theme.palette.mode === "dark"), ...customTheme }); 
  }, [customTheme]);

  const updateTheme = (update: Partial<Theme> | ((prevTheme: Theme) => Theme)) => {
    setTheme((prevTheme) => {
      const newTheme = typeof update === "function" ? update(prevTheme) : { ...prevTheme, ...update };
      return newTheme;
    });
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    setTheme((prevTheme) => ({
      ...prevTheme,
      ...defaultTheme(!darkMode),
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, darkMode, toggleDarkMode }}>
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
