import React, { PureComponent } from 'react';
import {
  AsyncStorage,
  Keyboard,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
// import firebase from 'react-native-firebase';
// import Firebase from '../../../config/firebase';
import styles from './styles';
import { colors } from '../../../utils/common';

class OnboardLoginSetup extends PureComponent {
  constructor() {
    super();
    this.unsubscribeFromAuthStateChange;
    this.state = {
      user: null,
      message: '',
      phoneNumber: '',
    }
    this.handleCodeSent = this.handleCodeSent.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleNumberInput = this.handleNumberInput.bind(this);
    this.handleNumberRef = this.handleNumberRef.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleVerificationError = this.handleVerificationError.bind(this);
  }

  handleNumberBlur() {
    this.numberRef.blur();
    Keyboard.dismiss();
  }

  handleNumberInput(number) {
    if (number.length > 1 && number[0] === '+') {
      // Number was selected from an auto-fill suggestion
      const updatedNumber = number.substr(number.indexOf(1) + 1).trim();
      this.setState({ phoneNumber: updatedNumber });
      return;
    }
    // Prevent including any non-numeric values except '-' and whitespace
    if (/^[0-9\-\s]*$/.test(number) === false) return;
    const len = number.length;
    if (number[len - 1] === '-' || (len === 4 && number[len - 1] !== ' ')) {
      if (len === 4) {
        if (number[len - 1] === '-') {
          this.setState({ number: `${number.substr(0, 3)} ` });
        } else {
          const digit = number[len - 1];
          this.setState({ phoneNumber: `${number.substr(0, 3)} ${digit}` });
        }
        return;
      } else if (len === 8) {
        // do nothing -- fall through
      } else {
        // Ignore if '-' or ' ' is entered anywhere else
        return;
      }
    } else if (number[len - 1] === ' ' || (len === 8 && number[len - 1] !== '-')) {
      if (len === 4) {
        // do nothing -- fall through          
      } else if (len === 8) {
        if (number[len - 1] === ' ') {
          this.setState({ number: `${number.substr(0, 7)}-` });
        } else {
          const digit = number[len - 1];
          this.setState({ phoneNumber: `${number.substr(0, 7)}-${digit}` });
        }
        return;
      } else {
        // Ignore if '-' or ' ' is entered anywhere else
        return;
      }
    }
    this.setState({phoneNumber: number});
  }

  handleNumberRef(ref) {
    this.numberRef = ref;
  }

  handleNumberSubmit() {
    this.numberRef.blur();
    Keyboard.dismiss();
  }

  handleLogin() {
    const { phoneNumber } = this.state;
    const parsedNumber = `+1${phoneNumber.replace(' ', '').replace('-', '')}`
    if (parsedNumber.length !== 12) {
      // TODO Check what may be wrong with the entry and notify the user of the mistake
      debug.log('Number is not a length of 12:', parsedNumber);
      return;
    }
    Keyboard.dismiss();
    if (Platform.OS === 'ios') {
      Firebase.signInWithPhoneNumber(parsedNumber, this.props.passConfirmResultContext, this.handleVerificationError);
    } else {
      Firebase.verifyPhoneNumber(parsedNumber, this.handleVerificationError, this.handleCodeSent, this.handleAndroidVerificationTimeout, this.handleAndroidAutoVerification, this.handleSaveAuthCredential);
    }
    this.handleCodeSent();
  }

  handleSignUp() {
    const { phoneNumber } = this.state;
    const parsedNumber = `+1${phoneNumber.replace(' ', '').replace('-', '')}`
    if (parsedNumber.length !== 12) {
      // TODO Display error message for number
      debug.log('Number is not a length of 12:', parsedNumber);
      return;
    }
    Keyboard.dismiss();
    if (Platform.OS === 'ios') {
      Firebase.signInWithPhoneNumber(parsedNumber, this.props.passConfirmResultContext, this.handleVerificationError);
    } else {
      Firebase.verifyPhoneNumber(parsedNumber, this.handleVerificationError, this.handleCodeSent, this.handleAndroidVerificationTimeout, this.handleAndroidAutoVerification, this.handleSaveAuthCredential);
    }
    this.handleCodeSent();
  }

  handleVerificationError(err) {
    debug.warn('OnboardLoginSetup phone verification error:', err);
    // TODO Display message to user about what went wrong
  }

  handleCodeSent() {
    this.props.setScreen('code');
  }

  handleAndroidVerificationTimeout() {
    // How to handle?
    debug.log('Android auto verification TIMEOUT')
  }

  handleAndroidAutoVerification() {
    // Verified
    // TODO Route human to Dashboard
    debug.log('Android auto verification SUCCESS')
  }

  handleSaveAuthCredential(credential) {
    AsyncStorage.setItem('@RightOnEducation:FirebaseCredential', JSON.stringify(credential));
    this.setState({ user: true });
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      // Access `firebase` module of `react-native-firebase` for event listener on Android
      // `user` only returns either `null` or an stringified object w/ auth data
      // - includes values such as lastSignInTime, creationTime, phoneNumber, providerId, uid, etc
      this.unsubscribeFromAuthStateChange = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          debug.log('Auth state changed!', JSON.stringify(user.toJSON()));
          // this.setState({ user: user.toJSON() });
          // TODO Set uid to top level state for faster future access
          this.setState({ user: true });
        } else {
          // User has been signed out, reset the state
          this.setState({
            user: null,
            message: '',
            phoneNumber: '',
          });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeFromAuthStateChange) this.unsubscribeFromAuthStateChange();
  }

  render() {
    const { phoneNumber } = this.state;

    return (
      <View style={styles.containerSub}>
        <Text style={styles.titleSub}>Setup Account</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+1</Text>
          <TextInput
            keyboardType={'numeric'}
            maxLength={12}
            multiline={false}
            onBlur={this.handleNumberBlur}
            onChangeText={this.handleNumberInput}
            onSubmitEditing={this.handleNumberSubmit}
            placeholder={'Phone number'}
            placeholderTextColor={colors.white} 
            ref={this.handleNumberRef}
            returnKeyType='done'
            style={styles.numberInput} 
            textAlign={'left'}
            underlineColorAndroid={colors.black}   
            value={phoneNumber}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <Touchable
            activeOpacity={.8}
            background={Touchable.Ripple(colors.black, false)}
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            onPress={this.handleSignUp}
            style={styles.button}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </Touchable>
          <Touchable
            activeOpacity={.8}
            background={Touchable.Ripple(colors.black, false)}
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            onPress={this.handleLogin}
            style={styles.button}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </Touchable>
        </View>
      </View>
    )
  }
}

OnboardLoginSetup.propTypes = {
  passConfirmResultContext: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
};

OnboardLoginSetup.defaultProps = {
  passConfirmResultContext: function() {},
  setScreen: function() {},
};

export default OnboardLoginSetup;