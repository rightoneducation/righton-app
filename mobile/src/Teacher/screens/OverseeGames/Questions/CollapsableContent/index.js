import { Image, StyleSheet, Text, View } from "react-native"
import { scale } from "react-native-size-matters"
import { colors, fontFamilies, fonts } from "../../../../../utils/theme"

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
      <View style={styles.answerChoices}>
        <Text style={styles.label}>Answer Selections:</Text>
        <View style={styles.selections}>
          {answers.map((answer, i) => {
            return answer.id == selectedId ? (
              <View style={styles.chosenAnswer}>
                <Text key={i} style={styles.answer}>
                  {answer.answer}
                </Text>
                <Image source={require("../img/Ellipse.png")}></Image>
              </View>
            ) : (
              <Text key={i} style={styles.answer}>
                {answer.answer}
              </Text>
            )
          })}
        </View>
      </View>
      <View style={styles.breaker} />
      <View style={styles.bottomContainer}>
        <Text style={styles.question}>Selected Answer Explaination:</Text>
        <View style={styles.explainationContainer}>
          <Text style={styles.question}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do v
          </Text>
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
  answerChoices: {
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
  bottomContainer: {
    padding: scale(15),
    width: "100%",
  },
  explainationContainer: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    padding: scale(10),
    borderRadius: 22,
    marginHorizontal: scale(-10),
    marginTop: scale(10),
  },
  chosenAnswer: {
    borderWidth: 2,
    borderColor: colors.lightGreen,
    borderRadius: 20,
    width: scale(80),
    paddingHorizontal: scale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selections: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginRight: scale(15),
  },
})
