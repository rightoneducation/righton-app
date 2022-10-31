import React, { useState } from "react"
import { StyleSheet, Text, View, Platform } from "react-native"
import sharedStyles from "../../Components/sharedStyles"
import { verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts, colors } from "../../../../../utils/theme"
import RoundTextIcon from "../../../../components/RoundTextIcon"
import { KeyboardAwareFlatList } from "@codler/react-native-keyboard-aware-scroll-view"

const AnswerOptionsPhaseOne = ({ onAnswered, answers }) => {
    const [currentAnswers, setCurrentAnswers] = useState(answers)

    const chooseAnswer = (selectedAnswer) => {
        const answerOptions = currentAnswers.map((answer) => {
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

        setCurrentAnswers(answerOptions)
        onAnswered(selectedAnswer)
    }

    return (
        <View style={[sharedStyles.cardContainer, styles.container]}>
            <Text style={[sharedStyles.text, { opacity: 1 }]}>
                Choose the <Text style={styles.correctAnswerText}>correct answer</Text>
            </Text>

            <View
                style={{
                    opacity: 1,
                    flex: 1,
                    alignSelf: "stretch",
                }}
            >
                <KeyboardAwareFlatList
                    style={[styles.answers]}
                    data={currentAnswers}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item }) => (
                        <RoundTextIcon
                            style={[styles.answerItem]}
                            icon={
                                item.isSelected
                                    ? require("../../img/checkmark_checked.png")
                                    : require("../../img/gray_circle.png")
                            }
                            text={item.text}
                            height={45}
                            borderColor={
                                item.isSelected ? "#159EFA" : "#D9DFE5"
                            }
                            onPress={chooseAnswer}
                            showIcon={item.isSelected}
                            readonly={true}
                            data={item}
                        />
                    )}
                />
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
    answers: {
        marginTop: verticalScale(15),
        alignSelf: "stretch",
    },
    answerItem: {
    },
    correctAnswerText: {
        color: '#349E15'
    }
})
