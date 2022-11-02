import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { scale } from "react-native-size-matters"
import { fontFamilies, fonts, colors } from "../../../../../utils/theme"
import Hint from "./Hint"

const HintsView = ({ hints }) => {
    const mappedHints = hints.map((hint, idx) => {
        return {
            hintNo: idx + 1,
            hint: hint,
        }
    })

    return mappedHints.map((item) => (
        <Hint key={item.hintNo} hintNo={item.hintNo} hint={item.hint} />
    ))
}

export default HintsView

const styles = StyleSheet.create({
    showNextHintContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: scale(24),
        marginRight: scale(24),
        height: scale(58),
    },
    showNextStepButton: {
        height: 26,
        borderRadius: 22,
        marginRight: scale(26),
    },
    showNextStepTitle: {
        color: "white",
        fontFamily: fontFamilies.karlaBold,
        fontWeight: "bold",
        fontSize: fonts.xxMedium,
    },
})
