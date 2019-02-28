import React from 'react';
import {
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { scale, ScaledSheet, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors, deviceHeight, deviceWidth, elevation, fonts } from '../../utils/theme';


export default class InputModal extends React.PureComponent {
  static propTypes = {
    autoCapitalize: PropTypes.string,
    autoCorrect: PropTypes.bool,
    backgroundColor: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
    keyboardType: PropTypes.string,
    height: PropTypes.number,
    hiddenLabel: PropTypes.bool,
    input: PropTypes.string,
    inputLabel: PropTypes.string,
    labelStyles: PropTypes.shape({}),
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
    hiddenLabel: true,
    input: '',
    inputLabel: '',
    labelStyles: {},
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
      minY: deviceHeight / 2,
      input: props.input || '',
    };
  }


  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => this.keyboardDidShow(e));
    setTimeout(() => this.inputRef.focus(), 100);
  }


  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this.keyboardDidShow);
  }


  keyboardDidShow = (e) => {
    const minY = deviceHeight - e.endCoordinates.height;
    if (this.state.minY !== minY) {
      this.setState({ minY });
    }
  }


  handleInputBlur = () => {
    this.props.closeModal(this.state.input, this.props.inputLabel);
  }


  handleInput = val => this.setState({ input: val });


  handleInputRef = (ref) => { this.inputRef = ref; }


  handleInputSubmit = () => {
    this.props.closeModal(this.state.input, this.props.inputLabel);
  }


  renderTextInput = (xAxis, yAxis, bottom, height) => {
    const { input } = this.state;
    const {
      autoCapitalize,
      autoCorrect,
      keyboardType,
      maxLength,
      multiline,
      placeholder,
      spellCheck,
      width,
    } = this.props;

    return (
      <View 
        style={[
          styles.inputContainer,
          elevation,
          { height, width, left: xAxis },
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
      height,
      hiddenLabel,
      inputLabel,
      labelStyles,
      visible,
      x,
      y,
    } = this.props;

    const { minY } = this.state;

    let yAxis = minY;
    let xAxis = scale(15);
    let bottom;
    const scaledHeight = verticalScale(height);
    if (y < minY) {
      yAxis = y;
    } else {
      bottom = true;
    }

    if (x < deviceWidth) {
      xAxis = x;
    }

    const ms25 = moderateScale(25);

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
          {!hiddenLabel &&
            <Text
              style={[
                styles.inputLabel,
                { left: xAxis },
                bottom ? { bottom: 15 + ms25 + scaledHeight } : { top: yAxis - ms25 },
                labelStyles,
              ]}
            >{ inputLabel }</Text>}

          {this.renderTextInput(xAxis, yAxis, bottom, scaledHeight)}
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
  inputLabel: {
    color: colors.primary,
    fontSize: fonts.small,
    position: 'absolute',
  },
  length: {
    color: colors.lightGray,
    fontSize: fonts.small,
    position: 'absolute',
    right: '5@s',
  },
});
