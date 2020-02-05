import React, { useEffect, useState } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import LocalStorage from '../lib/Categories/LocalStorage';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    LocalStorage.init().then(async () => {
      let session;
      try {
        session = await Auth.currentSession();
      } catch (err) {
        console.error(err);
        session = null;
      }
      this.setSession(session);
      debugger;
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hey. I am ready to rock.</h1>
      </header>
    </div>
  );
}

export default App;
