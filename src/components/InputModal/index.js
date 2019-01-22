import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { scale, ScaledSheet, verticalScale } from 'react-native-size-matters';
import { colors, deviceHeight, deviceWidth, elevation, fonts } from '../../utils/theme';


export default class InputModal extends React.PureComponent {
  static propTypes = {
    autoCapitalize: PropTypes.string,
    autoCorrect: PropTypes.bool,
    backgroundColor: PropTypes.string,
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
    autoCapitalize: 'none',
    autoCorrect: false,
    backgroundColor: colors.lightGray,
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
    width: deviceWidth - scale(30),
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
  }

  constructor(props) {
    super(props);

    this.state = {
      input: props.input || '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputRef = this.handleInputRef.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
  }


  componentDidMount() {
    setTimeout(() => this.inputRef.focus(), 100);
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
      autoCapitalize,
      autoCorrect,
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
    let xAxis = scale(15);
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
          { height: verticalScale(height), width, left: xAxis },
          bottom ? { bottom: 15 } : { top: yAxis },
        ]}
      >
        <AutoGrowingTextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
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
          underlineColorAndroid={colors.white}
          value={input}
        />
        <Text style={styles.length}>{ maxLength - input.length }</Text>
      </View>
    );
  }


  render() {
    const {
      backgroundColor,
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
        <View style={[styles.container, { backgroundColor }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.handleInputSubmit}
            style={styles.closeContainer}
          />
          {this.renderTextInput()}
        </View>
      </Modal>
    );
  }
}

const styles = ScaledSheet.create({
  closeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    opacity: 0.8,
  },
  input: {
    color: colors.dark,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    paddingLeft: '10@s',
    paddingRight: '25@s',
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
    right: '5@s',
  },
});
