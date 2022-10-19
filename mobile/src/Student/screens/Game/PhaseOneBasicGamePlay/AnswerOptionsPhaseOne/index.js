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
                Choose the correct answer
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
                    extraData={currentAnswers}
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
