/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
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
    </DbContextProvider >
  );
};

export default App;

