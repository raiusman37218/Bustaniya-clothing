"use client";
import localFont from "next/font/local";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
const localFnt = localFont({
  src: [
    {
      path: "../fonts/Gill-Sans-MT-Italic.ttf",
    },
  ],
});

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#ffff",
    },
    background: {
      paper: "#ffff",
      default: "#ffff",
    },
    text: {
      primary: "#0C0C0C",
      secondary: "#fff",
    },
    grey: {
      500: "#D1D9CF",
      800: "#404040",
    },
    success: {
      main: "#5A6D57",
      light: "#748C70",
    },
  },
  typography: {
    fontFamily: '"Inter", "Montserrat", sans-serif',
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      lineHeight: 1.15,
      fontSize: "2.4rem",
      letterSpacing: "-0.02em",
    },
    h5: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      lineHeight: 1.2,
      fontSize: "1.75rem",
      letterSpacing: "-0.02em",
    },
  },

  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: "green",
          "&.Mui-selected": {
            color: "#5A6D57",
          },
          "&:hover": {
            color: "#5A6D57",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.9rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#606060",
          "&.Mui-focused": {
            color: "#748C70",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "12px",
        },
        root: {
          borderRadius: 0,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#748C70",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            color: "#D1D9CF",
            opacity: 1,
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "none",
          },
        },
      },
      defaultProps: {
        disableRipple: true,
        disableElevation: false,
        disableFocusRipple: true,
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
