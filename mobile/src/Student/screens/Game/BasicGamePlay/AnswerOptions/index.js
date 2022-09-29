import React, { useState } from "react"
import { StyleSheet, Text, View, TextInput, Platform } from "react-native"
import sharedStyles from "../../Components/sharedStyles"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts, colors } from "../../../../../utils/theme"
import RoundTextIcon from "../../../../components/RoundTextIcon"
import { KeyboardAwareFlatList } from "@codler/react-native-keyboard-aware-scroll-view"
import uuid from "react-native-uuid"

const AnswerOptions = ({}) => {
  const onAnswerSubmitted = (event) => {}

  const chooseAnswer = (selectedAnswer) => {}

  return (
    <View style={[sharedStyles.cardContainer, styles.container]}>
      <View>
        <KeyboardAwareFlatList
          style={[styles.answers]}
          data={trickAnswers}
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
              borderColor={item.isSelected ? "#8DCD53" : "#D9DFE5"}
              onPress={chooseAnswer}
              showIcon={item.isSelected}
              readonly={true}
              data={item}
            />
          )}
        />
        <KeyboardAwareFlatList
          style={styles.answers}
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
              borderColor={item.isSelected ? "#8DCD53" : "#D9DFE5"}
              onPress={toggleAnswer}
              data={item}
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
