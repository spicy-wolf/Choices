import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// https://react-bootstrap.github.io/getting-started/introduction/#css
// doc: 5.0 https://getbootstrap.com/docs/5.0/getting-started/introduction/
import 'bootstrap/dist/css/bootstrap.css';

const body = document.getElementById('body');
if (body) {
  ReactDOM.render(<App />, body);
}
