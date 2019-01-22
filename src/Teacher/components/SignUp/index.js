import React from 'react';
import {
  findNodeHandle,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import NativeMethodsMixin from 'NativeMethodsMixin';
import Touchable from 'react-native-platform-touchable';
import InputModal from '../../../components/InputModal';
import { Auth } from 'aws-amplify';
import MFAPrompt from '../../../../lib/Categories/Auth/Components/MFAPrompt';
import ButtonRound from '../../../components/ButtonRound';
import Message from '../../../components/Message';
import Constants from '../../../utils/constants';
import debug from '../../../utils/debug';
import { colors, deviceWidth, elevation, fonts } from '../../../utils/theme';
import styles from '../LogIn/styles';

class SignUp extends React.Component {
  static navigationOptions = {
    title: Constants.APP_NAME,
  }

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    onSignUp: PropTypes.func,
  };

  static defaultProps = {
    navigation: {
      navigate: () => {},
    },
    onSignUp: () => {},
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
      showInput: null,
      showMFAPrompt: false,
    };

    this.baseState = this.state;

    this.emailRef = null;
    this.passwordRef = null;
    this.retypeRef = null;
    this.handleEmailRef = this.handleEmailRef.bind(this);
    this.handlePasswordRef = this.handlePasswordRef.bind(this);
    this.handleRetypeRef = this.handleRetypeRef.bind(this);
    this.onEmailLayout = this.onEmailLayout.bind(this);
    this.onPasswordLayout = this.onPasswordLayout.bind(this);
    this.onRetypeLayout = this.onRetypeLayout.bind(this);

    this.closeInputModal = this.closeInputModal.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);
    
    this.handleCloseMessage = this.handleCloseMessage.bind(this);

    this.handleMFAValidate = this.handleMFAValidate.bind(this);
    this.handleMFASuccess = this.handleMFASuccess.bind(this);
    this.handleMFACancel = this.handleMFACancel.bind(this);

    this.handleSignUp = this.handleSignUp.bind(this);
  }


  onEmailLayout() {
    if (this.emailRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.emailRef),
        (x, y) => {
          this.emailX = x;
          this.emailY = y + 9 + fonts.small;
        }
      );
    }
  }


  onPasswordLayout() {
    if (this.passwordRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.passwordRef),
        (x, y) => {
          this.passwordX = x;
          this.passwordY = y + 9 + fonts.small;
        }
      );
    }
  }


  onRetypeLayout() {
    if (this.retypeRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.retypeRef),
        (x, y) => {
          this.retypeX = x;
          this.retypeY = y + 9 + fonts.small;
        }
      );
    }
  }


  onSignUp() {
    // this.setState(this.baseState);

    this.props.navigation.navigate('TeacherApp');    
  }

  async handleSignUp() {
    this.setState({ buttonActivity: true });
    const allReqsPass = this.checkRequirements();
    if (!allReqsPass) {
      this.setState({ buttonActivity: false });
      return;
    }

    const { password, email } = this.state;
    let userConfirmed = true;

    debug.log('Attempting sign up w/ email & password:', email, password);


    const username = email.toLowerCase();

    Auth.signUp(username, password, username, null)
      .then((data) => {
        userConfirmed = data.userConfirmed;

        debug.log('Sign up data received:', JSON.stringify(data));
        this.setState({ showMFAPrompt: !userConfirmed });

        if (userConfirmed) {
          this.onSignUp();
        }
      })
      .catch((exception) => {
        if (exception.message === 'User is already confirmed') {
          this.setState({
            buttonActivity: false,
            messageProps: {
              closeFunc: this.handleCloseMessage,
              bodyStyle: null,
              textStyle: null,
              duration: null,
              message: 'This email already exists.',
              timeout: 4000,
            },
            showMFAPrompt: false,
          });
          return;
        }
        if (exception.code === 'UsernameExistsException') {
          Auth.resendSignUp(username)
            .catch((err) => {
              if (err.message === 'User is already confirmed.') {
                this.setState({
                  buttonActivity: false,
                  messageProps: {
                    closeFunc: this.handleCloseMessage,
                    bodyStyle: null,
                    textStyle: null,
                    duration: null,
                    message: 'An account with that email already exists.',
                    timeout: 8000,
                  },
                });
              }
            });

          this.setState({
            buttonActivity: false,
            messageProps: {
              closeFunc: this.handleCloseMessage,
              bodyStyle: null,
              textStyle: null,
              duration: null,
              message: 'Please verify email account with verification code.',
              timeout: 4000,
            },
          }, () => {
            setTimeout(() => {
              if (this.state.messageProps.message === 'Please verify email account with verification code.') {
                // Only display prompt is the exception above was not caught
                this.setState({ showMFAPrompt: true });
              }
            }, 3500);
          });
          return;
        }

        const errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
        debug.warn('Sign up exception:', JSON.stringify(exception));
        this.setState({
          buttonActivity: false,
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


  handleEmailRef(ref) {
    this.emailRef = ref;
  }

  
  handlePasswordRef(ref) {
    this.passwordRef = ref;
  }


  handleRetypeRef(ref) {
    this.retypeRef = ref;
  }


  checkRequirements() {
    const emailPassed = this.handleEmailSubmit();
    if (!emailPassed) return false;
    const passwordPassed = this.handlePasswordSubmit();
    if (!passwordPassed) return false;
    const retypePassed = this.handleRetypePasswordSubmit();
    if (!retypePassed) return false;
    return true;
  }


  async handleMFAValidate(code = '') {
    const { email } = this.state;
    const username = email.toLowerCase();
    try {
      await Auth.confirmSignUp(username, code)
        .then((data) => {
          this.props.onSignUp('teacher', username);
          debug.log('sign up successful ->', JSON.stringify(data));
        });
    } catch (exception) {
      const errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
      this.setState({
        buttonActivity: false,
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
    this.setState({ buttonActivity: false, showMFAPrompt: false });
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


  closeInputModal(input, inputLabel) {
    switch (inputLabel) {
      case 'email': {
        this.setState({ email: input, showInput: false }, () => {
          const emailPassed = this.handleEmailSubmit();
  
          if (input && emailPassed && !this.state.password) {
            this.handleInputModal('password', 'Password', 75, '');
          }
        });
        break;
      }
      case 'password': {
        this.setState({ password: input, showInput: false }, () => {
          const passwordPassed = this.handlePasswordSubmit();
  
          if (input && passwordPassed && !this.state.retypePassword) {
            this.handleInputModal('retype', 'Retype password', 75, '');
          }
        });
        break;
      }
      case 'retype': {
        this.setState({ retypePassword: input, showInput: false }, () => {
          this.checkRequirements();
        });
        break;
      }
      default:
        break;
    }
  }


  handleInputModal(inputLabel, placeholder, maxLength, input, keyboardType = 'default') {
    if (inputLabel === 'email') {
      this.onEmailLayout();
    } else if (inputLabel === 'password') {
      this.onPasswordLayout();
    } else if (inputLabel === 'retype') {
      this.onRetypeLayout();
    }

    setTimeout(() => {
      this.setState({
        showInput: {
          backgroundColor: colors.dark,
          closeModal: this.closeInputModal,
          keyboardType,
          height: 45,
          input,
          inputLabel,
          maxLength,
          multiline: false,
          placeholder,
          visible: true,
          spellCheck: true,
          width: deviceWidth - 30,
          x: this[`${inputLabel}X`],
          y: this[`${inputLabel}Y`],
        }
      });
    }, 100);
  }


  handleEmailInput(email) {
    this.setState({ email });
  }


  handleEmailBlur() {
    this.handleEmailSubmit();
  }


  handleEmailSubmit() {
    const { email } = this.state;
    if (!email.includes('@') || !email.includes('.')) {
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
    return true;
  }


  handlePasswordSubmit() {
    const { password } = this.state;
    if (password.length < 8) {
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
      return false;
    }
    return true;
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
      return false;
    }
    return true;
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
      // passwordFocused,
      retypePassword,
      showInput,
      showMFAPrompt,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.italic]}>RightOn!</Text>
            <Text style={styles.title}>Teacher Setup</Text>
          </View>

          {showInput &&
          <InputModal {...showInput} />}

          <View
            onLayout={this.onEmailLayout}
            ref={this.handleEmailRef}
            style={styles.inputContainer}
          >
            <Text style={styles.inputLabel}>Your email address</Text>
            <Touchable
              onPress={() => this.handleInputModal('email', 'Email address', 75, email, 'email-address')}
              style={[styles.inputButton, elevation]}
            >
              <Text style={[styles.inputButtonText, !email && styles.inputPlaceholder]}>{showInput && showInput.inputLabel === 'email' ? '' : (email || 'Email address')}</Text>
            </Touchable>
          </View>
          
          <View
            onLayout={this.onPasswordLayout}
            ref={this.handlePasswordRef}
            style={styles.inputContainer}
          >
            <Text style={styles.inputLabel}>Password</Text>
            <Touchable
              onPress={() => this.handleInputModal('password', 'Password', 75, password)}
              style={[styles.inputButton, elevation]}
            >
              <Text style={[styles.inputButtonText, !password && styles.inputPlaceholder]}>{showInput && showInput.inputLabel === 'password' ? '' : (password || 'Password')}</Text>
            </Touchable>
          </View>

          <View
            onLayout={this.onRetypeLayout}
            ref={this.handleRetypeRef}
            style={styles.inputContainer}
          >
            <Text style={styles.inputLabel}>Retype password</Text>
            <Touchable
              onPress={() => this.handleInputModal('retype', 'Retype password', 75, retypePassword)}
              style={[styles.inputButton, elevation]}
            >
              <Text style={[styles.inputButtonText, !password && styles.inputPlaceholder]}>{showInput && showInput.inputLabel === 'retype' ? '' : (retypePassword || 'Retype password')}</Text>
            </Touchable>
          </View>

          {Boolean(email) && Boolean(password) && Boolean(retypePassword) &&
            <ButtonRound
              activity={buttonActivity}
              animated
              icon={'arrow-right'}
              onPress={this.handleSignUp}
            />}

        </View>
        {
          showMFAPrompt &&
          <MFAPrompt
            navigation={this.props.navigation}
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
