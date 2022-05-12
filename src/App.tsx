import React from 'react';
import { RootRouter } from '@src/Routers';
import { BrowserRouter as Router } from 'react-router-dom';
import { DbContextProvider } from '@src/Context';

const App = () => {
  return (
    <DbContextProvider>
      <Router>
        <RootRouter />
      </Router>
    </DbContextProvider>
  );
};

export default App;
