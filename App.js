import Buffer from 'buffer';

global.Buffer = global.Buffer || Buffer.Buffer; // Required for aws sigv4 signing

import React from 'react';
import { YellowBox } from 'react-native';

import Amplify, { Auth } from 'aws-amplify';
import awsmobile from './src/aws-exports';

import RootNavigator from './src/Navigator';

import LocalStorage from './lib/Categories/LocalStorage';

YellowBox.ignoreWarnings([]);
YellowBox.ignoreWarnings(
  [
    'Module RNFetchBlob requires main queue setup', 
  ]
);


Amplify.configure(awsmobile);


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      session: null,
    };

    this.handleOnSignIn = this.handleOnSignIn.bind(this);
    this.handleOnSignUp = this.handleOnSignUp.bind(this);
    this.handleOnSignOut = this.handleOnSignOut.bind(this);
  }

  async componentDidMount() {
    await LocalStorage.init();
    let session;
    try {
      session = await Auth.currentSession();
    } catch (err) {
      console.log(err);
      session = null;
    }
    this.setState({
      session,
      ready: true,
    });
  }

  handleOnSignIn(session) {
    this.setState({ session });
  }

  handleOnSignUp() { }

  handleOnSignOut() {
    Auth.signOut();
    this.setState({ session: null });
  }

  render() {
    const { ready, session } = this.state;
    const {
      onSignIn,
      onSignUp,
      doSignOut,
      // ...otherProps
    } = this.props;
    return (
      <RootNavigator
        ref={(nav) => {
          this.navigator = nav;
        }}
        navigation={this.props.navigation}
        screenProps={{
          session,
          onSignIn: onSignIn || this.handleOnSignIn,
          onSignUp: onSignUp || this.handleOnSignUp,
          doSignOut: doSignOut || this.handleOnSignOut,
          auth: Auth,
        }}
      />
    );
  }
}

App.router = RootNavigator.router;
