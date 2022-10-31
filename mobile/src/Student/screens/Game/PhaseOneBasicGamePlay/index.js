import React, { useState, useEffect, useRef } from "react"
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SafeAreaView,
    Alert,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import * as Progress from "react-native-progress"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import uuid from "react-native-uuid"
import { fontFamilies, fonts } from "../../../../utils/theme"
import Card from "../../../components/Card"
import HorizontalPageView from "../../../components/HorizontalPageView"
import HintsView from "../Components/HintsView"
import ScrollableQuestion from "../Components/ScrollableQuestion"
import AnswerOptionsPhaseOne from "./AnswerOptionsPhaseOne"
import TeamFooter from "../../../../components/TeamFooter"
import { GameSessionState } from "@righton/networking"

const PhaseOneBasicGamePlay = ({
    gameSession,
    team,
    teamMember,
    score,
    totalScore,
    smallAvatar,
}) => {
    console.debug("team in Phase One:", team)

    smallAvatar = smallAvatar
        ? smallAvatar
        : require("../../SelectTeam/img/MonsterIcon1.png")

    const teamName = team?.name ? team?.name : "Team Name"

    score = score ? score : 10
    totalScore = team?.score ? team?.score : 0

    const question = gameSession?.isAdvanced
        ? team.question
        : gameSession?.questions[
              gameSession?.currentQuestionIndex == null
                  ? 0
                  : gameSession?.currentQuestionIndex
          ]

    const availableHints = question.instructions

    const phaseTime = gameSession?.phaseOneTime ?? 300

    const [currentTime, setCurrentTime] = useState(phaseTime)
    const [progress, setProgress] = useState(1)
    const [selectedAnswer, setSelectedAnswer] = useState(false)
    const [hints, setHints] = useState([availableHints])

    let countdown = useRef()

    useEffect(() => {
        // TODO: Disable answer selection when the timer is up
        // if (currentTime == 0) {
        //     navigateToNextScreen()
        //     return
        // }

        countdown.current = setInterval(() => {
            if (currentTime > 0) {
                setCurrentTime(currentTime - 1)
            }
            setProgress(currentTime / phaseTime)
        }, 1000)

        return () => {
            clearInterval(countdown.current)
        }
    }, [gameSession, currentTime])

    const submitAnswer = (answer) => {
        Alert.alert(
            "Are you sure?",
            "You will not be able to change your answer",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        global.apiClient
                            .addTeamAnswer(
                                teamMember.id,
                                question.id,
                                answer.text,
                                answer.isChosen ? null : true
                            )
                            .then((teamAnswer) => {
                                if (teamAnswer == null) {
                                    console.error(
                                        "Failed to create team Answer."
                                    )
                                    return
                                }

                                console.debug(
                                    "phase 1 team answer:",
                                    teamAnswer
                                )
                            })
                            .catch((error) => {
                                console.error(error.message)
                            })
                    },
                },
            ]
        )
    }

    const answersParsed = question.choices

    const answerChoices = answersParsed.map((choice) => {
        return {
            id: uuid.v4(),
            text: choice.text,
            isCorrectAnswer: choice.isAnswer,
        }
    })

    // if isCorrectAnswer is true, add 10 points to the team's score
    // this does not uppdate team score in the database yet
    const addPoints = (answer) => {
        if (answer.isCorrectAnswer) {
            team.score += 10
        }
    }

    const handleAnswerResult = (answer) => {
        setSelectedAnswer(answer)
        submitAnswer(answer)
        addPoints(answer)
    }

    const correctAnswer = answerChoices.find((answer) => answer.isCorrectAnswer)

    const hintsViewTitle = () => {
        if (selectedAnswer.isCorrectAnswer) {
            return `Correct! 
            
            ${correctAnswer.text} 
            is the correct answer.`
        } else {
            return `Nice Try! 
            
            ${correctAnswer.text}
            is the correct answer.`
        }
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={["rgba(62, 0, 172, 1)", "rgba(98, 0, 204, 1)"]}
                style={styles.headerContainer}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                {gameSession?.currentState ===
                GameSessionState.CHOOSE_CORRECT_ANSWER ? (
                    <>
                        <Text style={styles.headerText}>
                            Answer The Question
                        </Text>
                        <View style={styles.timerContainer}>
                            <Progress.Bar
                                style={styles.timerProgressBar}
                                progress={progress}
                                color={"#349E15"}
                                unfilledColor={"rgba(255,255,255,0.8)"}
                                width={
                                    Dimensions.get("window").width - scale(90)
                                }
                            />
                            <Text style={styles.timerText}>
                                {Math.floor(currentTime / 60)}:
                                {("0" + Math.floor(currentTime % 60)).slice(-2)}
                            </Text>
                        </View>
                    </>
                ) : null}
            </LinearGradient>
            <View style={styles.carouselContainer}>
                <HorizontalPageView>
                    <Card headerTitle="Question">
                        <ScrollableQuestion question={question} />
                    </Card>
                    <Card headerTitle="Answers">
                        <AnswerOptionsPhaseOne
                            isAdvancedMode={gameSession.isAdvanced}
                            isFacilitator={teamMember?.isFacilitator}
                            onAnswered={(answer) => {
                                handleAnswerResult(answer)
                            }}
                            answers={answerChoices.map((choice) => {
                                return choice
                            })}
                        />
                    </Card>
                    {gameSession?.currentState ===
                    GameSessionState.PHASE_1_DISCUSS ? (
                        <Card headerTitle={hintsViewTitle()}>
                            <HintsView hints={hints} />
                        </Card>
                    ) : null}
                </HorizontalPageView>
            </View>
            <View style={styles.footerView}>
                <TeamFooter
                    icon={smallAvatar}
                    name={teamName}
                    score={score}
                    totalScore={totalScore ? totalScore : 0}
                />
            </View>
        </SafeAreaView>
    )
}

export default PhaseOneBasicGamePlay

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "rgba(247,249,250,1)",
    },
    headerContainer: {
        height: verticalScale(225),
        shadowColor: "rgba(0, 141, 239, 0.3)",
    },
    headerText: {
        marginTop: scale(24),
        marginLeft: scale(50),
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.large,
        fontWeight: "bold",
        color: "white",
    },
    timerContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: scale(15),
        alignContent: "flex-start",
        alignItems: "flex-start",
        marginLeft: scale(30),
        marginRight: scale(21),
    },
    timerProgressBar: {
        marginRight: 9,
        marginTop: 5,
    },
    timerText: {
        color: "white",
        opacity: 0.8,
        fontSize: fonts.xSmall,
        fontFamily: fontFamilies.latoBold,
        fontWeight: "bold",
    },
    carouselContainer: {
        flex: 1,
        flexDirection: "column",
        marginBottom: 100,
        marginTop: -scale(150),
    },
    footerView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        marginBottom: verticalScale(18),
    },
})
