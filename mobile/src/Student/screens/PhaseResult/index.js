import { GameSessionState, isNullOrUndefined, ModelHelper } from '@righton/networking'
import { useEffect, useState } from 'react'
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import TeamFooter from '../../../components/TeamFooter'
import { colors, fontFamilies, fonts, fontWeights } from '../../../utils/theme'
import Answer, { AnswerMode } from './Answer'

const PhaseResult = ({ gameSession, teamId, smallAvatar }) => {
    smallAvatar = smallAvatar ? smallAvatar : require("../SelectTeam/img/MonsterIcon1.png")

    const [phaseNo, setPhaseNo] = useState(1)
    const [phase2Score, setPhase2Score] = useState(0)
    const [curTeam, setCurTeam] = useState(null)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [selectedTrickAnswer, setSelectedTrickAnswer] = useState(null)
    const [correctAnswer, setCorrectAnswer] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [loadedData, setLoadedData] = useState(false)
    const [updatedGameSession, setUpdatedGameSession] = useState(gameSession)

    useEffect(() => {
        global.apiClient
            .getGameSessionByCode(gameSession.gameCode)
            .then((gameSessionResponse) => {
                switch (gameSessionResponse.currentState) {
                    case GameSessionState.PHASE_1_RESULTS:
                        setPhaseNo(1)
                        break
                    case GameSessionState.PHASE_2_RESULTS:
                        setPhaseNo(2)
                        break
                }

                const updatedCurTeam = gameSessionResponse.teams.find((t) => t.id === (teamId ?? "b5958293-647d-43eb-9874-959e996a37c8"))
                if (isNullOrUndefined(updatedCurTeam)) {
                    console.error(`Couldn't find the team.}`)
                    return
                }
                setCurTeam(updatedCurTeam)
                const curQuestion = gameSessionResponse.questions[gameSessionResponse.currentQuestionIndex]
                const teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(updatedCurTeam, curQuestion.id)
                if (!isNullOrUndefined(teamAnswers) && teamAnswers.length > 0) {
                    // User has answered both phases
                    if (teamAnswers.length > 1) {
                        const answer = teamAnswers[1]
                        setAnswer(answer)
                    }
                    setAnswer(teamAnswers[0])
                } else {
                    setSelectedAnswer({
                        id: Number.MIN_VALUE,
                        text: Number.MIN_VALUE,
                    })
                }
                setSelectedTrickAnswer(ModelHelper.getSelectedTrickAnswer(updatedCurTeam, curQuestion.id))
                setCorrectAnswer(ModelHelper.getCorrectAnswer(curQuestion))
                setCurrentQuestion(curQuestion)
                setUpdatedGameSession(gameSession)
                setLoadedData(true)
            }).catch((error) => {
                console.error(error)
            })
    })

    const setAnswer = (answer) => {
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
        let percentage
        if (isNullOrUndefined(answer)) {
            setPhase2Score(0)
            return 0
        }

        percentage = ModelHelper.calculateBasicModeWrongAnswerScore(gameSession, answer.text, currentQuestion.id)
        if (selectedTrickAnswer.text === answer.text) {
            setPhase2Score(percentage)
        } else {
            setPhase2Score(0)
        }
    }

    const getIsUserChoice = (answer) => {
        if (phaseNo === 1) {
            return selectedAnswer.text === answer.text
        } else if (!isNullOrUndefined(selectedTrickAnswer)) {
            return selectedTrickAnswer.text === answer.text
        }
        return false
    }

    const getPercentageForAnswer = (answer) => {
        if (phaseNo === 1) {
            return ""
        }
        return `% ${calculatePercentage(item)}`
    }

    return (
        <SafeAreaView style={styles.container}>
            {loadedData && <>
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
                                icon={smallAvatar}
                                text={`${alphabets[index]}.${item.text}`}
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
                        icon={smallAvatar}
                        name={curTeam.name ? curTeam.name : "N/A"}
                        score={phase2Score}
                        totalScore={curTeam.score}
                    />
                </View>
            </>}
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