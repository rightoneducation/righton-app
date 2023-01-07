import codePush from 'react-native-code-push'

import AppContainer from './src/Navigator'

let App = () => {
  return (
    <AppContainer />
  )
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  updateDialog: true
}

// Pass router to AppContainer for hooking it into the navigation paradigm.
App.router = AppContainer.router

/* eslint no-class-assign: 0 */
App = codePush(codePushOptions)(App)

export default App
