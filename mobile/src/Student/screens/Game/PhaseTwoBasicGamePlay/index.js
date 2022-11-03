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
import TeamFooter from "../../../../components/TeamFooter"
import { fontFamilies, fonts, fontWeights } from "../../../../utils/theme"
import Card from "../../../components/Card"
import RoundButton from "../../../../components/RoundButton"
import HorizontalPageView from "../../../components/HorizontalPageView"
import ScrollableQuestion from "../Components/ScrollableQuestion"
import AnswerOptionsPhaseTwo from "./AnswerOptionsPhaseTwo"

const DEFAULT_AVATAR = require("../../SelectTeam/img/MonsterIcon1.png")

const PhaseTwoBasicGamePlay = ({
    gameSession,
    team,
    teamMember,
    //score,
    //totalScore,
    smallAvatar = DEFAULT_AVATAR,
}) => {
    const phaseTime = gameSession?.phaseTwoTime ?? 300
    const [currentTime, setCurrentTime] = useState(phaseTime)
    const [progress, setProgress] = useState(1)
    const [submitted, setSubmitted] = useState(false)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)

    const teamName = team?.name ? team?.name : "Team Name"

    const score = score ? score : 10
    const totalScore = team?.score ? team?.score : 0

    const question = gameSession?.isAdvanced
        ? team.question
        : gameSession?.questions[
              gameSession?.currentQuestionIndex == null
                  ? 0
                  : gameSession?.currentQuestionIndex
          ]

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
        if (
            currentTime == 0 || // Out of time!
            // Game has moved on, so disable answering
            gameSession?.currentState !==
                GameSessionState.CHOOSE_TRICKIEST_ANSWER
        ) {
            setSubmitted(true)
        }

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
                        setSubmitted(true)
                        global.apiClient
                            .addTeamAnswer(
                                teamMember.id,
                                question.id,
                                answer.text,
                                answer.isChosen ? null : false,
                                true,
                                answer.isTrickAnswer ? null : false,
                                true
                            )
                            .then((teamAnswer) => {
                                if (teamAnswer == null) {
                                    console.error(
                                        "Failed to create team Answer."
                                    )
                                    return
                                }

                                console.debug(
                                    "phase 2 team answer:",
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

    const correctAnswer = answerChoices.find((answer) => answer.isCorrectAnswer)

    const submittedAnswerText = `Thank you for submitting!\n\nWaiting for your teacher to advance to the next section`

    let cards = [
        <Card headerTitle="Question">
            <ScrollableQuestion question={question} />
        </Card>,
        <View>
            <Card headerTitle="Answers">
                <AnswerOptionsPhaseTwo
                    isAdvancedMode={gameSession.isAdvanced}
                    isFacilitator={teamMember?.isFacilitator}
                    answers={answerChoices}
                    correctAnswer={correctAnswer}
                    selectedAnswerIndex={selectedAnswerIndex}
                    setSelectedAnswerIndex={setSelectedAnswerIndex}
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

    if (gameSession?.currentState === GameSessionState.PHASE_2_DISCUSS) {
        cards = wrongAnswers.map((answer) => (
            <Card
                key={answer.id}
                style={styles.headerText}
                headerTitle={`Wrong Answer Info ${answer.text}`}
            >
                <Card reasons={answer.reason}>
                    <Text>{answer.reason}</Text>
                </Card>
            </Card>
        ))
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
        height: verticalScale(200),
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
