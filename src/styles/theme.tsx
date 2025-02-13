/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

// Import React
import { ReactNode, useState } from 'react';
import { createContext, useContext } from "react";

// Import Custom
import '@ly_styles/custom.css';
import { css, Global, ThemeProvider } from '@emotion/react';

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


// Define Global Styles
const GlobalStyles = ({ darkMode, theme }: { darkMode: boolean, theme: any }) => (
  <Global
    styles={css`
      /* Ensure consistent box-sizing across the application */
      *, *::before, *::after {
        box-sizing: border-box;
      }

                
      /* Scrollbar customization */
      ::-webkit-scrollbar {
        width: 10px; /* Width of the scrollbar */
        height: 10px; /* Height of the scrollbar (for horizontal scrolling) */
      }

      ::-webkit-scrollbar-track {
        background: ${theme.palette.background.paper}; /* Track color */
        border-radius: 8px; /* Rounded corners */
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.palette.primary.main}; /* Thumb color (theme primary) */
        border-radius: 8px; /* Rounded corners */
        border: 2px solid ${theme.palette.background.paper}; /* Add space around thumb */
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.palette.primary.dark}; /* Darker color on hover */
      }

      ::-webkit-scrollbar-corner {
        background: ${theme.palette.background.paper}; /* Corner color for scrollable divs */
      }

      /* Firefox scrollbar styling */
      scrollbar-width: thin; /* Make scrollbar thinner */
      scrollbar-color: ${theme.palette.primary.main} ${theme.palette.background.paper};

      /* Reset default margins and padding */
      body, h1, h2, h3, h4, h5, h6, p, blockquote, pre,
      dl, dd, ol, ul, figure, hr, fieldset, legend,
      button, input, textarea {
        margin: 0;
        padding: 0;
      }

      html, body {
        line-height: 1.5; /* Set the default line height */
        height: 100%; /* Ensure the body spans the viewport */
        width: 100%; /* Ensure the body spans the viewport */
        overflow-x: hidden; /* Prevent horizontal scrolling */
      }

      body {
        font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        font-weight: 400;
        background-color: ${darkMode ? "#121212" : "#ffffff"};
        color: ${darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 0, 0, 0.87)"};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color-scheme: ${darkMode ? "dark" : "light"};
        font-size: 1rem;
        line-height: 1.5;
        letter-spacing: 0.00938em;
      }

      /* Remove list style for lists */
      ol, ul {
        list-style: none;
      }

      /* Remove underline from anchor tags */
      a {
        text-decoration: none;
      }

      /* Ensure tables render consistently */
      table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
      }

      th, td {
        text-align: left; 
        vertical-align: middle; 
        line-height: 2.2;
        border-bottom: 1px solid ${darkMode ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)"};
        font-size: 0.875rem;
      }
  
      /* Prevent overflow of root elements */
      #root, #app {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    `}
  />
);

interface ThemeContextType {
  theme: Theme;
  setTheme: (update: Partial<Theme> | ((prevTheme: Theme) => Theme)) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface LYThemeProviderProps {
  children: ReactNode;
  customTheme?: Partial<Theme>;
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
  const [theme, setTheme] = useState<Theme>({ ...defaultTheme(darkMode), ...customTheme });

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
        <GlobalStyles darkMode={darkMode} theme={theme} />
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
