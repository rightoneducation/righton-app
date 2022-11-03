import React from "react"
import { StyleSheet, View } from "react-native"
import { verticalScale } from "react-native-size-matters"
import { KeyboardAwareFlatList } from "@codler/react-native-keyboard-aware-scroll-view"
import sharedStyles from "./sharedStyles"
import RoundTextIcon from "../../../components/RoundTextIcon"

const indexToLetter = (index) => {
    return String.fromCharCode(65 + index)
}

const AnswerOptions = ({
    answers,
    disabled = false,
    selectedAnswerIndex,
    setSelectedAnswerIndex
}) => {
    return (
        <View style={[sharedStyles.cardContainer, styles.container]}>
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
                            style={[styles.answerItem]}
                            data={item}
                            icon={
                                index === selectedAnswerIndex
                                    ? require("../img/Picked.png")
                                    : require("../img/gray_circle.png")
                            }
                            text={`${indexToLetter(index)}. ${item.text}`}
                            height={45}
                            borderColor={
                                index === selectedAnswerIndex ? "#159EFA" : "#D9DFE5"
                            }
                            onPress={() => setSelectedAnswerIndex(index)}
                            showIcon
                            readonly
                            disabled={disabled}
                        />
                    )}
                />
            </View>
        </View>
    )
}

export default AnswerOptions

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 0,
    },
    answers: {
        marginTop: verticalScale(15),
        alignSelf: "stretch",
    },
    answerItem: {
    }
})
