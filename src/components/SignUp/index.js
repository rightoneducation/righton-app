import React from 'react';
import {
  Keyboard,
  View,
  Text,
  TextInput,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';
import SelectionModal from '../SelectionModal';  
import MFAPrompt from '../../../lib/Categories/Auth/Components/MFAPrompt';
import { Auth } from 'aws-amplify';
import Constants from '../../utils/constants';
import { colors } from '../../utils/theme';
import styles from '../SignIn/styles';
import Birthdate from '../Birthdate';
import ButtonRoundMain from '../ButtonRoundMain';

class SignUp extends React.Component {
  static navigationOptions = {
    title: Constants.APP_NAME,
  }
  constructor(props) {
    super(props);

    this.state = {
      showMFAPrompt: false,
      username: '',
      password: '',
      email: '',
      countryCode: '+1',
      phoneNumber: '',
      errorMessage: '',
      selectionModal: false,
    };

    this.baseState = this.state;

    this.handleBirthdateNavigation = this.handleBirthdateNavigation.bind(this);
    this.handleCodeSelection = this.handleCodeSelection.bind(this);
    this.handleSelectionModal = this.handleSelectionModal.bind(this);
    this.handleNumberBlur = this.handleNumberBlur.bind(this);
    this.handleNumberInput = this.handleNumberInput.bind(this);
    this.handleNumberRef = this.handleNumberRef.bind(this);
    this.handleNumberSubmit = this.handleNumberSubmit.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleMFAValidate = this.handleMFAValidate.bind(this);
    this.handleMFASuccess = this.handleMFASuccess.bind(this);
    this.handleMFACancel = this.handleMFACancel.bind(this);
  }



  async handleSignUp() {
    const { username, password, email, phoneNumber } = this.state;
    let userConfirmed = true;

    Auth.signUp(username, password, email, phoneNumber)
      .then(data => {
        userConfirmed = data.userConfirmed;

        this.setState({ showMFAPrompt: !userConfirmed });

        if (userConfirmed) {
          this.onSignUp();
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ errorMessage: err.message });
        return;
      });
  }



  async handleMFAValidate(code = '') {
    try {
      await Auth.confirmSignUp(this.state.username, code)
        .then(data => console.log('sign up successful ->', data));
    } catch (exception) {
      return exception.message || exception;
    }

    return true;
  }



  handleMFACancel() {
    this.setState({ showMFAPrompt: false })
  }



  handleMFASuccess() {
    this.setState({ showMFAPrompt: false });
    
    this.onSignUp();
  }



  onSignUp() {
    this.setState(this.baseState);

    this.props.onSignUp();
  }



  checkPhonePattern = (number = '') => {
    // Prevent including any non-numeric values except '-' and whitespace
    return /^[0-9\-\s]*$/.test(number);
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

    const isValidPhone = this.checkPhonePattern(number);
    if (!isValidPhone) {
      // TODO Handle throwing message to human
      return;
    }

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



  handleBirthdateNavigation() {
    const { phoneNumber } = this.state;
    const isValidPhone = this.checkPhonePattern(phoneNumber);
    if (phoneNumber && isValidPhone) {
      this.props.navigation.navigate('Birthdate', { phoneNumber });
    } else {
      // TODO Throw message to human
    }
  }
  


  render() {
    const { 
      countryCode,
      phoneNumber,
      selectionModal,
    } = this.state;

    return (
      <View style={styles.bla}>
        <SelectionModal
          items={[ {label: 'United States', label_2: '+1', value: '+1'}, {label: 'New Zealand', label_2: '+64', value: '+64'} ]}
          handleClose={this.handleSelectionModal}
          onSelect={this.handleCodeSelection}
          title={'Country code'}
          visible={selectionModal}
        />
        <View style={styles.formContainer}>
          <Text style={styles.titleSub}>Setup Account</Text>
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
          <ButtonRoundMain
            icon={'arrow-right'}
            onPress={this.handleBirthdateNavigation}
          />
          {
            this.state.showMFAPrompt &&
            <MFAPrompt
              onValidate={this.handleMFAValidate}
              onCancel={this.handleMFACancel}
              onSuccess={this.handleMFASuccess}
            />
          }
        </View>
      </View>
    );
  }
}

const SignUpStack = StackNavigator({
  SignUp: {
    screen: props => <SignUp {...props} onSignUp={props.screenProps.onSignUp} />,
    navigationOptions: {
      header: null,
    }
  },
  Birthdate: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;

      return <Birthdate {...screenProps} {...otherProps} onCancel={() => otherProps.navigation.goBack()} onSuccess={() => otherProps.navigation.goBack()} />;
    },
    navigationOptions: {
      header: null,
    },
  },
});

export default props => <SignUpStack screenProps={{ onSignUp: props.onSignUp }} />;
