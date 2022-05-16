import React from 'react';
import './App.scss';
import { RootRouter } from '@src/Routers';
import { BrowserRouter as Router } from 'react-router-dom';
import { DbContextProvider, SettingContextProvider } from '@src/Context';

const App = () => {
  return (
    <DbContextProvider>
      <SettingContextProvider>
        <Router>
          <RootRouter />
        </Router>
      </SettingContextProvider>
    </DbContextProvider>
  );
};

export default App;
