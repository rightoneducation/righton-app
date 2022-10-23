import { useCallback, useState } from "react"
import {
  Image,
  ScrollView, StyleSheet, Text, View
} from "react-native"
import { scale } from "react-native-size-matters"
import { colors, fontFamilies, fonts } from "../../../../utils/theme"
import Footer from "../components/Footer"
// import AnimatedAccordion from "@dev-event/react-native-accordion"
import RootComponent from "../components/RootComponent"
import CollapsableContent from "./CollapsableContent"

// add a prop for second question
const Questions = ({ route, navigation }) => {
  const [allTeamAnswers, setAllTeamAnswers] = useState(false)
  const { questionNum } = route.params
  // const accordionRef = useRef(null)

  const teamInfo = [
    {
      points: 20,
      voted: true,
    },
    {
      points: 0,
      voted: false,
    },
    {
      points: 50,
      voted: true,
    },
    {
      points: 0,
      voted: false,
    },
    {
      points: 70,
      voted: false,
    },
    {
      points: 0,
      voted: false,
    },
    {
      points: 70,
      voted: true,
    },
  ]

  const [show, setShow] = useState(false)
  const [expandedIndexes, setExpandedIndexes] = useState([])

  const handleContentTouchable = useCallback((i) => {
    if (i == questionNum) {
      teamDescription = "Tricksters"
    } else if (teamInfo[i - 1].voted) {
      teamDescription = "Voted"
    } else teamDescription = "Not Yet Voted"
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Team {i}</Text>
        <Text style={styles.description}>{teamDescription}</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{teamInfo[i - 1].points}</Text>
        </View>
      </View>
    )
  }, [])

  const handleContent = useCallback(() => {
    return <CollapsableContent />
  }, [])

  const handleIcon = useCallback(() => {
    return <Image source={require("../img/arrow.png")} />
  }, [])

  const handleOpen = (isShow, i) => {
    if (!expandedIndexes.includes(i))
      setExpandedIndexes([...expandedIndexes, i])
    else {
      setExpandedIndexes(expandedIndexes.filter((item) => item !== i))
    }
    setShow(isShow)
  }

  setTimeout(() => {
    setAllTeamAnswers(true)
  }, 2000)

  return (
    <RootComponent heading="Question" subheading="Multiple Choice Questions">
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.teamInfoContainer}
          showsVerticalScrollIndicator={false}
        >
          {teamInfo.map((info, i) => {
            return (
              <View />
              /*{ <AnimatedAccordion
                key={i}
                ref={accordionRef}
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
                handleContentTouchable={() => handleContentTouchable(i + 1)}
                initialMountedContent={true}
                handleIcon={handleIcon}
              /> }*/
            )
          })}
        </ScrollView>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.scrollDivider} />
        <Footer
          style={styles.footer}
          noPicked={2}
          teams={teamInfo.length}
          navigation={navigation}
          questionNum={questionNum}
          nextPage={"Results"}
          buttonLabel={"Skip to Results"}
          backgroundColor={allTeamAnswers ? colors.lightBlue : "transparent"}
          textColor={allTeamAnswers ? colors.white : colors.lightBlue}
        />
      </View>
    </RootComponent>
  )
}

export default Questions

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
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
  numbers: {
    fontFamily: fontFamilies.poppinsBold,
    fontSize: fonts.medium,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    marginLeft: scale(10),
  },
  title: {
    fontSize: fonts.xMedium,
    color: "rgba(255,255,255,0.8)",
    fontFamily: fontFamilies.poppinsSemiBold,
  },
  icon: {
    height: scale(35),
    width: scale(35),
    backgroundColor: "rgba(255,255,255,0)",
  },
  touchable: {
    height: scale(70),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    marginTop: scale(10),
  },
  teamInfoContainer: {
    marginRight: scale(12),
  },
  pointsContainer: {
    backgroundColor: "#159EFA",
    width: scale(70),
    borderRadius: 20,
  },
  points: {
    fontSize: fonts.medium,
    fontFamily: fontFamilies.poppinsBold,
    color: colors.white,
    alignSelf: "center",
  },
  description: {
    fontSize: fonts.xSmall,
    color: colors.white,
    fontFamily: fontFamilies.poppinsRegular,
  },
})
