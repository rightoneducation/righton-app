import { AppRegistry } from 'react-native'
import 'react-native-gesture-handler'
import App from './App'
import { name as appName } from './app.json'
import './global.js'

console.log(`registering ${appName}`)
AppRegistry.registerComponent(appName, () => App)
