import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import Touchable from 'react-native-platform-touchable';
import SelectionModal from '../../../components/SelectionModal';
import { timeSelection } from '../../../config/selections';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import parentStyles from './styles';
import { colors, fonts } from '../../../utils/theme';

export default class GameRoomStart extends React.Component {
  static propTypes = {
    gameState: PropTypes.shape({
      quizTime: PropTypes.string,
      trickTime: PropTypes.string,
    }),
    handleBackFromChild: PropTypes.func.isRequired,
    handleSetAppState: PropTypes.func.isRequired,
    IOTPublishMessage: PropTypes.func.isRequired,
  };
  
  static defaultProps = {
    gameState: {
      quizTime: '1:00',
      trickTime: '3:00',
    },
    handleBackFromChild: () => {},
    handleSetAppState: () => {},
    IOTPublishMessage: () => {},
  };

  constructor(props) {
    super(props);
    
    this.state = {
      quizTime: props.gameState.quizTime || '1:00',
      showSelection: false,
      trickTime: props.gameState.trickTime || '3:00',
    };

    this.setTimer = null;

    this.handleTimeSelection = this.handleTimeSelection.bind(this);
    this.handleOpenTimeSelection = this.handleOpenTimeSelection.bind(this);
    this.handleSaveSettings = this.handleSaveSettings.bind(this);
  }


  handleTimeSelection(time) {
    if (typeof time === 'object' || !time) {
      this.setState({ showSelection: false });
    } else if (this.setTimer === 'quizTime') {
      this.setState({ quizTime: time, showSelection: false });
    } else if (this.setTimer === 'trickTime') {
      this.setState({ trickTime: time, showSelection: false });
    }
    this.setTimer = null;
  }


  handleOpenTimeSelection(timer) {
    this.setTimer = timer;
    this.setState({ showSelection: true });
  }


  handleSaveSettings() {
    const { quizTime, trickTime } = this.state;
    const { gameState, handleBackFromChild } = this.props;
    if (quizTime !== gameState.quizTime ||
      trickTime !== gameState.trickTime) {
      const { handleSetAppState, IOTPublishMessage } = this.props;
      const message = {
        action: 'UPDATE_GAME_SETTINGS',
        payload: {
          quizTime,
          trickTime,
        },
        uid: `${Math.random()}`,
      };
      IOTPublishMessage(message);
      const updatedGameState = { ...gameState };
      updatedGameState.quizTime = quizTime;
      updatedGameState.trickTime = trickTime;
      handleSetAppState('gameState', updatedGameState);
    }
    handleBackFromChild('start');
  }

  
  render() {
    const {
      handleBackFromChild,
    } = this.props;

    const {
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
              items={timeSelection}
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
              onPress={() => this.handleOpenTimeSelection('quizTime')}
              style={styles.settingWrapper}
            >
              <View style={styles.settingContainer}>
                <Text style={[styles.settingText, styles.settingLabel]}>
                  Configure quizzing timer
                </Text>
                <Text style={styles.settingText}>{ quizTime }</Text>
              </View>
            </Touchable>
            <Touchable
              activeOpacity={0.8}
              onPress={() => this.handleOpenTimeSelection('trickTime')}
              style={styles.settingWrapper}
            >
              <View style={styles.settingContainer}>
                <Text style={[styles.settingText, styles.settingLabel]}>
                  Configure tricking timer
                </Text>
                <Text style={styles.settingText}>{ trickTime }</Text>
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
