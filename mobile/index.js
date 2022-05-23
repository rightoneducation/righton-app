import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import Amplify, { Auth } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure({
  Auth: awsExports
})

AppRegistry.registerComponent('righton', () => App);
