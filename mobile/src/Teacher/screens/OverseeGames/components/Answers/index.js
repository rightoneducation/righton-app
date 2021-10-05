import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { fontFamilies, fonts } from "../../../../../utils/theme";
import LinearGradient from "react-native-linear-gradient";
import * as Progress from "react-native-progress";

const Answers = ({ teamSelectedTrickAnswer }) => {
  let totalPercentage = 0;
  let totalAnswers = 0;
  const generatePercentage = () => {
    const remainingPercentage = 100 - totalPercentage;
    if (totalAnswers == 3) {
      return remainingPercentage;
    }
    const currentPercentage = Math.floor(Math.random() * remainingPercentage);
    totalAnswers++;
    totalPercentage += currentPercentage;
    return currentPercentage;
  };

  const [answers, setAnswers] = useState(
    [
      {
        num: 8,
        percentage: generatePercentage(),
        isAnswer: false,
      },
      {
        num: 540,
        percentage: generatePercentage(),
        isAnswer: false,
      },
      {
        num: 360,
        percentage: generatePercentage(),
        isAnswer: false,
      },
      {
        num: 1080,
        percentage: generatePercentage(),
        isAnswer: true,
      },
    ].sort((a, b) => {
      return a.percentage < b.percentage;
    })
  );
  const percentageTitle = (percentage) => {
    return `${percentage}%`;
  };
  return (
    <View style={styles.mainContainer}>
      {answers.map((answer, i) => {
        return (
          <View
            style={[
              styles.container,
              {
                backgroundColor: answer.isAnswer
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              },
            ]}
            key={i}
          >
            <View style={styles.answerContainer}>
              <Text style={styles.answer}>{answer.num}</Text>

              <Progress.Bar
                style={styles.progressBar}
                progress={answer.percentage / 100}
                color={"white"}
                unfilledColor={"rgba(255,255,255,0.2)"}
                width={scale(235)}
              />
            </View>
            {teamSelectedTrickAnswer == answer.num && (
              <LinearGradient
                colors={["#98CA28", "#49B036"]}
                style={styles.headerContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text
                  style={[
                    styles.totalPercentage,
                    {
                      color: "white",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "#00000000",
                    },
                  ]}
                >
                  {percentageTitle(answer.percentage)}
                </Text>
              </LinearGradient>
            )}
            <View style={{
                  backgroundColor: answer.isAnswer
                    ? "rgba(255, 255, 255, 0)"
                    : "rgba(255, 255, 255, 0.2)",
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start'
                 }}> 
            <Text
              style={
                styles.totalPercentage
              }
            >
              {percentageTitle(answer.percentage)}
            </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Answers;

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(-12),
  },
  container: {
    flexDirection: "row",
    borderColor: "#E4E4E6",
    borderRadius: 12,
    borderWidth: 1,
    height: scale(50),
    width: "90%",
    overflow: "hidden",
    marginVertical: scale(10),
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
  },
  answer: {
    fontSize: fonts.medium,
    fontFamily: fontFamilies.poppinsRegular,
    fontWeight: "bold",
    paddingLeft: 9,
    textAlignVertical: "center",
    flex: 1,
    color: "white",
  },
  totalPercentage: {
    width: scale(55),
    textAlignVertical: "center",
    textAlign: "center",
    fontFamily: fontFamilies.poppinsRegular,
    fontSize: fonts.xMedium,
    fontWeight: "700",
    color: "white",
  },
  answerContainer: {
    flex: 1,
    flexDirection: "column",
  },
  progressBar: {
    marginLeft: scale(8),
    marginBottom: scale(4),
    borderWidth: 0,
  },
});
