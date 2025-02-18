import { ReactNode } from "react";

/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
export interface Theme {
  mixins?: {
    toolbar: {
      minHeight: number;
    };
  };

  palette: {
    primary: { main: string; };
    secondary: { main: string; };
    text: { primary: string; secondary: string; disabled: string; };
    background: { default: string; paper: string; };
    divider: string;
    mode: string;
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
    loginImage?: string;
  };
  backgroundShades?: {
    light: {
      start: string;
      middle: string;
    };
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
}export interface ThemeContextType {
  theme: Theme;
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

