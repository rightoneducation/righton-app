import React from "react"
import { StyleSheet, Text, ScrollView, Image, View } from "react-native"
import { scale, moderateScale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts } from "../../../../../utils/theme"
import Question from "../Question"

const ScrollableQuestion = ({ question }) => {
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Question question={question} />
        </ScrollView>
    )
}

export default ScrollableQuestion

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
    },
})
