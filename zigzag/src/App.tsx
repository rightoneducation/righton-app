import React from 'react';
import './App.css';
import {Amplify} from 'aws-amplify';
import awsconfig from './aws-exports';
import { UserApiClient } from './APIClient/user';
import { DailyQuestionAPIClient } from './API/client/dailyQuestion/DailyQuestionApiClient';

function App() {
  Amplify.configure(awsconfig);

  const apiClient = new UserApiClient();
  const dailyQuestionClient = new DailyQuestionAPIClient();

  return (
    <div className="App">
      <header className="App-header">
        Under Construction
        <br />
        <button onClick={() => alert('Button clicked!')}>Click Me</button>
      </header>
    </div>
  );
}

export default App;