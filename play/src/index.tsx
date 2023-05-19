import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import react-i18n to support internationalisation
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
