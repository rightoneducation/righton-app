import { GameSessionState } from "@righton/networking"
import { useEffect, useState } from "react"
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import * as Progress from "react-native-progress"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import uuid from "react-native-uuid"
import { fontFamilies, fonts } from "../../../../utils/theme"
import Card from "../../../components/Card"
import HorizontalPageView from "../../../components/HorizontalPageView"
import TeamsReadinessFooter from "../../../components/TeamsReadinessFooter"
import HintsView from "../Components/HintsView"
import ScrollableQuestion from "../Components/ScrollableQuestion"
import Spinner from "./Spinner"
import TrickAnswers from "./TrickAnswers"

const GamePreview = ({ navigation, route }) => {
    const { gameSession, team, teamMember } = route.params

    const question = gameSession.isAdvanced
        ? team.question
        : gameSession.questions[
        gameSession.currentQuestionIndex == null
            ? 0
            : gameSession.currentQuestionIndex
        ]
    const availableHints = question.instructions

    const [countdown, setCountdown] = useState(300)
    const [progress, setProgress] = useState(1)
    const [showTrickAnswersHint, setShowTrickAnswersHint] = useState(false)
    const [hints, setHints] = useState([availableHints[0]])

    useEffect(() => {
        if (countdown == 0) {
            navigateToNextScreen()
            return
        }
        const totalNoSecondsLeftForShowingHints = 295
        var refreshIntervalId = setInterval(() => {
            setCountdown(countdown - 1)
            setProgress(countdown / 300)
            setShowTrickAnswersHint(
                countdown <= totalNoSecondsLeftForShowingHints
            )
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
            clearInterval(refreshIntervalId)
            subscription.unsubscribe()
        }
    })

    const navigateToNextScreen = () => {
        navigation.navigate("Leaderboard")
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
                        {Math.floor(countdown / 60)}:
                        {("0" + Math.floor(countdown % 60)).slice(-2)}
                    </Text>
                </View>
            </LinearGradient>
            <View style={styles.carouselContainer}>
                <HorizontalPageView>
                    <Card headerTitle="Question">
                        <ScrollableQuestion question={question} />
                    </Card>
                    <Card headerTitle="Trick Answers">
                        <TrickAnswers
                            isAdvancedMode={gameSession.isAdvanced}
                            isFacilitator={teamMember.isFacilitator}
                            onAnswered={(answer) => {
                                showAllHints()
                                submitAnswer(answer)
                            }}
                            answers={
                                gameSession.isAdvanced
                                    ? []
                                    : [
                                        ...question.wrongAnswers.map(
                                            (a) => a.wrongAnswer
                                        ),
                                        question.answer,
                                    ].map((a) => {
                                        return {
                                            id: uuid.v4(),
                                            text: a,
                                            isSelected: false,
                                            isCorrectAnswer:
                                                a == question.answer,
                                        }
                                    })
                            }
                        />
                    </Card>
                    {gameSession.isAdvanced ? (
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
                    ) : null}
                </HorizontalPageView>
            </View>
            {gameSession.isAdvancedMode ? (
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
            ) : null}
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
        marginLeft: scale(30),
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
        marginTop: -scale(75),
    },
    footer: {
        marginBottom: moderateScale(30),
    },
})
