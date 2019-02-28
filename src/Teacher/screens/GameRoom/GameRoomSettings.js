import React from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
import { ScaledSheet } from 'react-native-size-matters';
import KeepAwake from 'react-native-keep-awake';
import Touchable from 'react-native-platform-touchable';
import SelectionModal from '../../../components/SelectionModal';
import Message from '../../../components/Message';
import { trickTimeSelection, quizTimeSelection } from '../../../config/selections';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import parentStyles from './styles';
import { colors, fonts } from '../../../utils/theme';

export default class GameRoomStart extends React.Component {
  static propTypes = {
    gameState: gameStatePropTypes,
    handleBackFromChild: PropTypes.func.isRequired,
    handleSetAppState: PropTypes.func.isRequired,
    IOTPublishMessage: PropTypes.func.isRequired,
    numberOfPlayers: PropTypes.number,
  };
  
  static defaultProps = {
    gameState: gameStateDefaultProps,
    handleBackFromChild: () => {},
    handleSetAppState: () => {},
    IOTPublishMessage: () => {},
    numberOfPlayers: 0,
  };

  constructor(props) {
    super(props);
    
    this.state = {
      messageProps: {},
      quizTime: props.gameState.quizTime || '1:00',
      showSelection: false,
      trickTime: props.gameState.trickTime || '3:00',
    };

    this.setTimer = null;
  }


  handleTimeSelection = (time) => {
    if (typeof time === 'object' || !time) {
      this.setState({ showSelection: false });
    } else if (this.setTimer === 'quizTime') {
      this.setState({ quizTime: time, showSelection: false });
    } else if (this.setTimer === 'trickTime') {
      this.setState({ trickTime: time, showSelection: false });
    }
    this.setTimer = null;
  }


  handleOpenTimeSelection = (timer) => {
    this.setTimer = timer;
    this.setState({ showSelection: true });
  }


  handleSaveSettings = () => {
    const { quizTime, trickTime } = this.state;
    const { gameState, handleBackFromChild, numberOfPlayers } = this.props;
    if (quizTime !== gameState.quizTime ||
      trickTime !== gameState.trickTime) {
      const { handleSetAppState } = this.props;
      // const message = {
      //   action: 'UPDATE_GAME_SETTINGS',
      //   payload: {
      //     quizTime,
      //     trickTime,
      //   },
      //   uid: `${Math.random()}`,
      // };
      // IOTPublishMessage(message);
      if (numberOfPlayers === 0) {
        const updatedGameState = { ...gameState };
        updatedGameState.quizTime = quizTime;
        updatedGameState.trickTime = trickTime;
        handleSetAppState('gameState', updatedGameState);
        handleBackFromChild('start');
      } else {
        this.setState({
          messageProps: {
            closeFunc: this.handleCloseMessage,
            bodyStyle: null,
            textStyle: null,
            duration: null,
            message: 'Settings can only be updated before players join game.',
            timeout: null,
          },
        });
      }
    }
  }


  handleCloseMessage = () => this.setState({ messageProps: {} });

  
  render() {
    const {
      handleBackFromChild,
    } = this.props;

    const {
      messageProps,
      quizTime,
      showSelection,
      trickTime,
    } = this.state;

    return (
      <Modal
        animationType={'slide'}
        onRequestClose={() => handleBackFromChild('start')}
        visible
      >
        { Platform.OS === 'ios' && <KeepAwake /> }

        <Message {...messageProps} />
        <ScrollView
          contentContainerStyle={[
            parentStyles.dashboardContainer,
            parentStyles.extraPaddingBottom,
            styles.zeroHorizontal,
          ]} 
        >
          {showSelection &&
            <SelectionModal
              handleClose={this.handleTimeSelection}
              items={this.setTimer === 'quizTime' ? quizTimeSelection : trickTimeSelection}
              onSelect={this.handleTimeSelection}
              title={'Time remaining'}
              visible={showSelection}
            />}
          <ButtonBack
            iconName={'close'}
            onPress={() => handleBackFromChild('start')}
          />
          <Text style={[parentStyles.textLabel, parentStyles.textLarge, parentStyles.textCenter]}>
            Settings
          </Text>
          <View style={styles.settingContainer} />
          <View style={[parentStyles.playersContainer, styles.verticalSpacing]}>
            <Touchable
              activeOpacity={0.8}
              onPress={() => this.handleOpenTimeSelection('trickTime')}
              style={styles.settingWrapper}
            >
              <View style={styles.settingContainer}>
                <Text style={[styles.settingText, styles.settingLabel]}>
                  Distractor Creation Time
                </Text>
                <Text style={styles.settingText}>{ trickTime }</Text>
              </View>
            </Touchable>
            <Touchable
              activeOpacity={0.8}
              onPress={() => this.handleOpenTimeSelection('quizTime')}
              style={styles.settingWrapper}
            >
              <View style={styles.settingContainer}>
                <Text style={[styles.settingText, styles.settingLabel]}>
                  Quiz Response Time
                </Text>
                <Text style={styles.settingText}>{ quizTime }</Text>
              </View>
            </Touchable>
          </View>
          <ButtonWide
            label={'Save settings'}
            onPress={this.handleSaveSettings}
          />
        </ScrollView>
      </Modal>
    );
  }
}

const styles = ScaledSheet.create({
  settingContainer: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    flexDirection: 'column',
    paddingVertical: '15@vs',
  },
  settingLabel: {
    fontWeight: 'bold',
    opacity: 1,
  },
  settingText: {
    color: colors.white,
    fontSize: fonts.medium,
    marginLeft: '15@s',
    opacity: 0.8,
  },
  settingWrapper: {
    alignSelf: 'stretch',
  },
  verticalSpacing: {
    alignSelf: 'stretch',
    paddingTop: '10@vs',
    paddingBottom: '90@vs',
  },
  zeroHorizontal: {
    paddingHorizontal: 0,
  },
});
