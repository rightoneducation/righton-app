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
import Message from '../../../components/Message';
import ButtonRound from '../../../components/ButtonRound';
import { deviceWidth, elevation, fonts, colors } from '../../../utils/theme';
import styles from './styles';
import debug from '../../../utils/debug';


class LogIn extends React.Component {
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
      showInput: false,
    };

    this.baseState = this.state;

    
    this.handleCloseMessage = this.handleCloseMessage.bind(this);
    
    this.emailRef = undefined;
    this.passwordRef = undefined;
    this.handleEmailRef = this.handleEmailRef.bind(this);
    this.onEmailLayout = this.onEmailLayout.bind(this);
    this.handlePasswordRef = this.handlePasswordRef.bind(this);
    this.onPasswordLayout = this.onPasswordLayout.bind(this);

    this.closeInputModal = this.closeInputModal.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);

    this.doLogin = this.doLogin.bind(this);
    this.onLogIn = this.onLogIn.bind(this);
    this.handleLogInClick = this.handleLogInClick.bind(this);
  }


  async onLogIn() {
    this.setState(this.baseState, () => {
      this.props.navigation.navigate('TeacherApp');
    });
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


  handlePasswordRef(ref) {
    this.passwordRef = ref;
  }


  handleEmailRef(ref) {
    this.emailRef = ref;
  }


  async doLogin() {
    const allReqsPass = this.checkRequirements();
    if (!allReqsPass) {
      this.setState({ buttonActivity: false });
      return;
    }

    const { auth } = this.props;
    const { email, password } = this.state;
    let errorMessage = 'Successfully logged in.';
    let session = null;

    const username = email.toLowerCase();

    try {
      session = await auth.signIn(username, password)
        .then((data) => {
          debug.log('We get the Cognito User', JSON.stringify(data));
          this.setState({ cognitoUser: data });
          return true;
        });
    } catch (exception) {
      debug.warn('Error caught in Teacher LogIn:', JSON.stringify(exception));

      errorMessage = exception.invalidCredentialsMessage || exception.message || exception;

      if (exception === 'Username cannot be empty') {
        errorMessage = 'Email must be provided.';
      } else if (exception.code === 'UserNotConfirmedException') {
        errorMessage = 'Email unconfirmed. Please sign up again.';
      } else if (exception.code === 'UserNotFoundException') {
        errorMessage = 'Email not found. Please sign up again.';
      }
    }
    this.setState({
      buttonActivity: false,
      session,
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
    if (password.length < 8) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: null,
          textStyle: null,
          duration: null,
          message: 'Password must have a minimum of 8 characters.',
          timeout: null,
        },
      });
      return false;
    }

    return true;
  }


  closeInputModal(input, inputLabel) {
    switch (inputLabel) {
      case 'email':
        this.setState({ email: input, showInput: false });
        if (!this.state.password) {
          this.handleInputModal('password', 'Password', 75, '');
        }
        break;
      case 'password':
        this.setState({ password: input, showInput: false });
        this.handleLogInClick();
        break;
      default:
        break;
    }
  }


  handleInputModal(inputLabel, placeholder, maxLength, input, keyboardType = 'default') {
    if (inputLabel === 'email') {
      this.onEmailLayout();
    } else if (inputLabel === 'password') {
      this.onPasswordLayout();
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


  handleLogInClick() {
    this.setState({ buttonActivity: true });

    setTimeout(this.doLogin, 0);
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
      showInput,
    } = this.state;

    return (
      <View style={styles.container}>

        {showInput &&
          <InputModal {...showInput} />}

        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.italic]}>RightOn!</Text>
            <Text style={styles.title}>Teacher Account</Text>
          </View>

          <View
            onLayout={this.onEmailLayout}
            ref={this.handleEmailRef}
            style={styles.inputContainer}
          >
            <Text style={styles.inputLabel}>Your email address</Text>
            <Touchable
              onPress={() => this.handleInputModal('email', 'Email address', 75, email)}
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

          {
            Boolean(email) && Boolean(password) && !showInput &&
            <ButtonRound
              activity={buttonActivity}
              animated
              icon={'arrow-right'}
              onPress={this.handleLogInClick}
            />
          }
        </View>

        { messageProps && <Message {...messageProps} /> }

      </View>
    );
  }
}


export default LogIn;
