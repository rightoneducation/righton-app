import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { scale } from "react-native-size-matters";
import Answer from "./Answer";

const Answers = ({ teamSelectedTrickAnswer }) => {
  const [answer, setAnswer] = useState();
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
      },
      {
        num: 540,
        percentage: generatePercentage(),
      },
      {
        num: 360,
        percentage: generatePercentage(),
      },
      {
        num: 1080,
        percentage: generatePercentage(),
      },
    ].sort((a, b) => {
      return a.percentage < b.percentage;
    })
  );

  //hoook to show the final answer and percentage
  setTimeout(() => {
    setAnswer(1080);
  }, 3000 * (answers.length + 1));

  return (
    <View
      style={[styles.mainContainer, { height: scale(65 * answers.length) }]}
    >
      {answers &&
        answers.map((ans, index) => {
          const animationValue = useRef(
            new Animated.ValueXY({
              x: Dimensions.get("window").width * 0.3,
              y:
                ((index + 1) % 2 == 0 ? index - 1 : index) * scale(40) +
                scale(10),
            })
          ).current;
          const animationValue2 = useRef(
            new Animated.Value(
              index % 2 == 0 ? scale(30) : Dimensions.get("window").width * 0.4
            )
          ).current;
          const animatedStyle = {
            width: animationValue.x,
            top: animationValue.y,
            left: animationValue2,
          };
          setTimeout(() => {
            Animated.sequence([
              Animated.timing(animationValue.y, {
                toValue: index * scale(60) + scale(15),
                duration: 1000,
                useNativeDriver: false,
              }).start(),
              Animated.timing(animationValue2, {
                toValue: scale(20),
                duration: 500,
                useNativeDriver: false,
              }).start(),
              Animated.timing(animationValue.x, {
                toValue: scale(230),
                duration: 1000,
                useNativeDriver: false,
              }).start(),
            ]);
          }, 3000 * (answers.length - index));
          return (
            <Animated.View key={index} style={[styles.cardsContainer, animatedStyle]}>
              <Answer
                answer={ans.num}
                isPopular={teamSelectedTrickAnswer == ans.num}
                percentage={ans.percentage}
                waitTime={(answers.length - index) * 3000 + 1500}
                isAnswer={1080 == ans.num}
                totalAns={answers.length}
              />
            </Animated.View>
          );
        })}
    </View>
  );
};

export default Answers;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: 'white',
    width: "100%",
    borderRadius: 24,
    flex: 1,
    marginTop: scale(-15)
  },
  cardsContainer: {
    position: "absolute",
    height: scale(50),
  },
});
