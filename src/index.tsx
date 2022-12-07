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
