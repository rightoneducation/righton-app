import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import Touchable from 'react-native-platform-touchable';
import gamePreviewStyles from '../../../Student/screens/GamePreview/styles';

export default function GameRoomPreview({
  gameState,
  handleBackFromPreview,
  handleStartQuiz,
  teamRef,
}) {
  return (
    <ScrollView
      contentContainerStyle={gamePreviewStyles.container}
    >
      <ButtonBack
        onPress={handleBackFromPreview}
      />
      <View style={gamePreviewStyles.questionContainer}>
        <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
        {Boolean(gameState[teamRef].image) &&
          <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} />} 
      </View>
      <View style={gamePreviewStyles.choicesContainer}>
        {gameState[teamRef].choices.map(choice => (
          <Touchable
            activeOpacity={0.8}
            key={choice.value} // TODO Replace w/ uid
            onPress={() => {}}
          >
            <View style={gamePreviewStyles.choiceContainer}>
              <View style={gamePreviewStyles.choiceDot} />
              <Text style={gamePreviewStyles.choiceAnswer}>{ choice.value }</Text>
            </View>
          </Touchable>
        ))}
      </View>
      <ButtonWide
        label={'Start quiz'}
        onPress={() => handleStartQuiz(teamRef)}
      />
    </ScrollView>
  );
}

GameRoomPreview.propTypes = {
  gameState: PropTypes.shape({}),
  handleBackFromPreview: PropTypes.func.isRequired,
  handleStartQuiz: PropTypes.func.isRequired,
  teamRef: PropTypes.string.isRequired,
};

GameRoomPreview.defaultProps = {
  gameState: {},
  handleBackFromPreview: () => {},  
  handleStartQuiz: () => {},
  teamRef: 'team0',
};
