import React, { useState } from "react"
import { StyleSheet, Text, View, TextInput, Platform } from "react-native"
import sharedStyles from "../../Components/sharedStyles"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts, colors } from "../../../../../utils/theme"
import RoundTextIcon from "../../../../components/RoundTextIcon"
import { KeyboardAwareFlatList } from "@codler/react-native-keyboard-aware-scroll-view"
import uuid from "react-native-uuid"

const AnswerOptionsPhaseOne = ({
    onAnswered,
    isFacilitator,
    isAdvancedMode,
    answers,
}) => {
    const Status = {
        none: "none",
        hasAnsweredCorrectly: "answered",
        hasAnsweredIncorrectly: "incorrectAnswer",
        basicMode: "basicMode",
    }
    const [estimatedAnswer, setEstimatedAnswer] = useState("")
    const [showTrickAnswers, setShowTrickAnswers] = useState(false)
    const [trickAnswers, setTrickAnswers] = useState(answers)
    const [status, setStatus] = useState(
        isAdvancedMode ? Status.none : Status.basicMode
    )
    const [answer, setAnswer] = useState(undefined)

    const createAnswer = (text) => {
        return {
            id: uuid.v4(),
            text: text,
        }
    }

    const isItemReadOnly = (item) => {
        if (status == Status.hasAnsweredCorrectly) {
            return item.id != trickAnswers[trickAnswers.length - 1].id
        }

        return true
    }

    const onAnswerSubmitted = (event) => {
        const text = event.nativeEvent.text
        const newAnswer = createAnswer(text)
        if (newAnswer.text == "1080") {
            setAnswer(newAnswer)
            setStatus(Status.hasAnsweredCorrectly)
            if (onAnswered !== undefined) {
                onAnswered(newAnswer)
            }
            setTrickAnswers([...trickAnswers, createAnswer("")])
            startTrickAnswersTimer()
            return
        }

        setEstimatedAnswer("")
        setTrickAnswers([...trickAnswers, newAnswer])

        if (status == Status.none) {
            setStatus(Status.hasAnsweredIncorrectly)
            startTrickAnswersTimer()
        }
    }

    const toggleAnswer = (answer) => {
        if (!isFacilitator) {
            return
        }

        const modifiedTrickAnswers = trickAnswers.map((a) => {
            if (a.id === answer.id) {
                return {
                    ...a,
                    isSelected:
                        a.isSelected || (a.length < 3 && a.text !== "")
                            ? !a.isSelected
                            : a.isSelected,
                }
            }
            return a
        })

        setTrickAnswers(modifiedTrickAnswers)
        onAnswered(answer)
        console.debug(trickAnswers)
    }

    const onTrickyAnswerChanged = (answerId, newText) => {
        if (status != Status.hasAnsweredCorrectly) {
            return
        }
        const index = trickAnswers.findIndex((answer) => answer.id == answerId)
        trickAnswers[index].text = newText
        if (index == trickAnswers.length - 1) {
            setTrickAnswers([...trickAnswers, createAnswer("")])
        } else {
            setTrickAnswers(trickAnswers)
        }
    }

    const startTrickAnswersTimer = () => {
        setTimeout(() => {
            setShowTrickAnswers(true)
        }, 3000)
    }

    const chooseAnswer = (selectedAnswer) => {
        const modifiedTrickAnswers = trickAnswers.map((answer) => {
            if (answer.id === selectedAnswer.id) {
                return {
                    ...answer,
                    isSelected: true,
                }
            } else {
                answer.isSelected = false
            }
            return answer
        })

        setTrickAnswers(modifiedTrickAnswers)
        onAnswered(selectedAnswer)
    }

    return (
        <View style={[sharedStyles.cardContainer, styles.container]}>
            <Text
                style={[
                    sharedStyles.text,
                    { opacity: status == Status.none ? 1 : 0.3 },
                ]}
            >
                {isFacilitator && status !== Status.basicMode
                    ? "Help guide your team to guess the correct answer!"
                    : "Choose the correct answer"}
            </Text>
            {status !== Status.basicMode && (
                <TextInput
                    style={[
                        styles.answerTextInput,
                        {
                            backgroundColor:
                                status == Status.hasAnsweredCorrectly
                                    ? "#D7EFC3"
                                    : "white",
                        },
                    ]}
                    value={estimatedAnswer}
                    onChangeText={(text) => setEstimatedAnswer(text)}
                    onSubmitEditing={onAnswerSubmitted}
                    editable={status != Status.hasAnsweredCorrectly}
                />
            )}
            <View
                style={{
                    opacity: status == Status.none ? 0 : 1,
                    flex: 1,
                    alignSelf: "stretch",
                }}
            >
                {isFacilitator &&
                    (status == Status.hasAnsweredCorrectly ||
                        status == Status.hasAnsweredCorrectly) && (
                        <Text style={sharedStyles.text}>
                            Pick your team’s favorite 3 to trick your class.
                        </Text>
                    )}
                {!isFacilitator && status == Status.hasAnsweredCorrectly && (
                    <Text
                        style={[
                            sharedStyles.text,
                            {
                                opacity: showTrickAnswers > 0 ? 0.3 : 1,
                            },
                        ]}
                    >
                        Nice job, that’s right!
                    </Text>
                )}
                {!isFacilitator &&
                    status == Status.hasAnsweredCorrectly &&
                    !showTrickAnswers && (
                        <Text style={sharedStyles.text}>
                            This unlocks the Hints for your team.
                        </Text>
                    )}
                {!isFacilitator && status == Status.hasAnsweredIncorrectly && (
                    <Text style={sharedStyles.text}>
                        Nice try! That’s not the correct answer, but it sounds
                        like a great trick answer! We’ve added it to your list
                        of trick answers!
                    </Text>
                )}
                {!isFacilitator &&
                    status == Status.hasAnsweredCorrectly &&
                    showTrickAnswers && (
                        <Text
                            Text
                            style={[sharedStyles.text, { marginTop: 10 }]}
                        >
                            Now come up with other answers that might trick your
                            class!
                        </Text>
                    )}
                {status === Status.basicMode && (
                    <KeyboardAwareFlatList
                        style={[styles.answers]}
                        data={trickAnswers}
                        extraData={trickAnswers}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={({ item }) => (
                            <RoundTextIcon
                                icon={
                                    item.isSelected
                                        ? require("../../img/checkmark_checked.png")
                                        : require("../../img/gray_circle.png")
                                }
                                text={item.text}
                                height={43}
                                borderColor={
                                    item.isSelected ? "#236AF7" : "#D9DFE5"
                                }
                                onPress={chooseAnswer}
                                disabled={item.isSelected}
                                showIcon={item.isSelected}
                                readonly={true}
                                data={item}
                            />
                        )}
                    />
                )}
                {/* //TODO: Handle advance mode */}
                {status !== Status.basicMode && (
                    <KeyboardAwareFlatList
                        style={[
                            styles.answers,
                            { opacity: showTrickAnswers ? 1 : 0 },
                        ]}
                        data={trickAnswers}
                        extraData={trickAnswers}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={({ item }) => (
                            <RoundTextIcon
                                icon={
                                    item.isSelected
                                        ? require("../../img/checkmark_checked.png")
                                        : require("../../img/gray_circle.png")
                                }
                                text={item.text}
                                height={43}
                                borderColor={
                                    item.isSelected ? "#8DCD53" : "#D9DFE5"
                                }
                                onPress={toggleAnswer}
                                showIcon={isFacilitator && isItemReadOnly(item)}
                                readonly={isItemReadOnly(item)}
                                data={item}
                                onTextChanged={onTrickyAnswerChanged}
                            />
                        )}
                    />
                )}
            </View>
        </View>
    )
}

export default AnswerOptionsPhaseOne

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "space-between",
    },
    answerTextInput: {
        borderRadius: 8,
        marginTop: verticalScale(8),
        textAlign: "center",
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
        marginBottom: verticalScale(8),
        borderColor: "#B1BACB",
        borderWidth: 1,
        alignSelf: "stretch",
        ...Platform.select({
            ios: {
                height: 43,
            },
        }),
    },
    trickAnswerInput: {
        borderWidth: 2,
        borderRadius: 22,
        marginBottom: 10,
        paddingLeft: 20,
        height: 43,
    },
    answers: {
        marginTop: verticalScale(15),
        alignSelf: "stretch",
    },
})
