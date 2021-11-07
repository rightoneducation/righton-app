import LinearGradient from "react-native-linear-gradient"
import QuestionTabBar from "../QuestionTabBar"
import { Text, SafeAreaView, StyleSheet } from "react-native"
import React from "react"
import { scale } from "react-native-size-matters"
import { colors, fontFamilies, fonts } from "../../../../../utils/theme"

const RootComponent = ({ heading, subheading, children }) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={["#0D68B1", "#02215F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <QuestionTabBar numQuestions={5} currentQuestion={0} />
        <Text style={styles.phaseName}>{heading}</Text>
        <Text style={styles.phaseDescription}>{subheading}</Text>
        {children}
      </LinearGradient>
    </SafeAreaView>
  )
}

export default RootComponent

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#003668",
  },
  backgroundGradient: {
    flex: 1,
    paddingLeft: scale(12),
    paddingTop: scale(15),
  },
  phaseName: {
    fontSize: fonts.xxLarge,
    fontFamily: fontFamilies.poppinsBold,
    color: colors.white,
    marginTop: scale(12),
  },
  phaseDescription: {
    fontSize: fonts.medium,
    fontFamily: fontFamilies.poppinsRegular,
    color: colors.white,
    marginBottom: scale(12),
  },
})
