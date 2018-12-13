import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from './styles';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import { colors } from '../../../utils/theme';

export default class Age extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      age: '',
    };

    this.handleAgeInput = this.handleAgeInput.bind(this);
    this.handleAgeSubmit = this.handleAgeSubmit.bind(this);
  }



  handleAgeInput(age) {
    if (parseInt(age) === NaN) return;
    this.setState({ age });
  }



  handleAgeSubmit() {
    if (parseInt(this.state.age) < 13) {
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
          returnKeyType='done'
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