import React from 'react';
import './App.scss';
import { RootRouter } from '@src/Routers';
import { BrowserRouter as Router } from 'react-router-dom';
import { DbContextProvider, SettingContextProvider } from '@src/Context';
import { WindowSizeContextProvider } from './Context/WindowSizeContext';

const App = () => {
  return (
    <DbContextProvider>
      <SettingContextProvider>
        <WindowSizeContextProvider>
          <Router>
            <RootRouter />
          </Router>
        </WindowSizeContextProvider>
      </SettingContextProvider>
    </DbContextProvider>
  );
};

export default App;
