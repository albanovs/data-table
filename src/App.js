import React from 'react';
import DataTable from './components/DataTable';
import { ThemeContextProvider, useThemeContext } from './theme';
import { IconButton, Container, Box } from '@mui/material';
import Brightness7 from '@mui/icons-material/Brightness7';
import Brightness4 from '@mui/icons-material/Brightness4';

const AppContent = () => {
  const { toggleTheme, theme } = useThemeContext();

  if (!theme) {
    return null;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton onClick={toggleTheme} color="inherit">
          {theme.palette.mode === 'dark' ? (
            <Brightness7 />
          ) : (
            <Brightness4 />
          )}
        </IconButton>
      </Box>
      <DataTable />
    </Container>
  );
};

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;