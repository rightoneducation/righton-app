import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import ButtonBack from '../../../../components/ButtonBack';
import ButtonWide from '../../../../components/ButtonWide';
import { colors, fonts } from '../../../../utils/theme';
import styles from '../../../components/Age/styles';


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
    // Hydrate Dashboard w/ game details
    this.props.screenProps.rootNavigator.navigate('StudentApp');
  }


  render() {
    const {
      room,
    } = this.state;

    const { studentFirstNavigator } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <ButtonBack
          buttonStyles={{ top: 40 }}
          navigator={studentFirstNavigator}
        />
        <Text style={styles.title}>Game Room</Text>
        <TextInput
          keyboardType={'default'}
          maxLength={100}
          multiline={false}
          onChangeText={this.handleRoomInput}
          onSubmitEditing={this.handleRoomSubmit}
          placeholder={'Room Name'}
          placeholderTextColor={colors.primary} 
          returnKeyType={'done'}
          style={styles.input}
          textAlign={'center'}
          underlineColorAndroid={colors.dark}   
          value={room}
        />
        <Touchable
          activeOpacity={0.8}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={this.handleRoomSubmit}
          style={GameRoomStyles.skipButton}
        >
          <Text style={GameRoomStyles.skip}>Join later</Text>
        </Touchable>
        <ButtonWide
          label={'Enter Game'}
          onPress={this.handleRoomSubmit}
        />
      </View>
    );
  }
}

GameRoom.propTypes = {
  screenProps: PropTypes.objectOf,
};

GameRoom.defaultProps = {
  screenProps: {},
};

const GameRoomStyles = StyleSheet.create({
  skip: {
    color: colors.primary,
    fontSize: fonts.medium,
  },
  skipButton: {
    bottom: 100,
    position: 'absolute',
  },
});

export default props => <GameRoom screenProps={{ ...props }} />;
