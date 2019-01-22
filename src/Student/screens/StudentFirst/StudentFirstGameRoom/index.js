import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { verticalScale } from 'react-native-size-matters';
import Touchable from 'react-native-platform-touchable';
import ButtonBack from '../../../../components/ButtonBack';
import ButtonWide from '../../../../components/ButtonWide';
import { colors, fonts } from '../../../../utils/theme';
import styles from '../styles';


export default class GameRoom extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      handleBack: PropTypes.func.isRequired,
      handleSetAppState: PropTypes.func.isRequired,
      handleRoomSubmit: PropTypes.func.isRequired,
    }),
  }

  
  static defaultProps = {
    screenProps: {
      handleBack: () => {},
      handleSetAppState: () => {},
      handleRoomSubmit: () => {},
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      room: '',
    };

    this.onRoomInput = this.onRoomInput.bind(this);
    this.onRoomSubmit = this.onRoomSubmit.bind(this);
    this.onJoinLater = this.onJoinLater.bind(this);
  }


  onRoomInput(room) {
    this.setState({ room });
  }


  onRoomSubmit() {
    const { room } = this.state;
    this.props.screenProps.handleRoomSubmit(room);
    this.props.screenProps.handleSetAppState('deviceSettings', { role: 'student' });
  }


  onJoinLater() {
    this.props.screenProps.handleRoomSubmit();
    this.props.screenProps.handleSetAppState('deviceSettings', { role: 'student' });
  }


  render() {
    const {
      room,
    } = this.state;

    const { handleBack } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <ButtonBack
          buttonStyles={{ top: 40 }}
          onPress={handleBack}
        />
        <Text style={styles.title}>Game Code</Text>
        <TextInput
          keyboardType={'default'}
          maxLength={100}
          multiline={false}
          onChangeText={this.onRoomInput}
          onSubmitEditing={this.onRoomSubmit}
          placeholder={'######'}
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
          onPress={this.onJoinLater}
          style={GameRoomStyles.skipButton}
        >
          <Text style={GameRoomStyles.skip}>Join later</Text>
        </Touchable>
        <ButtonWide
          label={'Enter Game'}
          onPress={this.onRoomSubmit}
        />
      </View>
    );
  }
}


const GameRoomStyles = StyleSheet.create({
  skip: {
    color: colors.primary,
    fontSize: fonts.medium,
  },
  skipButton: {
    bottom: verticalScale(100),
    position: 'absolute',
  },
});
