import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import MFAPrompt from '../../../../lib/Categories/Auth/Components/MFAPrompt';
import ButtonRound from '../../../components/ButtonRound';
import Message from '../../../components/Message';
import Constants from '../../../utils/constants';
import debug from '../../../utils/debug';
import { colors } from '../../../utils/theme';
import styles from '../SignIn/styles';

class SignUp extends React.Component {
  static navigationOptions = {
    title: Constants.APP_NAME,
  }

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
      email: '',
      messageProps: null,
      password: '',
      passwordFocused: false,
      retypePassword: '',
      showActivityIndicator: false,
      showMFAPrompt: false,
    };

    this.baseState = this.state;

    this.closeActvitiyModal = this.closeActvitiyModal.bind(this);
    this.handleCloseMessage = this.handleCloseMessage.bind(this);

    this.handleEmailBlur = this.handleEmailBlur.bind(this);
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);

    this.handlePasswordBlur = this.handlePasswordBlur.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handlePasswordRef = this.handlePasswordRef.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

    this.handleRetypePasswordBlur = this.handleRetypePasswordBlur.bind(this);
    this.handleRetypePasswordInput = this.handleRetypePasswordInput.bind(this);
    this.handleRetypePasswordRef = this.handleRetypePasswordRef.bind(this);
    this.handleRetypePasswordSubmit = this.handleRetypePasswordSubmit.bind(this);

    this.handleMFAValidate = this.handleMFAValidate.bind(this);
    this.handleMFASuccess = this.handleMFASuccess.bind(this);
    this.handleMFACancel = this.handleMFACancel.bind(this);

    this.handleSignUp = this.handleSignUp.bind(this);
  }


  onSignUp() {
    this.setState(this.baseState);

    this.props.navigation.navigate('TeacherApp');    
  }

  async handleSignUp() {
    this.setState({ buttonActivity: true });
    const allReqsPass = this.checkRequirements();
    if (!allReqsPass) {
      this.setState({ buttonActivity: false });
      return;
    }

    Keyboard.dismiss();

    const { password, email } = this.state;
    let userConfirmed = true;

    this.setState({ buttonActivity: true, showActivityIndicator: true });

    debug.log('Attempting sign up w/ email & password:', email, password);


    const lowercaseEmail = email.toLowerCase();
    const username = lowercaseEmail.substr(0, lowercaseEmail.indexOf('@'));

    Auth.signUp(username, password, lowercaseEmail, null)
      .then((data) => {
        userConfirmed = data.userConfirmed;

        debug.log('Sign up data received:', JSON.stringify(data));
        this.setState({ showMFAPrompt: !userConfirmed, showActivityIndicator: false });

        if (userConfirmed) {
          this.onSignUp();
        }
      })
      .catch((exception) => {
        const errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
        debug.warn('Sign up exception:', JSON.stringify(exception));
        this.setState({
          buttonActivity: false,
          showActivityIndicator: false,
          messageProps: {
            closeFunc: this.handleCloseMessage,
            bodyStyle: null,
            textStyle: null,
            duration: null,
            message: errorMessage,
            timeout: null,
          },
        });
      });
  }


  checkRequirements() {
    const { email, password, retypePassword } = this.state;
    if (!email.includes('@') && !email.includes('.')) {
      this.handleEmailSubmit();
      return false;
    }
    if (password.length < 8 || !/[0-9]/.test(password)) {
      this.handlePasswordSubmit();
      return false;
    }

    if (password !== retypePassword) {
      this.handleRetypePasswordSubmit();
      return false;
    }
    return true;
  }


  async handleMFAValidate(code = '') {
    const { email } = this.state;
    const lowercaseEmail = email.toLowerCase();
    const username = lowercaseEmail.substr(0, lowercaseEmail.indexOf('@'));
    try {
      await Auth.confirmSignUp(username, code)
        .then(data => debug.log('sign up successful ->', JSON.stringify(data)));
    } catch (exception) {
      const errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
      this.setState({
        buttonActivity: false,
        showActivityIndicator: false,
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: errorMessage,
          timeout: 4000,
        },
      });
      return exception.message || exception;
    }
    return true;
  }


  handleMFACancel() {
    this.setState({ buttonActivity: false, showMFAPrompt: false, showActivityIndicator: false });
  }


  handleMFASuccess() {
    this.setState({
      showMFAPrompt: false,
      messageProps: {
        closeFunc: this.handleCloseMessage,
        bodyStyle: null,
        textStyle: null,
        duration: null,
        message: 'Sign up successful!',
        timeout: null,
      },
    }, () => this.onSignUp());
  }


  handleEmailInput(email) {
    this.setState({ email });
  }


  handleEmailBlur() {
    this.handleEmailSubmit();
  }


  handleEmailSubmit() {
    const { email } = this.state;
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
      return;
    }

    this.passwordRef.focus();
  }


  handlePasswordBlur() {
    this.setState({ passwordFocused: false });
    this.handlePasswordSubmit();
  }


  handlePasswordFocus() {
    this.setState({ passwordFocused: true });
  }


  handlePasswordInput(password) {
    this.setState({ password });
  }


  handlePasswordRef(ref) {
    this.passwordRef = ref;
  }


  handlePasswordSubmit() {
    const { password } = this.state;
    if (!/[0-9]/.test(password)) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Password must contain at least 1 number.',
          timeout: null,
        },
      });
    } else if (password.length < 8) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Password must be 8 characters minimum.',
          timeout: null,
        },
      });
    }
    this.retypePasswordRef.focus();
  }


  handleRetypePasswordBlur() {
    this.handleRetypePasswordSubmit();
  }


  handleRetypePasswordInput(retypePassword) {
    this.setState({ retypePassword });
  }


  handleRetypePasswordRef(ref) {
    this.retypePasswordRef = ref;
  }


  handleRetypePasswordSubmit() {
    const { password, retypePassword } = this.state;
    if (password !== retypePassword) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Passwords do not match.',
          timeout: 4000,
        },
      });
    }
  }


  closeActvitiyModal() {
    this.setState({ showActivityIndicator: false });
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
      passwordFocused,
      retypePassword,
      showActivityIndicator,
      showMFAPrompt,
    } = this.state;

    return (
      <View style={styles.container}>
        <Modal
          visible={showActivityIndicator}
          onRequestClose={this.closeActvitiyModal}
        >
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
          />
        </Modal>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.italic]}>RightOn!</Text>
            <Text style={styles.title}>Teacher Setup</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your email address</Text>
            <TextInput
              keyboardType={'email-address'}
              maxLength={100}
              multiline={false}
              onBlur={this.handleEmailBlur}
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
              onBlur={this.handlePasswordBlur}
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
            {
              passwordFocused &&
              <View>
                <Text style={styles.req}>Must be 8 characters minimum</Text>
                <Text style={styles.req}>Must contain 1 number</Text>
              </View>
            }
          </View>
          <KeyboardAvoidingView
            behavior={'padding'}
            style={styles.inputContainer}
          >
            <Text style={styles.inputLabel}>Retype Password</Text>
            <TextInput
              keyboardType={'default'}
              maxLength={100}
              multiline={false}
              onBlur={this.handleRetypePasswordBlur}
              onChangeText={this.handleRetypePasswordInput}
              onSubmitEditing={this.handleRetypePasswordSubmit}
              placeholder={'Retype password'}
              placeholderTextColor={colors.primary} 
              ref={this.handleRetypePasswordRef}
              returnKeyType={'done'}
              style={styles.input} 
              textAlign={'left'}
              underlineColorAndroid={colors.dark}   
              value={retypePassword}
            />
          </KeyboardAvoidingView>
          <ButtonRound
            activity={buttonActivity}
            icon={'arrow-right'}
            onPress={this.handleSignUp}
          />
        </View>
        {
          showMFAPrompt &&
          <MFAPrompt
            onValidate={this.handleMFAValidate}
            onCancel={this.handleMFACancel}
            onSuccess={this.handleMFASuccess}
          />
        }
        { messageProps && <Message {...messageProps} /> }
      </View>
    );
  }
}


export default SignUp;
