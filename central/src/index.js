import React from 'react';
import ReactDOM from 'react-dom';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports'
import './index.css';
import App from './App';

Amplify.configure(awsconfig)
Auth.configure(awsconfig)

ReactDOM.render(<App />, document.getElementById('root'));
