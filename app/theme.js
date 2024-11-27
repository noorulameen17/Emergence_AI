// src/theme.js
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Silkscreen } from '../Silkscreen-Regular.ttf';

const theme = createTheme({
  palette: {
    primary: {
      main: "8B5DFF", // You can customize the primary color
    },
    secondary: {
      main: "#dc004e", // You can customize the secondary color
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
