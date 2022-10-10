import React, { useState, useEffect, useRef } from "react"
import { StyleSheet, Text, View, Dimensions, SafeAreaView } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { scale, moderateScale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts } from "../../../../utils/theme"
import * as Progress from "react-native-progress"
import TeamsReadinessFooter from "../../../components/TeamsReadinessFooter"
import HorizontalPageView from "../../../components/HorizontalPageView"
import Card from "../../../components/Card"
import Spinner from "./Spinner"
import ScrollableQuestion from "../Components/ScrollableQuestion"
import AnswerOptions from "./AnswerOptions"
import HintsView from "../Components/HintsView"
import { GameSessionState } from "@righton/networking"
import uuid from "react-native-uuid"

const GamePreview = ({ navigation, team, gameSession, teamMember }) => {
    const question = gameSession.isAdvanced
        ? team.question
        : gameSession.questions[
              gameSession.currentQuestionIndex == null
                  ? 0
                  : gameSession.currentQuestionIndex
          ]
    const availableHints = question.instructions

    const phaseTime = gameSession?.phaseOneTime

    const [currentTime, setCurrentTime] = useState(phaseTime)
    const [progress, setProgress] = useState(1)

    let countdown = useRef()

    useEffect(() => {
        if (currentTime == 0) {
            navigateToNextScreen()
            return
        }

        countdown.current = setInterval(() => {
            if (currentTime > 0) {
                setCurrentTime(currentTime - 1)
            }
            setProgress(currentTime / phaseTime)
        }, 1000)

        const subscription = apiClient.subscribeUpdateGameSession(
            gameSession.id,
            (gameSession) => {
                if (
                    gameSession.currentState ===
                    GameSessionState.CHOOSE_TRICKIEST_ANSWER
                ) {
                    navigateToNextScreen()
                }
            }
        )

        return () => {
            clearInterval(countdown.current)
            subscription.unsubscribe()
        }
    })

    const navigateToNextScreen = () => {
        navigation.navigate("Leadership", {
            gameSession,
            team,
            teamMember,
            question,
        })
    }

    const showNewHint = () => {
        if (hints.length == availableHints.length) {
            return
        }
        setHints([...hints, availableHints[hints.length]])
    }

    const showAllHints = () => {
        setShowTrickAnswersHint(true)
        setHints(availableHints)
    }

    const submitAnswer = (answer) => {
        global.apiClient
            .addTeamAnswer(
                teamMember.id,
                question.id,
                answer.text,
                answer.isSelected
            )
            .then((teamAnswer) => {
                if (teamAnswer == null) {
                    console.error("Failed to create team.")
                    return
                }
                console.log(teamAnswer)
            })
            .catch((error) => {
                console.error(error.message)
            })
        if (!gameSession.isAdvancedMode) {
            navigateToNextScreen()
        }
    }

    const answersParsed = JSON.parse(question.choices)

    const answerChoices = answersParsed.map((choice) => {
        return choice.text
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={["rgba(62, 0, 172, 1)", "rgba(98, 0, 204, 1)"]}
                style={styles.headerContainer}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.headerText}>Answer The Question</Text>
                <View style={styles.timerContainer}>
                    <Progress.Bar
                        style={styles.timerProgressBar}
                        progress={progress}
                        color={"#349E15"}
                        unfilledColor={"rgba(255,255,255,0.8)"}
                        width={Dimensions.get("window").width - scale(90)}
                    />
                    <Text style={styles.timerText}>
                        {Math.floor(currentTime / 60)}:
                        {("0" + Math.floor(currentTime % 60)).slice(-2)}
                    </Text>
                </View>
            </LinearGradient>
            <View style={styles.carouselContainer}>
                <HorizontalPageView>
                    <Card headerTitle="Question">
                        <ScrollableQuestion question={question} />
                    </Card>
                    <Card headerTitle="Answers">
                        <AnswerOptions
                            isAdvancedMode={gameSession.isAdvanced}
                            isFacilitator={teamMember?.isFacilitator}
                            onAnswered={(answer) => {
                                showAllHints()
                                submitAnswer(answer)
                            }}
                            answers={answerChoices.map((choice) => {
                                return {
                                    id: uuid.v4(),
                                    text: choice,
                                    isSelected: false,
                                }
                            })}
                        />
                    </Card>
                    {gameSession.isAdvanced && (
                        <Card headerTitle="Hints">
                            {showTrickAnswersHint ? (
                                <HintsView
                                    hints={hints}
                                    onTappedShowNextHint={() => showNewHint()}
                                    isMoreHintsAvailable={
                                        hints.length < availableHints.length
                                    }
                                />
                            ) : (
                                <Spinner text="Hints will be available after one minute." />
                            )}
                        </Card>
                    )}
                </HorizontalPageView>
            </View>
            {gameSession.isAdvancedMode && (
                <TeamsReadinessFooter
                    style={styles.footer}
                    onTappedFirst={() => {
                        navigation.navigate("TeamInfo", {
                            availableHints,
                            answeringOwnQuestion: true,
                            team: 1,
                        })
                    }}
                    onTappedLast={() => {
                        navigation.navigate("TeamInfo", {
                            availableHints,
                            answeringOwnQuestion: false,
                            team: 5,
                        })
                    }}
                />
            )}
        </SafeAreaView>
    )
}

export default GamePreview

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
        marginBottom: 10,
        marginTop: -scale(150),
    },
    footer: {
        marginBottom: moderateScale(30),
    },
})
