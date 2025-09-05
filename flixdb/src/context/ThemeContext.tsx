import React, { createContext, useMemo, useState, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(
    () => (localStorage.getItem('theme') as PaletteMode) || 'light'
  );

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#ff1744' : '#ff5252'
          },
          secondary: {
            main: mode === 'light' ? '#651fff' : '#7c4dff'
          },
          background: {
            default: mode === 'light' ? '#f8f9fb' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
          }
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif`,
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 }
        },
        components: {
          MuiButton: {
            defaultProps: { variant: 'contained' },
            styleOverrides: {
              root: { textTransform: 'none', borderRadius: 999 }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: { transition: 'transform .3s ease, box-shadow .3s ease' }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              root: { backdropFilter: 'blur(8px)', backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(30,30,30,0.8)' }
            }
          }
        }
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
