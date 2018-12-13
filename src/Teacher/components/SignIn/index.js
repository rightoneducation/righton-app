import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { StackNavigator } from 'react-navigation';
import ButtonRound from '../../../components/ButtonRound';
import { colors } from '../../../utils/theme';
import styles from './styles';
import debug from '../../../utils/debug';


class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonActivity: false,
      showActivityIndicator: false,
      email: '',
      password: '',
      errorMessage: '',
      cognitoUser: '',
    };

    this.baseState = this.state;

    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);

    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handlePasswordRef = this.handlePasswordRef.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

    this.doLogin = this.doLogin.bind(this);
    this.onLogIn = this.onLogIn.bind(this);
    this.handleLogInClick = this.handleLogInClick.bind(this);
  }



  async onLogIn() {
    this.setState(this.baseState);

    this.props.onLogIn();
  }



  async doLogin() {
    const { auth } = this.props;
    const { email, password } = this.state;
    let errorMessage = '';
    let session = null;

    this.setState({ buttonActivity: true });

    try {
      session = await auth.signIn(email, password)
        .then((data) => {
          debug.log('We get the Cognito User', JSON.stringify(data));
          this.setState({ cognitoUser: data });
          return true;
        });
    } catch (exception) {
      debug.warn('Error caught in Teacher LogIn:', JSON.stringify(exception));
      errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
    }

    this.setState({
      buttonActivity: false,
      errorMessage,
      session,
      showActivityIndicator: false,
    }, () => {
      if (session) {
        this.onLogIn();
      }
    });
  }



  handleLogInClick() {
    this.setState({ showActivityIndicator: true });

    setTimeout(this.doLogin, 0);
  }



  handleEmailInput(email) {
    this.setState({ email });
  }



  handleEmailSubmit() {
    this.passwordRef.focus();
    Keyboard.dismiss();
  }



  handlePasswordInput(password) {
    this.setState({ password });
  }



  handlePasswordRef(ref) {
    this.passwordRef = ref;
  }



  handlePasswordSubmit() {
    Keyboard.dismiss();
  }



  render() {
    const {
      buttonActivity,
      password,
      showActivityIndicator,
      email,
    } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          visible={showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
          />
        </Modal>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.italic]}>RightOn!</Text>
            <Text style={styles.title}>Teacher Account</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your email address</Text>
            <TextInput
              keyboardType={'email-address'}
              maxLength={100}
              multiline={false}
              onChangeText={this.handleEmailInput}
              onSubmitEditing={this.handleEmailSubmit}
              placeholder={'Email address'}
              placeholderTextColor={colors.primary} 
              returnKeyType='done'
              style={styles.input} 
              textAlign={'left'}
              underlineColorAndroid={colors.dark}   
              value={email}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              keyboardType={'default'}
              maxLength={100}
              multiline={false}
              onChangeText={this.handlePasswordInput}
              onSubmitEditing={this.handlePasswordSubmit}
              placeholder={'Password'}
              placeholderTextColor={colors.primary} 
              ref={this.handlePasswordRef}
              returnKeyType='done'
              style={styles.input} 
              textAlign={'left'}
              underlineColorAndroid={colors.dark}   
              value={password}
            />
          </View>
          <ButtonRound
            activity={buttonActivity}
            icon={'arrow-right'}
            onPress={this.doLogin}
          />
        </View>
      </View>
    );
  }

}

const SignInStack = (StackNavigator({
  SignIn: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return <SignIn {...screenProps} {...otherProps} />;
    },
    navigationOptions: {
      header: null,
    },
  },
}, { mode: 'modal' }));

export default props => <SignInStack screenProps={{ ...props }} />;
