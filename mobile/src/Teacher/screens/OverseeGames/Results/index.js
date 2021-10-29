import React from "react"
import { View, Text, SafeAreaView, StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { scale } from "react-native-size-matters"
import { fonts, fontFamilies, colors } from "../../../../utils/theme"
import Footer from "../components/Footer"

const Results = ({ route, navigation }) => {
  const { questionNum } = route.params
  const teamPoints = [
    {
      id: 3,
      points: 900,
    },
    {
      id: 1,
      points: 800,
    },
    {
      id: 5,
      points: 700,
    },
    {
      id: 4,
      points: 500,
    },
    {
      id: 2,
      points: 200,
    },
  ]
  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={["#0D68B1", "#02215F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <Text style={styles.phaseName}>Interim Results</Text>
        <Text style={styles.phaseDescription}>LeaderBoard</Text>
        <View style={styles.rankingsContainer}>
          {teamPoints.map((team, i) => {
            let borderColor
            let colors
            if (i == 0) {
              borderColor = "#EAA657"
              colors = ["#EAA657", "#F9D649", "#EAA657"]
            } else if (i == 1) {
              borderColor = "#9D9D9D"
              colors = ["#9D9D9D", "#D4D4D4", "#9D9D9D"]
            } else if (i == 2) {
              borderColor = "#E3694E"
              colors = ["#E3694E", "#EF905B", "#E3694E"]
            } else {
              borderColor = "rgba(255,255,255,0.2)"
              colors = ["#rgba(255,255,255,0.2)", "#rgba(255,255,255,0.2)"]
            }
            return (
              <View
                key={i}
                style={[styles.individualTeam, { borderColor: borderColor }]}
              >
                <Text style={[styles.text, { marginTop: scale(5) }]}>
                  #{i + 1}: Team {team.id}
                </Text>
                <LinearGradient
                  style={styles.pointsContainer}
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.text}>{team.points}</Text>
                </LinearGradient>
              </View>
            )
          })}
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.scrollDivider} />
          <Footer
            style={styles.footer}
            noPicked={2}
            teams={teamPoints.length}
            navigation={navigation}
            questionNum={questionNum + 1}
            showPicked={false}
            nextPage={questionNum == teamPoints.length ? "" : "Questions"}
            buttonLabel={
              questionNum == teamPoints.length ? "End Game" : "Next Question"
            }
            backgroundColor={colors.lightblue}
            textColor={colors.white}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}
export default Results

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#003668",
  },
  backgroundGradient: {
    flex: 1,
    paddingHorizontal: scale(12),
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
  footer: {
    marginTop: scale(10),
  },
  footerContainer: {
    bottom: 0,
    alignItems: "center",
    width: "100%",
    marginTop: scale(10),
  },
  scrollDivider: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    height: scale(2),
    width: "95%",
    alignSelf: "center",
    marginBottom: scale(2),
  },
  rankingsContainer: {
    flex: 1,
  },
  individualTeam: {
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: scale(7),
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: scale(10),
    height: scale(50),
  },
  pointsContainer: {
    width: scale(55),
    display: "flex",
    justifyContent: "flex-end",
    height: "100%",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    paddingLeft: scale(7),
  },
  text: {
    fontFamily: fontFamilies.poppinsBold,
    fontSize: fonts.large,
    color: colors.white,
  },
})
