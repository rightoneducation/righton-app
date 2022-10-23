// import Buffer from 'buffer'

// global.Buffer = global.Buffer || Buffer.Buffer // Required for aws sigv4 signing

import React from 'react'
import type { Node } from 'react'

import codePush from 'react-native-code-push'

import RootNavigator from './src/Navigator'
// import debug from './src/utils/debug'

// Import after Amplify to provide polyfill and avoid clashing with React.
import 'babel-polyfill'

// LogBox.ignoreAllLogs([])


let App: () => Node = () => {
  return (
    <RootNavigator />
  )
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  updateDialog: true
}

// Pass router to RootNavigator for hooking it into the navigation paradigm.
App.router = RootNavigator.router

/* eslint no-class-assign: 0 */
App = codePush(codePushOptions)(App)

export default App
