import React, { useState, useRef, useCallback } from "react"
import { View, Text, ScrollView, StyleSheet, Image } from "react-native"
// import AnimatedAccordion from "@dev-event/react-native-accordion"
import { fontFamilies, fonts } from "../../../../../../utils/theme"
import { scale } from "react-native-size-matters"
import CollapsableContent from "../CollapsableContent"

const TeamCards = ({ teamInfo }) => {
  // const accordionRef = useRef(null)

  const [show, setShow] = useState(false)
  const [expandedIndexes, setExpandedIndexes] = useState([])

  const handleContentTouchable = useCallback((i, answers, picked) => {
    const opacityCheck = (value) => {
      return value == 0 ? { opacity: 0.3 } : {}
    }
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Team {i}</Text>
        <View style={styles.teamContainerInfo}>
          <Text style={[styles.title, opacityCheck(answers)]}>
            <Text style={styles.numbers}>{answers}</Text> answers
          </Text>
          <Text style={[styles.title, opacityCheck(picked)]}>
            <Text style={styles.numbers}>{picked > 0 ? picked : "-"}</Text>{" "}
            picked
          </Text>
        </View>
      </View>
    )
  }, [])

  const handleContent = useCallback(() => {
    return <CollapsableContent />
  }, [])

  const handleIcon = useCallback(() => {
    return <Image source={require("../../../img/arrow.png")} />
  }, [])

  const handleOpen = (isShow, i) => {
    if (!expandedIndexes.includes(i)) {
      setExpandedIndexes([...expandedIndexes, i])
    }
    else {
      setExpandedIndexes(expandedIndexes.filter((item) => item !== i))
    }
    setShow(isShow)
  }

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}
    >
      {teamInfo.map((info, i) => {
        return (
          <View />
          /*{ <AnimatedAccordion
            key={i}
            styleChevron={styles.icon}
            renderContent={handleContent}
            onChangeState={(isShow) => handleOpen(isShow, i)}
            styleTouchable={[
              styles.touchable,
              expandedIndexes.indexOf(i) != -1
                ? {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }
                : {},
            ]}
            activeBackgroundIcon={"transparent"}
            inactiveBackgroundIcon={"transparent"}
            handleContentTouchable={() =>
              handleContentTouchable(i + 1, info.answers, info.picked)
            }
            initialMountedContent={true}
            handleIcon={handleIcon}
          /> }*/
        )
      })}
    </ScrollView>
  )
}

export default TeamCards

const styles = StyleSheet.create({
  mainContainer: {
    marginRight: scale(12),
  },
  touchable: {
    height: scale(70),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    marginTop: scale(10),
  },
  title: {
    fontSize: fonts.xMedium,
    color: "rgba(255,255,255,0.8)",
    fontFamily: fontFamilies.poppinsSemiBold,
  },
  message: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  icon: {
    height: scale(35),
    width: scale(35),
    backgroundColor: "rgba(255,255,255,0)",
  },
  button: {
    padding: 16,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: scale(195),
    alignItems: "center",
    marginLeft: scale(10),
  },
  teamContainerInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "90%",
  },
  numbers: {
    fontFamily: fontFamilies.poppinsBold,
    fontSize: fonts.medium,
  },
})
