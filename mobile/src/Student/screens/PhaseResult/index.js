import { GameSessionState, isNullOrUndefined, ModelHelper } from '@righton/networking'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import TeamFooter from '../../../components/TeamFooter'
import { colors, fontFamilies, fonts, fontWeights } from '../../../utils/theme'
import Answer, { AnswerMode } from './Answer'

const PhaseResult = ({ gameSession, team, teamAvatar, setTeamInfo, isRejoin }) => {

    const alphabets = ["A", "B", "C", "D"]
    const currentQuestion = gameSession?.questions[gameSession.currentQuestionIndex]
    const originalScore = gameSession?.teams?.find(teamElement => teamElement.id === team.id).score
    const phaseNo = (gameSession?.currentState === GameSessionState.PHASE_1_RESULTS) ? 1 : 2
    const [answerList, setAnswerList] = useState([])
    const [scoreFooter, setScoreFooter] = useState([])
    const [phaseTitle, setPhaseTitle] = useState([])
  
    useFocusEffect(
      React.useCallback(() => {
        const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion)
        const findSelectedAnswer = (teamAnswers) => {
          return teamAnswers.find(teamAnswer => ((phaseNo == 1) ? (teamAnswer.isChosen === true) : (teamAnswer.isTrickAnswer === true)))
        }
        const selectedAnswer = findSelectedAnswer(ModelHelper.getBasicTeamMemberAnswersToQuestionId(team, currentQuestion.id))

        const getPhase1AnswerMode = (choiceText) =>{
          if (choiceText === correctAnswer.text) 
            return AnswerMode.RightAnswer
          else if (choiceText === selectedAnswer.text) 
            return AnswerMode.UserAnswer
          else
            return AnswerMode.ShowEmptyRightIcon
        } 
    
        const getPhase2AnswerMode = (choiceText) => {
          if (choiceText === correctAnswer.text) 
            return AnswerMode.Disabled
          else if (choiceText === selectedAnswer.text) 
            return AnswerMode.PopularTrickAnswer
        }
    
        const getAnswer = ({item, index}) => {
          return <Answer
            icon={teamAvatar.smallSrc}
            text={`${alphabets[index]}. ${item.text}`}
            mode={(phaseNo === 1) ? getPhase1AnswerMode(item.text) : getPhase2AnswerMode(item.text)}
            isUserChoice={item.text === selectedAnswer?.text}
            percentage={(phaseNo === 1) ? "" : `${ModelHelper.calculateBasicModeWrongAnswerScore(gameSession, item.text, currentQuestion.id)}%`}
          />
        }

        const calculateTotalScore = (gameSession, currentQuestion, team) => {
          let totalScore = originalScore + ModelHelper.calculateBasicModeScoreForQuestion(gameSession, currentQuestion, team) 
          global.apiClient.updateTeam({id: team.id, score: totalScore})
          setTeamInfo({...team, score: totalScore})
          return totalScore
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

        setScoreFooter([
          <TeamFooter
                icon={teamAvatar.smallSrc}
                name={team.name ? team.name : "N/A"}
                originalScore={originalScore}
                totalScore={isRejoin ? originalScore : calculateTotalScore(gameSession, currentQuestion, team)}
            />
        ])

        setPhaseTitle([
            <Text style={styles.headerText}>
                {`Phase ${phaseNo}\nResults`}
            </Text>
        ])
      }, [gameSession?.currentState, teamAvatar, isRejoin])
    )

    const itemSeparator = () => {
      return <View style={{ height: 10 }} />
    }

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require("./img/background.png")}
            style={styles.headerContainer}
        >
            {phaseTitle}
        </ImageBackground>
        <View style={styles.resultContainer}>
            {currentQuestion.choices ? answerList : null}
        </View>
        <View style={styles.footerView}>
            {scoreFooter}
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