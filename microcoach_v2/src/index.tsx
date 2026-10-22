import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import configureAmplify from './lib/configureAmplify';

// import react-i18n to support internationalisation
import './i18n';

// Configure Amplify (Cognito + Google OAuth) once, before anything renders.
configureAmplify();

// react-modal needs to know the app root so it can mark it aria-hidden while a
// modal is open. Without this it warns and leaves the background readable by
// screen readers — the other apps in the monorepo skip it. Set here rather
// than in App so importing App (as App.test does) doesn't need a #root.
Modal.setAppElement('#root');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
