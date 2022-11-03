import React from "react"
import { StyleSheet, Text, View } from "react-native"
import sharedStyles from "../../Components/sharedStyles"
import { verticalScale } from "react-native-size-matters"
import RoundTextIcon from "../../../../components/RoundTextIcon"
import { KeyboardAwareFlatList } from "@codler/react-native-keyboard-aware-scroll-view"

const AnswerOptionsPhaseTwo = ({
    answers,
    disabled = false,
    selectedAnswerIndex,
    setSelectedAnswerIndex,
    correctAnswer,
}) => {
    return (
        <View style={[sharedStyles.cardContainer, styles.container]}>
            <Text style={[sharedStyles.text, { opacity: disabled ? 0.3 : 1 }]}>
                What do you think is the most popular
                <Text style={styles.incorrectAnswerText}>
                    {" "}
                    incorrect answer{" "}
                </Text>
                among your class?
            </Text>
            <View
                style={{
                    opacity: disabled ? 0.3 : 1,
                    flex: 1,
                    alignSelf: "stretch",
                }}
            >
                <KeyboardAwareFlatList
                    style={[styles.answers]}
                    data={answers}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item, index }) => (
                        <RoundTextIcon
                            style={
                                ([styles.answerItem],
                                {
                                    opacity:
                                        item.text === correctAnswer.text
                                            ? 0.3
                                            : 1,
                                })
                            }
                            icon={
                                index === selectedAnswerIndex
                                    ? require("../../img/Picked.png")
                                    : require("../../img/gray_circle.png")
                            }
                            text={item.text}
                            height={45}
                            borderColor={
                                index === selectedAnswerIndex
                                    ? "#159EFA"
                                    : "#D9DFE5"
                            }
                            onPress={() => setSelectedAnswerIndex(index)}
                            showIcon
                            readonly
                            disabled={
                                disabled || item.text === correctAnswer.text
                            }
                        />
                    )}
                />
            </View>
        </View>
    )
}

export default AnswerOptionsPhaseTwo

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "space-between",
    },
    answers: {
        marginTop: verticalScale(15),
        alignSelf: "stretch",
    },
    incorrectAnswerText: {
        color: "#FC0505",
    },
})
