import { GameSessionState, isNullOrUndefined } from "@righton/networking"
import { useEffect, useRef, useState } from "react"
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import * as Progress from "react-native-progress"
import { color } from "react-native-reanimated"
import { scale, moderateScale, verticalScale } from "react-native-size-matters"
import uuid from "react-native-uuid"
import RoundButton from "../../../../components/RoundButton"
import TeamFooter from "../../../../components/TeamFooter"
import { colors, fontFamilies, fonts, fontWeights } from "../../../../utils/theme"
import Card from "../../../components/Card"
import HorizontalPageView from "../../../components/HorizontalPageView"
import ScrollableQuestion from "../Components/ScrollableQuestion"
import AnswerOptionsPhaseTwo from "./AnswerOptionsPhaseTwo"
import HintsView from "../Components/HintsView"
import RoundTextIcon from "../../../components/RoundTextIcon"

//finds the letter matching the index
const indexToLetter = (index) => {
    return String.fromCharCode(65 + index)
}

const PhaseTwoBasicGamePlay = ({
    gameSession,
    team,
    teamMember,
    score,
    totalScore,
    teamAvatar,
    selectedAnswerIndex,
    setSelectedAnswerIndex
}) => {
    const phaseTime = gameSession.phaseTwoTime
    const [currentTime, setCurrentTime] = useState(phaseTime)
    const [progress, setProgress] = useState(1)
    const [submitted, setSubmitted] = useState(false)


    const teamName = team?.name ? team?.name : "Team Name"

    score = score ? score : 10
    totalScore = team?.score ? team?.score : 0

    const question = gameSession.questions[
        isNullOrUndefined(gameSession.currentQuestionIndex)
            ? 0
            : gameSession?.currentQuestionIndex
    ]

    const answerChoices = question.choices.map((choice) => {
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
            gameSession.currentState !==
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
        const answer = answerChoices[selectedAnswerIndex]
        setSubmitted(true)
        global.apiClient
            .addTeamAnswer(
                teamMember.id,
                question.id,
                answer.text,
                answer.isChosen ? null : false,
                true
            )
            .then((teamAnswer) => {
                if (isNullOrUndefined(teamAnswer)) {
                    console.error(
                        "Failed to create team Answer."
                    )
                    return
                }

                console.debug(
                    "phase 2 team answer: ",
                    teamAnswer
                )
            })
            .catch((error) => {
                console.error(error.message)
            })
    }

    const correctAnswer = answerChoices.find((answer) => answer.isCorrectAnswer)
    const correctAnswerText = answerChoices.find(
        (answer) => answer.isCorrectAnswer
    )?.text
    const availableHints = question.instructions
    const submittedAnswerText = `Thank you for submitting!\n\nWaiting for your teacher to advance to the next section`

    const timerHeading =
        <>
            <Text style={styles.headerText}>
                Pick the Trickiest!
            </Text>
            <View style={styles.timerContainer}>
                <Progress.Bar
                    style={styles.timerProgressBar}
                    progress={progress}
                    color={"#349E15"}
                    height={"100%"}
                    unfilledColor={"#7819F8"}
                    width={
                        Dimensions.get("window").width - scale(90)
                    }
                    borderWidth={0}
                />
                <Text style={styles.timerText}>
                    {Math.floor(currentTime / 60)}:
                    {("0" + Math.floor(currentTime % 60)).slice(-2)}
                </Text>
            </View>
        </>

    const discussHeading =
        <>
            <Text style={styles.headerText}>
                Answer Explanations
            </Text>
        </>

    const questionScreen =
        <>
            <Text style={styles.cardHeadingText}>Question</Text>
            <Card>
                <ScrollableQuestion question={question} />
            </Card>
        </>

    const submitAnswerScreen =
        <View>
            <Text style={styles.cardHeadingText}>Answers</Text>
            <Card>
                <AnswerOptionsPhaseTwo
                    isAdvancedMode={gameSession.isAdvanced}
                    isFacilitator={teamMember?.isFacilitator}
                    selectedAnswerIndex={selectedAnswerIndex}
                    setSelectedAnswerIndex={setSelectedAnswerIndex}
                    answers={answerChoices}
                    disabled={submitted}
                    correctAnswer={correctAnswer}
                />
                {!submitted && (
                    <RoundButton
                        style={
                            (selectedAnswerIndex || selectedAnswerIndex === 0)
                                ? styles.answerChosen
                                : styles.submitAnswer
                        }
                        titleStyle={styles.submitAnswerText}
                        title="Submit Answer"
                        onPress={handleSubmitAnswer}
                        disabled={!selectedAnswerIndex && selectedAnswerIndex != 0}
                    />
                )}
                {submitted && (
                    <RoundButton
                        style={styles.submitAnswer}
                        titleStyle={styles.submitAnswerText}
                        title="Answer Submitted"
                        disabled={true}
                    />
                )}
            </Card>
            {submitted && (
                <Text style={styles.answerSubmittedText}>
                    {submittedAnswerText}
                </Text>
            )}
        </View>

    const correctAnswerScreen =
        <>
            <Card
                key={correctAnswer.id}
            >
                <ScrollableQuestion question={question} />
                <RoundTextIcon
                    icon={require("../img/checkmark_checked.png")}
                    text={`${indexToLetter(selectedAnswerIndex)}    ${correctAnswerText}`}
                    height={45}
                    marginHorizontal={scale(15)}
                    borderColor={"#EBFFDA"}
                    backgroundColor={"#EBFFDA"}
                    showIcon
                    readonly />
                <HintsView hints={availableHints} />
                <Text style={styles.reasonsText}>{correctAnswer.reason}</Text>
            </Card>
        </>

    const wrongAnswersScreen =
        <>
            {wrongAnswers.map((answer, index) => (
                <Card
                    key={answer.id}
                >
                    <View style={styles.roundContainerIncorrect}>
                        <Text style={styles.answerText}>{answer.text}</Text>
                        {index === selectedAnswerIndex &&
                            <Image source={require("../img/Picked.png")} />}
                    </View>
                    <Text style={styles.reasonsText}>{answer.reason}</Text>
                </Card>
            ))}
        </>

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
                        {timerHeading}
                    </>
                ) : null}
                {gameSession?.currentState ===
                    GameSessionState.PHASE_2_DISCUSS ? (
                    <>
                        {discussHeading}
                    </>
                ) : null}
            </LinearGradient>
            <View style={styles.carouselContainer}>
                {gameSession?.currentState ===
                    GameSessionState.CHOOSE_TRICKIEST_ANSWER ? (
                    <HorizontalPageView initialPage={0}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {questionScreen}
                        </ScrollView>
                        <ScrollView>
                            {submitAnswerScreen}
                        </ScrollView>
                    </HorizontalPageView>) : null}
                {gameSession?.currentState ===
                    GameSessionState.PHASE_2_DISCUSS ? (
                    <HorizontalPageView initialPage={1}>
                        <>
                            <Text style={styles.cardHeadingText}>Correct Answer</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {correctAnswerScreen}
                            </ScrollView>
                        </>
                        <>
                            <Text style={styles.cardHeadingText}>Wrong Answers</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {wrongAnswersScreen}
                            </ScrollView>
                        </>
                    </HorizontalPageView>) : null}
            </View>
            <View style={styles.footerView}>
                <TeamFooter
                    icon={teamAvatar.smallSrc}
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
        marginBottom: verticalScale(20)
    },
    headerText: {
        marginTop: verticalScale(24),
        textAlign: "center",
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.large,
        fontWeight: "bold",
        color: "white"
    },
    cardHeadingText: {
        marginBottom: verticalScale(19),
        textAlign: "center",
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.medium,
        fontWeight: "bold",
        color: "white",
    },
    answerTitle: {
        marginTop: scale(20),
    },
    answerChosen: {
        backgroundColor: "#159EFA",
        borderRadius: 22,
        height: 30,
        marginHorizontal: scale(40),
        marginBottom: verticalScale(20),
    },
    submitAnswer: {
        backgroundColor: "#808080",
        borderRadius: 22,
        height: 30,
        marginHorizontal: scale(40),
        marginBottom: verticalScale(20),
    },
    submitAnswerText: {
        fontSize: fonts.xxMedium,
    },
    answerSubmittedText: {
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.small,
        fontWeight: fontWeights.extraBold,
        textAlign: "center",
        marginHorizontal: scale(20),
        marginVertical: verticalScale(20),
        marginTop: verticalScale(10)
    },
    timerContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: scale(5),
        alignContent: "flex-start",
        alignItems: "flex-start",
        justifyContent: "center"
    },
    timerProgressBar: {
        marginTop: verticalScale(5),
        height: verticalScale(13),
        borderRadius: 9,
    },
    timerText: {
        color: "white",
        opacity: 0.8,
        fontSize: fonts.xSmall,
        fontFamily: fontFamilies.latoBold,
        fontWeight: "bold",
        marginLeft: scale(5),
        marginTop: scale(5)
    },
    carouselContainer: {
        flex: 1,
        flexDirection: "column",
        marginBottom: verticalScale(50),
        marginTop: -verticalScale(140),
    },
    footerView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        marginBottom: verticalScale(18),
    },
    reasonsText: {
        marginVertical: verticalScale(10),
        marginHorizontal: scale(15),
        fontFamily: fontFamilies.karla
    },
    answersText: {
        fontFamily: fontFamilies.karla,
        padding: scale(6)
    },
    correctAnswerText: {
        fontFamily: fontFamilies.karla,
        padding: scale(6)
    },
    roundContainerCorrect: {
        borderRadius: 22,
        backgroundColor: "#EBFFDA",
        borderColor: "#EBFFDA",
        borderWidth: 4,
        marginHorizontal: scale(15),
        paddingVertical: verticalScale(2),
        paddingHorizontal: scale(8)
    },
    roundContainerIncorrect: {
        borderRadius: 22,
        backgroundColor: "#F4F4F4",
        borderColor: "#F4F4F4",
        borderWidth: 4,
        marginHorizontal: scale(12),
        marginVertical: verticalScale(8),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(8),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
})
