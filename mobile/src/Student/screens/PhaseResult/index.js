import { GameSessionState, isNullOrUndefined, ModelHelper } from '@righton/networking'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import TeamFooter from '../../../components/TeamFooter'
import { colors, fontFamilies, fonts, fontWeights } from '../../../utils/theme'
import Answer, { AnswerMode } from './Answer'

const PhaseResult = ({ gameSession, team, teamAvatar, setTeamInfo }) => {
    const [phaseNo, setPhaseNo] = useState(1)
    const [phase2Score, setPhase2Score] = useState(0)
    const [curTeam, setCurTeam] = useState(null)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [selectedTrickAnswer, setSelectedTrickAnswer] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(gameSession?.questions[gameSession.currentQuestionIndex])
    const [correctAnswer, setCorrectAnswer] = useState(null)
    const [loadedData, setLoadedData] = useState(false)
    const [totalScore, setTotalScore] = useState(null)
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null)

     useFocusEffect(
      React.useCallback(() => {
        gameSession?.currentState === GameSessionState.PHASE_1_RESULTS ? setPhaseNo(1) : setPhaseNo(2)  

        const updatedCurTeam = gameSession.teams.find((t) => t.id === team.id)
        if (isNullOrUndefined(updatedCurTeam)) {
            console.error(`Couldn't find the team.}`)
            return
        }
        setCurTeam(updatedCurTeam)
        setCorrectAnswer(ModelHelper.getCorrectAnswer(currentQuestion))
        const teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(updatedCurTeam, currentQuestion.id)

        const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion)
        let originalScore = gameSession?.teams?.find(teamElement => teamElement.id === team.id).score 
        let totalScore = calculateTotalScore(gameSession, currentQuestion, updatedCurTeam)
        updatedCurTeam.score = totalScore
        setTotalScore(totalScore)
        
        
        if (!isNullOrUndefined(teamAnswers) && teamAnswers.length > 0) {
            if (phaseNo === 1)
              setAnswer(teamAnswers.reduce(teamAnswer => teamAnswer.isChosen === true))
            else 
              setAnswer(teamAnswers.reduce(teamAnswer => teamAnswer.isTrickAnswer === true))
        } else {
            setSelectedAnswer({
                id: Number.MIN_VALUE,
                text: Number.MIN_VALUE,
            })
        }

        setSelectedTrickAnswer(ModelHelper.getSelectedTrickAnswer(updatedCurTeam, currentQuestion.id))
        setLoadedData(true)
        setTeamInfo(updatedCurTeam, updatedCurTeam.teamMembers[0])
      }, [gameSession?.currentState])
    )

    const setAnswer = (answer) => {
        setIsAnswerCorrect(answer.text === ModelHelper.getCorrectAnswer(currentQuestion).text)
        if (answer.isTrickAnswer) {
            setSelectedTrickAnswer(answer)
        } else {
            setSelectedAnswer(answer)
        }
    }

    const alphabets = ["A", "B", "C", "D"]
    const getAnswerMode = (choiceText) => {
        switch (phaseNo) {
            case 1:
                if (correctAnswer.text === choiceText) {
                    return AnswerMode.RightAnswer
                } else if (choiceText === selectedAnswer.text) {
                    return AnswerMode.UserAnswer
                }
                return AnswerMode.ShowEmptyRightIcon
            case 2:
                if (correctAnswer.text === choiceText) {
                    return AnswerMode.Disabled
                } else if (selectedTrickAnswer.text === choiceText) {
                    return AnswerMode.PopularTrickAnswer
                }
                break
        }
    }

    const calculatePercentage = (answer) => {
        if (isNullOrUndefined(answer)) {
            setPhase2Score(0)
            return 0
        }

        let percentage = ModelHelper.calculateBasicModeWrongAnswerScore(gameSession, answer.text, currentQuestion.id)

        if (selectedTrickAnswer?.text === answer.text) {
            setPhase2Score(percentage)
        } else {
            setPhase2Score(0)
        }
        return percentage
    }

    const getIsUserChoice = (answer) => {
        if (phaseNo === 1) {
            return selectedAnswer?.text === answer.text
        } else if (!isNullOrUndefined(selectedTrickAnswer)) {
            return selectedTrickAnswer.text === answer.text
        }
        return false
    }

    const getPercentageForAnswer = (answer) => {
        if (phaseNo === 1) {
            return ""
        }
        return `${calculatePercentage(answer)}%`
    }

    const calculateTotalScore =(gameSession, currentQuestion, curTeam) => {
      team.score = team.score + ModelHelper.calculateBasicModeScoreForQuestion(gameSession, currentQuestion, curTeam) 
      global.apiClient.updateTeam({id: curTeam.id, score: team.score})
      return team.score
    }

    return (
        <SafeAreaView style={styles.container}>
            {loadedData ? <>
                <ImageBackground
                    source={require("./img/background.png")}
                    style={styles.headerContainer}
                >
                    <Text style={styles.headerText}>
                        {`Phase ${phaseNo}\nResults`}
                    </Text>
                </ImageBackground>
                <View style={styles.resultContainer}>
                    <FlatList
                        data={currentQuestion.choices}
                        keyExtractor={(item) => `${item.text}`}
                        style={styles.answersContainer}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => {
                            return <View style={{ height: 10 }} />
                        }}
                        renderItem={({ item, index }) => (
                            <Answer
                                icon={teamAvatar.smallSrc}
                                text={`${alphabets[index]}. ${item.text}`}
                                mode={getAnswerMode(item.text)}
                                isUserChoice={getIsUserChoice(item)}
                                percentage={getPercentageForAnswer(item)}
                            />
                        )}
                    >
                    </FlatList>
                </View>
                <View style={styles.footerView}>
                    <TeamFooter
                        icon={teamAvatar.smallSrc}
                        name={curTeam.name ? curTeam.name : "N/A"}
                        score={phase2Score}
                        totalScore={totalScore}
                        isAnswerCorrect={isAnswerCorrect}
                    />
                </View>
            </>: null}
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