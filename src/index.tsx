/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// import i18n (needs to be bundled ;))
import './i18n';

const container = document.getElementById('body');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

