import React from "react"
import { StyleSheet, Text, View } from "react-native"
import sharedStyles from "../../Components/sharedStyles"
import { verticalScale } from "react-native-size-matters"
import RoundTextIcon from "../../../../components/RoundTextIcon"
import { KeyboardAwareFlatList } from "@codler/react-native-keyboard-aware-scroll-view"

const AnswerOptionsPhaseOne = ({ answers, selectedAnswerIndex, setSelectedAnswerIndex }) => {
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
                    data={answers}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item, index }) => (
                        <RoundTextIcon
                            style={[styles.answerItem]}
                            data={item}
                            icon={
                                index === selectedAnswerIndex
                                    ? require("../../img/Picked.png")
                                    : require("../../img/gray_circle.png")
                            }
                            text={item.text}
                            height={45}
                            borderColor={
                                index === selectedAnswerIndex ? "#159EFA" : "#D9DFE5"
                            }
                            onPress={() => setSelectedAnswerIndex(index)}
                            showIcon
                            readonly
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
