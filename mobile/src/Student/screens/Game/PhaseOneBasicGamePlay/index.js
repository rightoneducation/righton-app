import { GameSessionState } from "@righton/networking"
import { useEffect, useRef, useState } from "react"
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View
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
import RoundTextIcon from "../../../components/RoundTextIcon"
import AnswerOptions from "../Components/AnswerOptions"
import HintsView from "../Components/HintsView"
import Question from "../Components/Question"
import ScrollableQuestion from "../Components/ScrollableQuestion"
import sharedStyles from "../Components/sharedStyles"

//finds the letter matching the index
const indexToLetter = (index) => {
    return String.fromCharCode(65 + index)
}
const PhaseOneBasicGamePlay = ({
    gameSession,
    team,
    teamMember,
    teamAvatar,
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
        const answer = answerChoices[selectedAnswerIndex]
        // if isCorrectAnswer is true, add 10 points to the team's score
        // this does not update team score in the database yet
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
    const submittedAnswerText = `Thank you for submitting!\n\nThink about which answers you might have been unsure about.`

    let cards = [
        <>
            <Text style={styles.cardHeadingText}>Question</Text>
            <Card headerTitle="Question" key={"question"}>
                <ScrollableQuestion question={question} />
            </Card>
        </>,
        <View key={"answers"}>
            <Text style={styles.cardHeadingText}>Answers</Text>
            <Card headerTitle="Answers">
                <Text style={[sharedStyles.text, styles.answerTitle]}>
                    Choose the <Text style={styles.correctAnswerText}>correct answer</Text>
                </Text>
                <AnswerOptions
                    isAdvancedMode={gameSession.isAdvanced}
                    isFacilitator={teamMember?.isFacilitator}
                    selectedAnswerIndex={selectedAnswerIndex}
                    setSelectedAnswerIndex={setSelectedAnswerIndex}
                    answers={answerChoices}
                    disabled={submitted}
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
                        disabled={!selectedAnswerIndex}
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
        </View>,
    ]

    if (gameSession.currentState === GameSessionState.PHASE_1_DISCUSS) {
        const hintCard = (
            <View style={styles.hintsView}>
                <Text style={styles.hintsViewTitle}>{answerChoices[selectedAnswerIndex]?.isCorrectAnswer ? 'Correct!' : 'Nice Try!'}</Text>
                <Text style={styles.hintsViewCorrectAnswer}>The correct answer is:</Text>
                <Text style={styles.hintsViewCorrectAnswer}>{correctAnswerText}</Text>
                {availableHints && availableHints.length > 0 && (
                    <Card extraStyle={styles.hintsViewCard}>
                        <Question question={question} style={styles.hintsViewQuestion} />
                        <HintsView hints={availableHints} />
                    </Card>
                )}
            </View>
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
                            Answer the Question
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
                ) : null}
            </LinearGradient>
            <View style={styles.carouselContainer}>
                {cards.length > 1 ? (
                    <HorizontalPageView>
                        {cards}
                    </HorizontalPageView>
                ) : (
                    cards[0]
                )}
            </View>
            <View style={styles.footerView}>
                <TeamFooter
                    icon={teamAvatar.smallSrc}
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
        marginTop: verticalScale(14),
        textAlign: "center",
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.large,
        fontWeight: "bold",
        color: "white",
    },
    answerTitle: {
        marginTop: verticalScale(20),
    },
    correctAnswerText: {
        color: '#349E15'
    },
    answerChosen: {
        backgroundColor: "#159EFA",
        borderRadius: 22,
        height: 30,
        marginHorizontal: scale(40),
        marginBottom: verticalScale(40),
    },
    submitAnswer: {
        backgroundColor: "#808080",
        borderRadius: 22,
        height: 30,
        marginHorizontal: scale(40),
        marginBottom: verticalScale(40),
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
        marginTop: -verticalScale(25)
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
    answerSubmittedText: {
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.small,
        fontWeight: fontWeights.extraBold,
        textAlign: "center",
        marginHorizontal: scale(20),
        marginVertical: verticalScale(20),
    },
    hintsView: {
        marginTop: -verticalScale(60),
    },
    hintsViewTitle: {
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.semiLarge,
        color: 'white',
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },
    hintsViewCorrectAnswer: {
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.xxMedium,
        color: 'white',
        textAlign: 'center',
    },
    hintsViewCard: {
        marginTop: -verticalScale(40),
        paddingVertical: 0,
        maxHeight: verticalScale(400)
    },
    hintsViewQuestion: {
        paddingVertical: verticalScale(30)
    },
    carouselContainer: {
        flex: 1,
        flexDirection: "column",
        marginBottom: verticalScale(10),
        marginTop: -verticalScale(150),
        marginBottom: scale(50),
    },
    footerView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        marginBottom: verticalScale(18),
    },
    cardHeadingText: {
        marginVertical: verticalScale(9),
        textAlign: "center",
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.medium,
        fontWeight: "bold",
        color: "white",
    },
})
