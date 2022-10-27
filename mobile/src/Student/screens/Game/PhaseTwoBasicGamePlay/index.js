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
import ScrollableQuestion from "../Components/ScrollableQuestion"
import AnswerOptionsPhaseTwo from "./AnswerOptionsPhaseTwo"
import TeamFooter from "../../../../components/TeamFooter"
import { GameSessionState } from "@righton/networking"

const PhaseTwoBasicGamePlay = ({
    gameSession,
    teamId,
    teamMember,
    score,
    totalScore,
    smallAvatar,
}) => {
    const team = gameSession?.teams.find((team) => team.id === teamId)
    console.debug("team in Phase Two:", team)

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

    const phaseTime = gameSession?.phaseTwoTime

    const [currentTime, setCurrentTime] = useState(phaseTime)
    const [progress, setProgress] = useState(1)
    const [selectedAnswer, setSelectedAnswer] = useState(false)

    const answersParsed = question.choices

    const answerChoices = answersParsed.map((choice) => {
        return {
            id: uuid.v4(),
            text: choice.text,
            isCorrectAnswer: choice.isAnswer,
            reason: choice.reason,
        }
    })

    const wrongAnswers = answerChoices.filter(
        (answer) => !answer.isCorrectAnswer
    )

    let countdown = useRef()

    useEffect(() => {
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
                                answer.isChosen ? null : false
                            )
                            .then((teamAnswer) => {
                                if (teamAnswer == null) {
                                    console.error(
                                        "Failed to create team Answer."
                                    )
                                    return
                                }
                                setSelectedAnswer(answer)
                                console.debug("this is team answer", teamAnswer)
                            })
                            .catch((error) => {
                                console.error(error.message)
                            })
                    },
                },
            ]
        )
    }

    const handleAnswerResult = (answer) => {
        submitAnswer(answer)
    }

    const correctAnswer = answerChoices.find((answer) => answer.isCorrectAnswer)

    //wip. need to render each card to a seperate carousel page
    const wrongAnswerCards = wrongAnswers.map((answer) => {
        return (
            <Card
                key={answer.id}
                style={styles.headerText}
                headerTitle={`Wrong Answer Info ${answer.text}`}
            >
                <Card reasons={answer.reason}>
                    <Text>{answer.reason}</Text>
                </Card>
            </Card>
        )
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={["rgba(62, 0, 172, 1)", "rgba(98, 0, 204, 1)"]}
                style={styles.headerContainer}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                {gameSession?.currentState ===
                GameSessionState.CHOOSE_TRICKIEST_ANSWER ? (
                    <>
                        <Text style={styles.headerText}>
                            Pick the Trickiest!
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
                        <AnswerOptionsPhaseTwo
                            isAdvancedMode={gameSession.isAdvanced}
                            isFacilitator={teamMember?.isFacilitator}
                            onAnswered={(answer) => {
                                handleAnswerResult(answer)
                            }}
                            answers={answerChoices.map((choice) => {
                                return choice
                            })}
                            isCorrectAnswer={correctAnswer.isCorrectAnswer}
                            gameSession={gameSession}
                        />
                    </Card>
                    {gameSession?.currentState ===
                    GameSessionState.PHASE_2_DISCUSS
                        ? wrongAnswerCards
                        : null}
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

export default PhaseTwoBasicGamePlay

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
