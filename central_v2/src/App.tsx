import React from 'react';
import Login from './pages/Login';
import { AuthAPIClient } from '@righton/networking';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

function App() {
  const authAPIClient = new AuthAPIClient();
  return (
    <GoogleOAuthProvider clientId="23009502295-0ut6vmh3km13funjo26p409mgmbkeb76.apps.googleusercontent.com">
      <Login authAPIClient={authAPIClient} />
    </GoogleOAuthProvider>
  );
}

export default App;
