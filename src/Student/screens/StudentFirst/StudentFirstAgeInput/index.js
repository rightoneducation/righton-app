import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale } from 'react-native-size-matters';
import ButtonBack from '../../../../components/ButtonBack';
import ButtonWide from '../../../../components/ButtonWide';
import Message from '../../../../components/Message';
import { colors } from '../../../../utils/theme';
import styles from '../styles';

export default class AgeInput extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      handleAgeSubmit: PropTypes.func.isRequired,
      handleBack: PropTypes.func.isRequired,
      handleSetAppState: PropTypes.func.isRequired,
    }),
  }

  
  static defaultProps = {
    screenProps: {
      handleAgeSubmit: () => {},
      handleBack: () => {},
      handleSetAppState: () => {},
    },
  }


  constructor(props) {
    super(props);

    this.ageRef = undefined;

    this.state = {
      age: '',
      messageProps: null,
    };

    this.handleAgeInput = this.handleAgeInput.bind(this);
    this.handleAgeRef = this.handleAgeRef.bind(this);
    this.handleAgeSubmit = this.handleAgeSubmit.bind(this);
    this.handleCloseMessage = this.handleCloseMessage.bind(this);
  }


  componentDidMount() {
    setTimeout(() => this.ageRef.focus(), 0);
  }


  handleAgeInput(age) {
    if (age !== '' && isNaN(parseInt(age, 10))) return;
    this.setState({ age });
  }


  handleAgeRef(ref) {
    this.ageRef = ref;
  }


  handleAgeSubmit() {
    const age = parseInt(this.state.age, 10);
    if (isNaN(age)) {
      this.setState({
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: { backgroundColor: colors.white, bottom: verticalScale(100) },
          textStyle: { color: colors.dark },
          duration: null,
          message: 'Enter valid age as number.',
          timeout: 4000,
        },
      });
      return;
    }
    const { handleAgeSubmit } = this.props.screenProps;
    handleAgeSubmit(age);
  }


  handleCloseMessage() {
    this.setState({ messageProps: null });
  }


  render() {
    const {
      age,
      messageProps,
    } = this.state;

    const { handleBack } = this.props.screenProps;

    return (
      <View style={styles.container}>

        <Message {...messageProps} />

        <ButtonBack
          buttonStyles={{ top: 40 }}
          onPress={handleBack}
        />
        <Text style={styles.title}>How old are you?</Text>
        <TextInput
          keyboardType={'numeric'}
          maxLength={100}
          multiline={false}
          onChangeText={this.handleAgeInput}
          onSubmitEditing={this.handleAgeSubmit}
          placeholder={'##'}
          placeholderTextColor={colors.primary}
          ref={this.handleAgeRef}
          returnKeyType={'done'}
          style={styles.input} 
          textAlign={'center'}
          underlineColorAndroid={colors.dark}   
          value={age}
        />
        <ButtonWide
          label={'Submit'}
          onPress={this.handleAgeSubmit}
        />
      </View>
    );
  }
}
