import { GameSessionState } from "@righton/networking"
import { useEffect, useRef, useState } from "react"
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import * as Progress from "react-native-progress"
import { scale, verticalScale } from "react-native-size-matters"
import uuid from "react-native-uuid"
import RoundButton from "../../../../components/RoundButton"
import TeamFooter from "../../../../components/TeamFooter"
import { fontFamilies, fonts, fontWeights } from "../../../../utils/theme"
import Card from "../../../components/Card"
import HorizontalPageView from "../../../components/HorizontalPageView"
import HintsView from "../Components/HintsView"
import ScrollableQuestion from "../Components/ScrollableQuestion"
import AnswerOptionsPhaseOne from "./AnswerOptionsPhaseOne"

const DEFAULT_AVATAR = require("../../SelectTeam/img/MonsterIcon1.png")

const PhaseOneBasicGamePlay = ({
    gameSession,
    team,
    teamMember,
    smallAvatar = DEFAULT_AVATAR,
}) => {
    const phaseTime = gameSession?.phaseOneTime ?? 300
    const [currentTime, setCurrentTime] = useState(phaseTime)
    const [progress, setProgress] = useState(1)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    let countdown = useRef()

    const teamName = team?.name ? team?.name : "Team Name"
    const totalScore = team?.score ? team?.score : 0

    const question = gameSession?.isAdvanced
        ? team.question
        : gameSession?.questions[
              gameSession?.currentQuestionIndex == null
                  ? 0
                  : gameSession?.currentQuestionIndex
          ]

    const availableHints = question.instructions

    useEffect(() => {
        if (
            currentTime == 0 || // Out of time!
            // Game has moved on, so disable answering
            gameSession?.currentState !== GameSessionState.CHOOSE_CORRECT_ANSWER
        ) {
            setSubmitted(true)
        }

        countdown.current = setInterval(() => {
            if (currentTime > 0) {
                setCurrentTime(currentTime - 1)
            }
            setProgress((currentTime - 1) / phaseTime)
        }, 1000)

        return () => {
            clearInterval(countdown.current)
        }
    }, [gameSession, currentTime])

    const handleSubmitAnswer = () => {
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
                        const answer = answerChoices[selectedAnswerIndex]
                        // if isCorrectAnswer is true, add 10 points to the team's score
                        // this does not uppdate team score in the database yet
                        if (answer.isCorrectAnswer && team) {
                            team.score += 10
                        }
                        setSubmitted(true)
                        global.apiClient
                            .addTeamAnswer(
                                teamMember.id,
                                question.id,
                                answer.text,
                                answer.isChosen ? null : true,
                                false
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

    const correctAnswerText = answerChoices.find(
        (answer) => answer.isCorrectAnswer
    )?.text

    const hintsViewTitle = () => {
        if (answerChoices[selectedAnswerIndex]?.isCorrectAnswer) {
            return `Correct!\n${correctAnswerText}\nis the correct answer.`
        } else {
            return `Nice Try!\n${correctAnswerText}\nis the correct answer.`
        }
    }

    const submittedAnswerText = `Thank you for submitting!\n\nThink about which answers you might have been unsure about.`

    let cards = [
        <Card headerTitle="Question">
            <ScrollableQuestion question={question} />
        </Card>,
        <View>
            <Card headerTitle="Answers">
                <AnswerOptionsPhaseOne
                    isAdvancedMode={gameSession.isAdvanced}
                    isFacilitator={teamMember?.isFacilitator}
                    selectedAnswerIndex={selectedAnswerIndex}
                    setSelectedAnswerIndex={setSelectedAnswerIndex}
                    answers={answerChoices}
                    disabled={submitted}
                />
                {!submitted && (
                    <RoundButton
                        style={styles.submitAnswer}
                        titleStyle={styles.submitAnswerText}
                        title="Submit Answer"
                        onPress={handleSubmitAnswer}
                    />
                )}
            </Card>
            {submitted && (
                <Text style={styles.answerSubmittedText}>
                    {submittedAnswerText}
                </Text>
            )}
        </View>,
    ]

    if (gameSession.currentState === GameSessionState.PHASE_1_DISCUSS) {
        const hintCard = (
            <Card headerTitle={hintsViewTitle()}>
                <HintsView hints={availableHints} />
            </Card>
        )
        cards = [hintCard]
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
                {cards.length > 1 ? (
                    <HorizontalPageView>{cards}</HorizontalPageView>
                ) : (
                    cards[0]
                )}
            </View>
            <View style={styles.footerView}>
                <TeamFooter
                    icon={smallAvatar}
                    name={teamName}
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
        textAlign: "center",
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.large,
        fontWeight: "bold",
        color: "white",
    },
    submitAnswer: {
        backgroundColor: "#159EFA",
        borderRadius: 22,
        height: 44,
        marginHorizontal: scale(40),
        marginBottom: scale(40),
    },
    submitAnswerText: {
        fontSize: 18,
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
    answerSubmittedText: {
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.small,
        fontWeight: fontWeights.extraBold,
        textAlign: "center",
        marginHorizontal: scale(20),
        marginVertical: scale(20),
    },
    carouselContainer: {
        flex: 1,
        flexDirection: "column",
        marginBottom: 100,
        marginTop: -scale(150),
        marginBottom: scale(50),
    },
    footerView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        marginBottom: verticalScale(18),
    },
})
