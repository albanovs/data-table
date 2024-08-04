import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    const getInitialMode = () => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode');
            return savedMode ? JSON.parse(savedMode) : 'light';
        }
        return 'light';
    };

    const [mode, setMode] = useState(getInitialMode);
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );
    const toggleTheme = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            if (typeof window !== 'undefined') {
                localStorage.setItem('themeMode', JSON.stringify(newMode));
            }
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
