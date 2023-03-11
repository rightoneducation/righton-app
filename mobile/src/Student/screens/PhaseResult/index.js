import { GameSessionState, isNullOrUndefined, ModelHelper } from '@righton/networking'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import TeamFooter from '../../../components/TeamFooter'
import { colors, fontFamilies, fonts, fontWeights } from '../../../utils/theme'
import Answer, { AnswerMode } from './Answer'

const PhaseResult = ({ gameSession, team, teamAvatar }) => {
    const alphabets = ["A", "B", "C", "D"]
    const phaseNo = gameSession?.currentState === GameSessionState.PHASE_1_RESULTS ? 1 : 2
    const currentQuestion = gameSession?.questions[gameSession.currentQuestionIndex]
    const [originalScore, setOriginalScore] = useState(0)
    const [answerList, setAnswerList] = useState([])

    useFocusEffect(
      React.useCallback(() => {
        const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion)

        const findSelectedAnswer = (teamAnswers) => {
          return teamAnswers.reduce(teamAnswer => (phaseNo == 1 ? teamAnswer.isChosen === true : teamAnswer.isTrickAnswer === true))
        }
        const selectedAnswer = findSelectedAnswer(ModelHelper.getBasicTeamMemberAnswersToQuestionId(team, currentQuestion.id))
        setOriginalScore(gameSession?.teams?.find(teamElement => teamElement.id === team.id).score)

        const getP1AnswerMode = (choiceText) =>{
          if (choiceText === correctAnswer.text) 
            return AnswerMode.RightAnswer
          else if (choiceText === selectedAnswer.text) 
            return AnswerMode.UserAnswer
          else
            return AnswerMode.ShowEmptyRightIcon
        } 
    
        const getP2AnswerMode = (choiceText) => {
          if (choiceText === correctAnswer.text) 
            return AnswerMode.Disabled
          else if (choiceText === selectedAnswer.text) 
            return AnswerMode.PopularTrickAnswer
        }
    
        const getAnswer = ({item, index}) => {
              if (phaseNo === 1)
                return <Answer
                  icon={teamAvatar.smallSrc}
                  text={`${alphabets[index]}. ${item.text}`}
                  mode={getP1AnswerMode(item.text)}
                  isUserChoice={item.text === selectedAnswer?.text}
                  percentage={""}
                />
              else  
                return <Answer
                  icon={teamAvatar.smallSrc}
                  text={`${alphabets[index]}. ${item.text}`}
                  mode={getP2AnswerMode(item.text)}
                  isUserChoice={item.text === selectedAnswer?.text}
                  percentage={`${ModelHelper.calculateBasicModeWrongAnswerScore(gameSession, item.text, currentQuestion.id)}%`}
                />
        }

        setAnswerList([
          <FlatList
            data={currentQuestion.choices}
            keyExtractor={(item) => `${item.text}`}
            style={styles.answersContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={itemSeparator}
            renderItem={getAnswer}
          />
        ])
      }, [gameSession?.currentState])
    )

    const calculateTotalScore = () => {
      team.score = team.score + ModelHelper.calculateBasicModeScoreForQuestion(gameSession, currentQuestion, team) 
      global.apiClient.updateTeam({id: team.id, score: team.score})
      return team.score
    }

    const itemSeparator = () => {
      return <View style={{ height: 10 }} />
    }

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require("./img/background.png")}
            style={styles.headerContainer}
        >
            <Text style={styles.headerText}>
                {`Phase ${phaseNo}\nResults`}
            </Text>
        </ImageBackground>
        <View style={styles.resultContainer}>
            {answerList}
        </View>
        <View style={styles.footerView}>
            <TeamFooter
                icon={teamAvatar.smallSrc}
                name={team.name ? team.name : "N/A"}
                originalScore={originalScore}
                totalScore={calculateTotalScore(gameSession, currentQuestion, team)}
            />
        </View>
      </SafeAreaView>
    )
}

export default PhaseResult

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: verticalScale(225),
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: fonts.semiLarge,
        fontFamily: fontFamilies.karlaBold,
        fontWeight: fontWeights.extraBold,
        color: colors.white,
    },
    footerView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        marginBottom: verticalScale(18),
    },
    resultContainer: {
        flex: 1,
    },
    answersContainer: {
        marginHorizontal: 53,
        shadowOpacity: 1,
        elevation: 5,
        shadowColor: '#030002',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        borderRadius: 24,
        padding: 12,
        backgroundColor: colors.white,
        flexGrow: 0,
    }
})