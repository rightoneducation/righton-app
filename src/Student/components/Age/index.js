import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import { colors } from '../../../utils/theme';

export default class Age extends React.PureComponent {
  static propTypes = {
    rootNavigator: PropTypes.shape({ type: PropTypes.any }),
    studentFirstNavigator: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }

  
  static defaultProps = {
    rootNavigator: {},
    studentFirstNavigator: {},
  }


  constructor(props) {
    super(props);

    this.ageRef = undefined;

    this.state = {
      age: '',
    };

    this.handleAgeInput = this.handleAgeInput.bind(this);
    this.handleAgeRef = this.handleAgeRef.bind(this);
    this.handleAgeSubmit = this.handleAgeSubmit.bind(this);
  }


  componentDidMount() {
    setTimeout(() => this.ageRef.focus(), 0);
  }


  handleAgeInput(age) {
    if (isNaN(parseInt(age, 10))) return;
    this.setState({ age });
  }


  handleAgeRef(ref) {
    this.ageRef = ref;
  }


  handleAgeSubmit() {
    if (parseInt(this.state.age, 10) < 13) {
      // TODO Treat user specially
    } 
    this.props.studentFirstNavigator.navigate('GameRoom');
  }


  render() {
    const {
      age,
    } = this.state;

    const { rootNavigator } = this.props;

    return (
      <View style={styles.container}>
        <ButtonBack
          buttonStyles={{ top: 40 }}
          navigator={rootNavigator}
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
