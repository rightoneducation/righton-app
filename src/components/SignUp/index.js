import React from 'react';
import {
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
import styles from '../LogIn/styles';
import Birthdate from '../Birthdate';

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

    this.handleCodeSelection = this.handleCodeSelection.bind(this);
    this.handleSelectionModal = this.handleSelectionModal.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleMFAValidate = this.handleMFAValidate.bind(this);
    this.handleMFASuccess = this.handleMFASuccess.bind(this);
    this.handleMFACancel = this.handleMFACancel.bind(this);
    this.onPhoneSubmit = this.onPhoneSubmit.bind(this);
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



  checkPhonePattern = (phone) => {
    return /\+[1-9]\d{1,14}$/.test(phone);
  }



  onPhoneSubmit(event) {
    const isValidPhone = this.checkPhonePattern(event.nativeEvent.text);

    this.setState({ errorMessage: !isValidPhone && 'Please enter a phone number with the format +(countrycode)(number) such as +12223334444' });
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
              underlineColorAndroid={colors.black}
              value={phoneNumber}
            />
          </View>
          {this.state.showMFAPrompt &&
            <MFAPrompt
              onValidate={this.handleMFAValidate}
              onCancel={this.handleMFACancel}
              onSuccess={this.handleMFASuccess}
            />}
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
