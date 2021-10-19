import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { scale, verticalScale } from "react-native-size-matters"
import { colors, fontFamilies, fonts } from "../../../../../../utils/theme"

const CollapsableContent = () => {
  const question =
    "In many countries, a stop sign is represented as a red eight-sided shape with the word “STOP” in the middle. \n\nThis eight-sided shape is known as an octagon. \n\nHow many degrees are in the interior angles of a stop sign?"
  const answers = [
    {
      id: 1,
      answer: 1080,
    },
    {
      id: 2,
      answer: 720,
    },
    {
      id: 3,
      answer: 360,
    },
    {
      id: 4,
      answer: 8,
    },
  ]
  const selectedId = 1
  return (
    <View style={styles.container}>
      <View style={styles.breaker} />
      <Text style={styles.question}>Question: {question}</Text>
      <View style={styles.breaker} />
      {selectedId && (
        <View style={styles.chosenAnswer}>
          <Text style={styles.label}>
            {selectedId == 1 ? "Correct Answer:" : "Answer:"}
          </Text>
          <View
            style={[
              styles.correctAnswerContainer,
              selectedId == 1
                ? { backgroundColor: "#4DED66" }
                : { backgroundColor: "#FC1047" },
            ]}
          >
            <Text style={styles.answer}>{answers[selectedId - 1].answer}</Text>
          </View>
        </View>
      )}
      <View style={styles.chosenAnswer}>
        <Text style={styles.label}>Trick Selections:</Text>
        <View>
          {answers
            .filter((answer) => answer.id != 1)
            .map((answer, i) => {
              return (
                <Text
                  key={i}
                  style={[styles.answer, { marginRight: scale(15) }]}
                >
                  {answer.answer}
                </Text>
              )
            })}
        </View>
      </View>
    </View>
  )
}

export default CollapsableContent

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: scale(20),
    marginBottom: scale(15),
  },
  question: {
    fontFamily: fontFamilies.poppinsRegular,
    fontSize: fonts.small,
    color: colors.white,
    marginVertical: scale(10),
  },
  breaker: {
    height: 2,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  chosenAnswer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: scale(15),
    paddingVertical: scale(15),
  },
  label: {
    fontFamily: fontFamilies.poppinsRegular,
    fontSize: fonts.small,
    color: colors.white,
  },
  answer: {
    fontSize: fonts.xMedium,
    color: "white",
    fontFamily: fontFamilies.poppinsBold,
  },
  correctAnswerContainer: {
    paddingVertical: scale(1),
    paddingHorizontal: scale(15),
    borderRadius: 20,
  },
})
