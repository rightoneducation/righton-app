import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { fontFamilies, fonts } from "../../../../../utils/theme";

const QuestionTabBar = ({ numQuestions, currentQuestion }) => {
  return (
    <View style={styles.container}>
      {[...Array(numQuestions + 1)].map((_, i) => {
        return (
          <View
            style={[
              styles.numberContainer,
              currentQuestion == i ? {} : { opacity: 0.1 },
            ]}
            key={i}
          >
            <Text style={styles.number}>{i == 0 ? "?" : i}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default QuestionTabBar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  numberContainer: {
    borderWidth: 2,
    borderColor: "white",
    paddingVertical: scale(2),
    paddingHorizontal: scale(10),
    marginHorizontal: scale(5),
  },
  number: {
    fontSize: fonts.xSmall,
    fontFamily: fontFamilies.poppinsRegular,
    color: "white",
  },
});
