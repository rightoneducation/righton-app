import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Message from '../../../components/Message';
import ButtonRound from '../../../components/ButtonRound';
import { colors } from '../../../utils/theme';
import styles from './styles';
import debug from '../../../utils/debug';


class SignIn extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  };

  static defaultProps = {
    navigation: {
      navigate: () => {},
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      buttonActivity: false,
      cognitoUser: '',
      email: '',
      messageProps: null,
      password: '',
      showActivityIndicator: false,
    };

    this.baseState = this.state;

    this.handleCloseMessage = this.handleCloseMessage.bind(this);

    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);

    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handlePasswordRef = this.handlePasswordRef.bind(this);

    this.doLogin = this.doLogin.bind(this);
    this.onLogIn = this.onLogIn.bind(this);
    this.handleLogInClick = this.handleLogInClick.bind(this);
  }


  async onLogIn() {
    this.setState(this.baseState, () => {
      this.props.navigation.navigate('TeacherApp');
    });
  }


  async doLogin() {
    this.setState({ buttonActivity: true });
    const allReqsPass = this.checkRequirements();
    if (!allReqsPass) {
      this.setState({ buttonActivity: false });
      return;
    }

    const { auth } = this.props;
    const { email, password } = this.state;
    let errorMessage = '';
    let session = null;

    const lowercaseEmail = email.toLowerCase();
    const username = lowercaseEmail.substr(0, lowercaseEmail.indexOf('@'));

    try {
      session = await auth.signIn(username, password)
        .then((data) => {
          debug.log('We get the Cognito User', JSON.stringify(data));
          this.setState({ cognitoUser: data });
          return true;
        });
    } catch (exception) {
      debug.warn('Error caught in Teacher LogIn:', JSON.stringify(exception));
      // TODO Message telling username already exists
      // if (exception.code = "UserNotConfirmedException") {

      // }
      // if (exception.code = "UserNotFoundException") {

      // }

      errorMessage = exception.invalidCredentialsMessage || exception.message || exception;

      if (exception === 'Username cannot be empty') {
        errorMessage = 'Email must be provided.';
      }
    }
    this.setState({
      buttonActivity: false,
      session,
      showActivityIndicator: false,
      messageProps: {
        closeFunc: this.handleCloseMessage,
        bodyStyle: null,
        textStyle: null,
        duration: null,
        message: errorMessage,
        timeout: 4000,
      },
    }, () => {
      if (session) {
        this.onLogIn();
      }
    });
  }


  checkRequirements() {
    const { email, password } = this.state;

    if (!email.includes('@') && !email.includes('.')) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Enter valid email address.',
          timeout: null,
        },
      });
      return false;
    }
    if (password.length < 8 || !/[0-9]/.test(password)) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Password is incorrect. Please retype.',
          timeout: null,
        },
      });
      return false;
    }

    return true;
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
    this.doLogin();
  }


  handleCloseMessage() {
    this.setState({ messageProps: null });
  }


  render() {
    const {
      buttonActivity,
      email,
      messageProps,
      password,
      showActivityIndicator,
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
              returnKeyType={'done'}
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
              returnKeyType={'done'}
              style={styles.input}
              textAlign={'left'}
              underlineColorAndroid={colors.dark}
              value={password}
            />
          </View>
          <ButtonRound
            activity={buttonActivity}
            animated
            icon={'arrow-right'}
            onPress={this.doLogin}
          />
        </View>

        { messageProps && <Message {...messageProps} /> }

      </View>
    );
  }
}


export default SignIn;
