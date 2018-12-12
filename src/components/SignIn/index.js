import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';
import SelectonModal from '../SelectionModal';
import MFAPrompt from '../../../lib/Categories/Auth/Components/MFAPrompt';
import { colors } from '../../utils/theme';
import styles from './styles';

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showActivityIndicator: false,
      // username: '',
      // password: '',
      countryCode: '+1',
      phonenumber: '',
      showMFAPrompt: false,
      errorMessage: '',
      cognitoUser: '',
      selectionModal: false,
    };

    this.baseState = this.state;

    this.handleCodeSelection = this.handleCodeSelection.bind(this);
    this.handleSelectionModal = this.handleSelectionModal.bind(this);
    this.handleLogInClick = this.handleLogInClick.bind(this);
    this.handleMFAValidate = this.handleMFAValidate.bind(this);
    this.handleMFACancel = this.handleMFACancel.bind(this);
    this.handleMFASuccess = this.handleMFASuccess.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.onLogIn = this.onLogIn.bind(this);
  }

  async onLogIn() {
    this.setState(this.baseState);

    this.props.onLogIn();
  }

  async doLogin() {
    const { auth } = this.props;
    const { username, password } = this.state;
    let errorMessage = '';
    let showMFAPrompt = false;
    let session = null;

    try {
      session = await auth.signIn(username, password)
        .then((data) => {
          console.log('We get the Cognito User', data),
            this.setState({ cognitoUser: data }),
            showMFAPrompt = true;
          console.log('login mfaRequired');
        });
    } catch (exception) {
      console.log(exception);
      errorMessage = exception.invalidCredentialsMessage || exception.message || exception;
    }

    this.setState({
      showMFAPrompt,
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

  async handleMFAValidate(code = '') {
    const { auth } = this.props;

    try {
      let session = null;
      await auth.confirmSignIn(this.state.cognitoUser, code)
        .then(async () => {
          session = await auth.currentSession();
          this.setState({ session });
        });
    } catch (exception) {
      return exception.message;
    }

    return true;
  }

  handleMFACancel() {
    this.setState({ showMFAPrompt: false });
  }

  handleMFASuccess() {
    this.setState({
      showMFAPrompt: false,
    }, () => {
      this.onLogIn();
    });
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

    if (this.state.countryCode === '+1') { 
      // Handle prettifying the phone number view for US numbers
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


  handleCodeSelection(value) {
    this.setState({ countryCode: value, selectionModal: false });
  }



  handleSelectionModal() {
    this.setState({ selectionModal: !this.state.selectionModal });
  }
  

  render() {
    const {
      countryCode,
      phoneNumber,
      selectionModal,
      showActivityIndicator,
      showMFAPrompt,
    } = this.state;

    return (
      <View style={styles.bla}>
        {
          showMFAPrompt &&
          <MFAPrompt
            onValidate={this.handleMFAValidate}
            onCancel={this.handleMFACancel}
            onSuccess={this.handleMFASuccess}
          />
        }
        <Modal
          visible={showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
          />
        </Modal>
        <SelectonModal
          items={[ {label: 'United States', label_2: '+1', value: '+1'}, {label: 'New Zealand', label_2: '+64', value: '+64'} ]}
          handleClose={this.handleSelectionModal}
          onSelect={this.handleCodeSelection}
          title={'Country code'}
          visible={selectionModal}
        />
        <View style={styles.formContainer}>
          <Text style={styles.titleSub}>RightOn Account</Text>
          <View style={styles.inputContainer}>
            <Touchable
              activeOpacity={.8}
              hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
              onPress={this.handleSelectionModal}
            >
              <Text style={styles.countryCode}>{ countryCode }</Text>
            </Touchable>
            <TextInput
              keyboardType={'numeric'}
              maxLength={12}
              multiline={false}
              onBlur={this.handleNumberBlur}
              onChangeText={this.handleNumberInput}
              onSubmitEditing={this.handleNumberSubmit}
              placeholder={'Your phone number'}
              placeholderTextColor={colors.white} 
              ref={this.handleNumberRef}
              returnKeyType='done'
              style={styles.numberInput} 
              textAlign={'left'}
              underlineColorAndroid={colors.dark}   
              value={phoneNumber}
            />
          </View>
        </View>
      </View>
    );
  }

}

const LogInStack = (StackNavigator({
  LogIn: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return <LogIn {...screenProps} {...otherProps} />;
    },
    navigationOptions: {
      header: null,
    },
  },
}, { mode: 'modal' }));

export default props => <LogInStack screenProps={{ ...props }} />;
