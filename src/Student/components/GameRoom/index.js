import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonWide from '../../../components/ButtonWide';
import { colors } from '../../../utils/theme';
import styles from '../Age/styles';


class GameRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: '',
    };

    this.handleRoomInput = this.handleRoomInput.bind(this);
    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
  }



  handleRoomInput(room) {
    this.setState({ room });
  }



  handleRoomSubmit() {
    // TODO Handle entering game in DynamoDB
    // TODO Navigate to Dashboard
  }



  render() {
    const {
      room,
    } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Room</Text>
        <TextInput
          keyboardType={'default'}
          maxLength={100}
          multiline={false}
          onChangeText={this.handleRoomInput}
          onSubmitEditing={this.handleRoomSubmit}
          placeholder={'Room Name'}
          placeholderTextColor={colors.primary} 
          returnKeyType='done'
          style={styles.input} 
          textAlign={'center'}
          underlineColorAndroid={colors.dark}   
          value={room}
        />
        <ButtonWide
          label={'Enter Game'}
          onPress={() => {}}
        />
      </View>
    );
  }
}


export default props => <GameRoom screenProps={{ ...props }} />;
