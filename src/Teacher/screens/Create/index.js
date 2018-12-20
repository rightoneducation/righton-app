import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonWide from '../../../components/ButtonWide';
import { colors } from '../../../utils/theme';
import styles from '../../../Student/components/Age/styles';


class Create extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      navigation: PropTypes.shape({
        navigate: PropTypes.func,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      navigation: {
        navigate: () => {},
      },
    },
  };
  
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
    // Hydrate Dashboard w/ game details
    this.props.screenProps.navigation.navigate('Class');
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
          placeholder={'Game Name'}
          placeholderTextColor={colors.primary} 
          returnKeyType={'done'}
          style={styles.input}
          textAlign={'center'}
          underlineColorAndroid={colors.dark}   
          value={room}
        />
        <ButtonWide
          label={'Enter Game'}
          onPress={this.handleRoomSubmit}
        />
      </View>
    );
  }
}


export default props => <Create screenProps={{ ...props }} />;
