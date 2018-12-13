import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  View,
  Text,
  TextInput,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Auth } from 'aws-amplify';
import Constants from '../../../utils/constants';
import { colors } from '../../../utils/theme';
import styles from '../SignIn/styles';
import ButtonRound from '../../../components/ButtonRound';

class SignUp extends React.Component {
  static navigationOptions = {
    title: Constants.APP_NAME,
  }
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      errorMessage: '',
      password: '',
      retypePassword: '',
      showActivityIndicator: false,
    };

    this.baseState = this.state;

    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);

    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handlePasswordRef = this.handlePasswordRef.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

    this.handleRetypePasswordInput = this.handleRetypePasswordInput.bind(this);
    this.handleRetypePasswordRef = this.handleRetypePasswordRef.bind(this);
    this.handleRetypePasswordSubmit = this.handleRetypePasswordSubmit.bind(this);

    this.handleSignUp = this.handleSignUp.bind(this);
  }



  async handleSignUp() {
    const { password, email } = this.state;
    let userConfirmed = true;

    this.setState({ showActivityIndicator: true });

    Auth.signUp(email, password, email, null)
      .then(data => {
        userConfirmed = data.userConfirmed;

        if (userConfirmed) {
          this.onSignUp();
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ errorMessage: err.message, showActivityIndicator: false });
        return;
      });
  }



  onSignUp() {
    this.setState(this.baseState);

    this.props.onSignUp();
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
    this.retypePasswordRef.focus();
  }



  handleRetypePasswordInput(retypePassword) {
    this.setState({ retypePassword });
  }



  handleRetypePasswordRef(ref) {
    this.retypePasswordRef = ref;
  }



  handleRetypePasswordSubmit() {
    Keyboard.dismiss();
  }



  render() {
    const { 
      email,
      password,
      retypePassword,
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
            <Text style={styles.title}>Teacher Setup</Text>
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
          <KeyboardAvoidingView
            behavior={'padding'}
            style={styles.inputContainer}
          >
            <Text style={styles.inputLabel}>Retype Password</Text>
            <TextInput
              keyboardType={'default'}
              maxLength={100}
              multiline={false}
              onChangeText={this.handleRetypePasswordInput}
              onSubmitEditing={this.handleRetypePasswordSubmit}
              placeholder={'Retype password'}
              placeholderTextColor={colors.primary} 
              ref={this.handleRetypePasswordRef}
              returnKeyType='done'
              style={styles.input} 
              textAlign={'left'}
              underlineColorAndroid={colors.dark}   
              value={retypePassword}
            />
          </KeyboardAvoidingView>
          <ButtonRound
            icon={'arrow-right'}
            onPress={() => {}}
          />
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



});

export default props => <SignUpStack screenProps={{ onSignUp: props.onSignUp }} />;
