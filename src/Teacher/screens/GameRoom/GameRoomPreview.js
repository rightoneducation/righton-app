import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { gameStatePropTypes, gameStateDefaultProps } from '../../../config/propTypes';
// import Aicon from 'react-native-vector-icons/FontAwesome';
import KeepAwake from 'react-native-keep-awake';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import Touchable from 'react-native-platform-touchable';
import gamePreviewStyles from '../../../Student/screens/GamePreview/styles';

export default function GameRoomPreview({
  gameState,
  handleBackFromChild,
  handleStartQuiz,
  handleViewResults,
  teamRef,
}) {
  const startedQuiz = gameState.state.startQuiz;

  return (
    <ScrollView
      contentContainerStyle={gamePreviewStyles.container}
    >
      { Platform.OS === 'ios' && <KeepAwake /> }

      <ButtonBack
        onPress={handleBackFromChild}
      />
      <View 
        style={[gamePreviewStyles.questionContainer, gamePreviewStyles.questionContainerTeacher]}
      >
        <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
        {Boolean(gameState[teamRef].image) &&
          <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} resizeMode={'contain'} />} 
      </View>
      <View style={gamePreviewStyles.choiceContainerWrapper}>
        <View style={gamePreviewStyles.choicesContainer}>
          {gameState[teamRef].choices.map(choice => (
            <Touchable
              activeOpacity={0.8}
              key={choice.uid}
              onPress={() => {}}
            >
              <View style={gamePreviewStyles.choiceContainer}>
                <View style={[gamePreviewStyles.choiceButton]}>
                  {choice.selected &&
                    <View style={gamePreviewStyles.choiceButton} />}
                </View>
                <Text style={gamePreviewStyles.choiceValue}>{ choice.value }</Text>
              </View>
            </Touchable>
          ))}
        </View>
      </View>
      {startedQuiz ?
        <ButtonWide
          label={'View results'}
          onPress={() => handleViewResults(teamRef)}
        />
        :
        <ButtonWide
          label={'Start quiz'}
          onPress={() => handleStartQuiz(teamRef)}
        />}
    </ScrollView>
  );
}

GameRoomPreview.propTypes = {
  gameState: gameStatePropTypes,
  handleBackFromChild: PropTypes.func.isRequired,
  handleViewResults: PropTypes.func.isRequired,
  handleStartQuiz: PropTypes.func.isRequired,
  teamRef: PropTypes.string.isRequired,
};

GameRoomPreview.defaultProps = {
  gameState: gameStateDefaultProps,
  handleBackFromChild: () => {},  
  handleViewResults: () => {},
  handleStartQuiz: () => {},
  teamRef: 'team0',
};
