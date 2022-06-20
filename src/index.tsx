import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const body = document.getElementById('body');
if (body) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    body
  );
}
