import React, { useState, useRef } from "react"
import { StyleSheet, Text, View, Image, Animated } from "react-native"
import { scale } from "react-native-size-matters"
import LinearGradient from "react-native-linear-gradient"
import * as Progress from "react-native-progress"
import { fontFamilies, fonts } from '../../../../utils/theme'

const Answer = ({
  answer,
  isPopular,
  percentage,
  isAnswer,
  waitTime,
  totalAnswer,
}) => {
  const popularIconVisible = isPopular || false
  const percentageVisible = !popularIconVisible && percentage !== undefined

  const [showAnswer, setshowAnswer] = useState(false)
  const [showPercentage, setshowPercentage] = useState(false)
  const [showPopularIcon, setShowPopularIcon] = useState(false)

  const popularIconAnimation = useRef(new Animated.Value(0)).current
  const handlePopularIconAnimation = () => {
    Animated.timing(popularIconAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const progressBarFade = useRef(new Animated.Value(0)).current
  const handleProgressFade = () => {
    Animated.timing(progressBarFade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const backgroundColorFade = useRef(new Animated.Value(0)).current
  const handleBackgroundAnimation = () => {
    Animated.timing(backgroundColorFade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }
  const interpolator = backgroundColorFade.interpolate({
    inputRange: [0, 1],
    outputRange: ["white", "#6515C9"],
  })

  if (isAnswer) {
    setTimeout(() => {
      setshowAnswer(true)
      handleBackgroundAnimation()
    }, totalAnswer * 4200)
  }
  setTimeout(() => {
    handleProgressFade()
    setshowPercentage(true)
  }, waitTime)
  setTimeout(() => {
    handlePopularIconAnimation()
    setShowPopularIcon(true)
  }, 700)

  const percentageTitle = (percentage) => {
    return `${percentage}%`
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: showAnswer ? interpolator : "white",
        },
      ]}
    >
      <View style={styles.answerContainer}>
        <Text
          style={[
            styles.answer,
            {
              color: showAnswer ? "white" : "#384466",
            },
          ]}
        >
          {answer}
        </Text>
        {(percentage || false) && showPercentage && (
          <Animated.View style={{ opacity: progressBarFade }}>
            <Progress.Bar
              style={styles.progressBar}
              progress={percentage / 100}
              color={"#3AC449"}
              width={scale(170)}
              unfilledColor={"rgba(255,255,255,0.8)"}
            />
          </Animated.View>
        )}
      </View>
      {popularIconVisible && showPopularIcon && (
        <Animated.View style={{ opacity: popularIconAnimation }}>
          <LinearGradient
            colors={["#98CA28", "#49B036"]}
            style={styles.headerContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image
              source={require("../img/Team1Pick.png")}
              resizeMethod="resize"
              resizeMode="contain"
              width={scale(45)}
              style={styles.image}
            />
            {showPercentage && (
              <Animated.Text
                style={[
                  styles.totalPercentage,
                  {
                    color: "white",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#00000000",
                    opacity: progressBarFade,
                  },
                ]}
              >
                {percentageTitle(percentage)}
              </Animated.Text>
            )}
          </LinearGradient>
        </Animated.View>
      )}
      {percentageVisible && showPercentage && (
        <Animated.Text
          style={[
            styles.totalPercentage,
            {
              color: showAnswer ? "white" : "#C7C7C7",
              backgroundColor: showAnswer ? "#00000000" : "#F7F6F6",
              opacity: progressBarFade,
            },
          ]}
        >
          {percentageTitle(percentage)}
        </Animated.Text>
      )}
    </Animated.View>
  )
}

export default Answer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#E4E4E6",
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    overflow: "hidden",
  },
  answer: {
    fontWeight: "bold",
    paddingLeft: 9,
    textAlignVertical: "center",
    flex: 1,
    fontSize: fonts.xMedium,
    fontFamily: fontFamilies.karlaRegular,
  },
  totalPercentage: {
    width: scale(45),
    textAlignVertical: "center",
    textAlign: "center",
    fontFamily: fontFamilies.karlaRegular,
    fontSize: fonts.xMedium,
    fontWeight: '700'
  },
  image: {
    height: "100%",
  },
  answerContainer: {
    flex: 1,
    flexDirection: "column",
  },
  progressBar: {
    marginLeft: scale(8),
    marginBottom: scale(4),
  },
  headerContainer: {
    width: scale(44)
  }
})
