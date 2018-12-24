import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { colors, deviceHeight, deviceWidth, elevation, fonts } from '../../utils/theme';


export default class InputModal extends React.PureComponent {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    keyboardType: PropTypes.string,
    height: PropTypes.number,
    input: PropTypes.string,
    inputLabel: PropTypes.string,
    maxLength: PropTypes.number,
    multiline: PropTypes.bool,
    placeholder: PropTypes.string,
    visible: PropTypes.bool,
    spellCheck: PropTypes.bool,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }

  static defaultProps = {
    closeModal: () => {},
    keyboardType: 'default',
    height: 45,
    input: '',
    inputLabel: '',
    maxLength: 50,
    multiline: false,
    placeholder: '',
    visible: false,
    spellCheck: false,
    width: deviceWidth - 30,
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
  }

  constructor() {
    super();

    this.state = {
      input: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputRef = this.handleInputRef.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
  }


  componentDidMount() {
    this.setInputState();
    setTimeout(() => this.inputRef.focus(), 100);
  }


  setInputState() {
    if (this.props.input) {
      this.setState({ input: this.props.input });
    }
  }


  handleInputBlur() {
    this.props.closeModal(this.state.input, this.props.inputLabel);
  }


  handleInput(val) {
    this.setState({ input: val });
  }


  handleInputRef(ref) {
    this.inputRef = ref;
  }


  handleInputSubmit() {
    this.props.closeModal(this.state.input, this.props.inputLabel);
  }


  renderTextInput() {
    const { input } = this.state;
    const {
      keyboardType,
      height,
      maxLength,
      multiline,
      placeholder,
      spellCheck,
      width,
      x,
      y,
    } = this.props;

    let yAxis = deviceHeight / 2;
    let xAxis = 15;
    let bottom;
    if (y < deviceHeight / 2) {
      yAxis = y;
    } else {
      bottom = true;
    }

    if (x < deviceWidth) {
      xAxis = x;
    }

    return (
      <View 
        style={[
          styles.inputContainer,
          elevation,
          { height, width, left: xAxis },
          bottom ? { bottom: 15 } : { top: yAxis },
        ]}
      >
        <TextInput
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          onBlur={this.handleInputBlur}
          onChangeText={this.handleInput}
          onSubmitEditing={this.handleInputSubmit}
          placeholder={placeholder}
          placeholderTextColor={colors.lightGray}
          ref={this.handleInputRef}
          returnKeyType={'done'}
          spellCheck={spellCheck}
          style={[styles.input, { height, width }]}
          textAlign={'left'}
          underlineColorAndroid={colors.lightGray}
          value={input}
        />
        <Text style={styles.length}>{ maxLength - input.length }</Text>
      </View>
    );
  }


  render() {
    const {
      closeModal,
      visible,
    } = this.props;

    return (
      <Modal
        animationType={'none'}
        onRequestClose={closeModal}
        transparent
        visible={visible}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps={'always'}
        >
          {this.renderTextInput()}
        </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    flex: 1,
    opacity: 0.8,
  },
  input: {
    color: colors.dark,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 25,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderColor: colors.dark,
    borderWidth: 1,
    justifyContent: 'center',
    position: 'absolute',
  },
  length: {
    color: colors.lightGray,
    fontSize: fonts.small,
    position: 'absolute',
    right: 5,
  },
});
