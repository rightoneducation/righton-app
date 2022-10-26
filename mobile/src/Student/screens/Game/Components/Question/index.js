import React from "react"
import { StyleSheet, Text, View, Image } from "react-native"
import sharedStyles from "../sharedStyles"
import { verticalScale } from "react-native-size-matters"

const Question = ({ question }) => {
    const questionImage = question?.imageUrl
    return (
        <View style={[sharedStyles.cardContainer, { alignItems: "center" }]}>
            {questionImage && (
                <Image
                    source={{ uri: questionImage }}
                    resizeMode="contain"
                    style={styles.image}
                />
            )}

            <Text style={[sharedStyles.text, styles.text]}>
                {question.text}
            </Text>
        </View>
    )
}

export default Question

const styles = StyleSheet.create({
    image: {
        marginBottom: verticalScale(15),
        width: "100%",
        height: verticalScale(200),
    },
    text: {
        marginBottom: verticalScale(15),
    },
})
