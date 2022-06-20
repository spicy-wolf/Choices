import React from 'react';
import { RootRouter } from '@src/Routers';
import { BrowserRouter as Router } from 'react-router-dom';
import { DbContextProvider, SettingContextProvider } from '@src/Context';
import { WindowSizeContextProvider } from './Context/WindowSizeContext';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

const App = () => {
  const theme = createTheme();

  return (
    <DbContextProvider>
      <SettingContextProvider>
        <WindowSizeContextProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <RootRouter />
            </Router>
          </ThemeProvider>
        </WindowSizeContextProvider>
      </SettingContextProvider>
    </DbContextProvider>
  );
};

export default App;
