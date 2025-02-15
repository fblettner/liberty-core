/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { css, Global} from "@emotion/react";
import { useTheme } from "./theme";

const GlobalStyles = () => {
  const { theme } = useTheme();
  
  return (
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
        background-color: ${theme.palette.mode === "dark" ? "#121212" : "#ffffff"};
        color: ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 0, 0, 0.87)"};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color-scheme: ${theme.palette.mode === "dark" ? "dark" : "light"};
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
        border-bottom: 1px solid ${theme.palette.mode === "dark" ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)"};
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
};

export default GlobalStyles;