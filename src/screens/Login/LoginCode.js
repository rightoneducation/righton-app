import React, { Component } from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import styles from './styles';
import debug from '../../utils/debug';
import { colors } from '../../utils/common';

class LoginCode extends Component {
  constructor() {
    super();
    this.focusedEdit;
    this.state = {
      code: [],
    };
    this.funcs = {
      handleCodeFocus0: () => this.handleCodeFocus(0),
      handleCodeFocus1: () => this.handleCodeFocus(1),
      handleCodeFocus2: () => this.handleCodeFocus(2),
      handleCodeFocus3: () => this.handleCodeFocus(3),
      handleCodeFocus4: () => this.handleCodeFocus(4), 
      handleCodeFocus5: () => this.handleCodeFocus(5),
      handleCodeInput0: (input) => this.handleCodeInput(input, 0),
      handleCodeInput1: (input) => this.handleCodeInput(input, 1),
      handleCodeInput2: (input) => this.handleCodeInput(input, 2),
      handleCodeInput3: (input) => this.handleCodeInput(input, 3),
      handleCodeInput4: (input) => this.handleCodeInput(input, 4), 
      handleCodeInput5: (input) => this.handleCodeInput(input, 5),
      handleCodeRef0: (ref) => this.handleCodeRef(ref, 0),
      handleCodeRef1: (ref) => this.handleCodeRef(ref, 1),
      handleCodeRef2: (ref) => this.handleCodeRef(ref, 2),
      handleCodeRef3: (ref) => this.handleCodeRef(ref, 3),
      handleCodeRef4: (ref) => this.handleCodeRef(ref, 4),
      handleCodeRef5: (ref) => this.handleCodeRef(ref, 5),
    };
    this.handleCodeInput = this.handleCodeInput.bind(this);
    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
  }

  handleCodeFocus(idx) {
    if (this.focusedEdit) {
      this.focusedEdit = false;
      return;
    }
    const { code } = this.state;
    const updatedCode = [...code];
    updatedCode[idx] = undefined;
    this.setState({ code: updatedCode}, () => {
      if (updatedCode.length === 6 && !updatedCode.includes(undefined)) {
        this.handleCodeSubmit();
      }
    });
    this.focusedEdit = true;
  }

  handleCodeInput(input, idx) {
    if (typeof parseInt(input) !== 'number') return;
    const { code } = this.state;
    const updatedCode = [...code];
    updatedCode[idx] = input;
    if (updatedCode.length === 6 && !updatedCode.includes(undefined)) {
      this.setState({ code: updatedCode }, () => {
        this.handleCodeSubmit();
      });
      Keyboard.dismiss();
    } else {
      this.setState({ code: updatedCode });
      this[`codeRef${idx + 1}`].focus();
    }
  }

  handleCodeSubmit() {
    const { code } = this.state;
    if (code.length === 6 && !code.includes(undefined)) {
      this.props.confirmResult.confirm(code)
      // TODO Pass uid to top level state and navigate to Dashboard
      .then(() => this.setState({ user: true }))
      .catch((err) => this.handleErrorSigningIn(err));
    }
  }

  handleCodeRef(ref, idx) {
    this[`codeRef${idx}`] = ref;
  }

  handleRetry() {
    this.props.setScreen('setup');
  }

  handleErrorSigningIn(err) {
    // TODO Send message to user
    debug.warn('Error signing in w/ verification code @confirmResult.confirm()', err);
  }

  componentDidMount() {
    setTimeout(() => {
      this.codeRef0.focus();
    }, 100);
  }

  render() {
    const { code } = this.state;
    return (
      <View style={styles.containerSub}>
        <Text style={styles.titleSub}>Verification Code</Text>
        <View style={styles.codeInputsContainer}>
          <TextInput
            keyboardType={'numeric'}
            maxLength={1}
            onChangeText={this.funcs['handleCodeInput0']}
            onFocus={this.funcs['handleCodeFocus0']}
            ref={this.funcs['handleCodeRef0']}
            returnKeyType='done'
            style={styles.codeInput}
            textAlign={'center'}
            underlineColorAndroid={colors.black}   
            value={code[0] !== undefined ? code[0] : ''}
          />
          <TextInput
            keyboardType={'numeric'}
            maxLength={1}
            onChangeText={this.funcs['handleCodeInput1']}
            onFocus={this.funcs['handleCodeFocus1']}
            ref={this.funcs['handleCodeRef1']}
            returnKeyType='done'
            style={styles.codeInput}
            textAlign={'center'}
            underlineColorAndroid={colors.black}   
            value={code[1] !== undefined ? code[1] : ''}
          />
          <TextInput
            keyboardType={'numeric'}
            maxLength={1}
            onChangeText={this.funcs['handleCodeInput2']}
            onFocus={this.funcs['handleCodeFocus2']}
            ref={this.funcs['handleCodeRef2']}
            returnKeyType='done'
            style={styles.codeInput}
            textAlign={'center'}
            underlineColorAndroid={colors.black}   
            value={code[2] !== undefined ? code[2] : ''}
          />
          <TextInput
            keyboardType={'numeric'}
            maxLength={1}
            onChangeText={this.funcs['handleCodeInput3']}
            onFocus={this.funcs['handleCodeFocus3']}
            ref={this.funcs['handleCodeRef3']}
            returnKeyType='done'
            style={styles.codeInput}
            textAlign={'center'}
            underlineColorAndroid={colors.black}   
            value={code[3] !== undefined ? code[3] : ''}
          />
          <TextInput
            keyboardType={'numeric'}
            maxLength={1}
            onChangeText={this.funcs['handleCodeInput4']}
            onFocus={this.funcs['handleCodeFocus4']}
            ref={this.funcs['handleCodeRef4']}
            returnKeyType='done'
            style={styles.codeInput}
            textAlign={'center'}
            underlineColorAndroid={colors.black}   
            value={code[3] !== undefined ? code[4] : ''}
          />
          <TextInput
            keyboardType={'numeric'}
            maxLength={1}
            onChangeText={this.funcs['handleCodeInput5']}
            onFocus={this.funcs['handleCodeFocus5']}
            onSubmitEditing={this.handleCodeSubmit}
            ref={this.funcs['handleCodeRef5']}
            returnKeyType='done'
            style={styles.codeInput}
            textAlign={'center'}
            underlineColorAndroid={colors.black}   
            value={code[3] !== undefined ? code[5] : ''}
          />
        </View>
        <Touchable
          activeOpacity={.8}
          background={Touchable.Ripple(colors.black, false)}
          hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
          onPress={this.handleRetry}
          style={styles.buttonRetry}
        >
          <Text style={styles.buttonText}>{`<- Resend verfication code`}</Text>
        </Touchable>
      </View>
    )
  }
}

LoginCode.propTypes = {
  confirmResult: PropTypes.object.isRequired,
  setScreen: PropTypes.func.isRequired,
};

LoginCode.defaultProps = {
  confirmResult: {},
  setScreen: function() {},
};

export default LoginCode;