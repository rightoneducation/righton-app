import { ModelHelper } from '@righton/networking'
import { useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { scale, verticalScale } from "react-native-size-matters"
import RoundButton from "../../../components/RoundButton"
import { colors, fontFamilies, fonts, fontWeights } from "../../../utils/theme"
import BaseView from "../../components/BaseView"

const ScorePage = ({
    team,
    teamAvatar,
    navigation,
    clearLocalSession
}) => {
    const winnerTeamImages = [
        require("./img/Team1_winner.png"),
        require("./img/Team2_winner.png"),
        require("./img/Team3_winner.png"),
        require("./img/Team4_winner.png"),
        require("./img/Team5_winner.png"),
        require("./img/Team6_winner.png"),
    ]

    const winnerText = "Great Job!"
    const top5Text = "Congratulations! You're in the top 5"

    const [isInTop5, setIsInTop5] = useState(false)
    const [imageHeight, setImageHeight] = useState(0)
    const [imageWidth, setImageWidth] = useState(0)
    const [textHeight, setTextHeight] = useState(0)

    const navigateToLeaderboard = () => {
        navigation.navigate("Leaderboard")
    }

    // clear local data off device at this screen (this marks the end of the game from a rejoin perspective)
    useFocusEffect(
        React.useCallback(() => {
          const clearLocalData = navigation.addListener('focus', () => {
            clearLocalSession()
          });
          return clearLocalData
        },[navigation])
      )

    return (
        <BaseView style={styles.mainContainer}>
            <Text
                style={styles.headerText}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                You've earned a total of
            </Text>
            <Text style={styles.headerScoreText}>
                {team.score ? team.score : 0} points
            </Text>
            <View style={styles.imageContainer}>
                <Image
                    source={winnerTeamImages[teamAvatar.id-1]}
                    style={styles.winnerImage}
                    onLayout={(event) => {
                        const { width, height } = event.nativeEvent.layout
                        setImageWidth(width)
                        setImageHeight(height)
                    }}
                />
                <Text
                    style={{
                        ...styles.winnerText,
                        bottom: imageHeight - textHeight,
                    }}
                    adjustsFontSizeToFit
                    numberOfLines={isInTop5 ? 2 : 1}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout
                        setTextHeight(height)
                    }}
                >
                    {isInTop5 ? top5Text : winnerText}
                </Text>
                <RoundButton
                    title="View Leaderboard"
                    style={styles.LeaderboardButton}
                    titleStyle={styles.LeaderboardButtonTitle}
                    containerStyle={styles.LeaderboardContainer}
                    onPress={() => {
                        navigateToLeaderboard()
                    }}
                />
            </View>
        </BaseView>
    )
}

export default ScorePage

const headerTextShared = {
    color: colors.white,
    fontFamily: fontFamilies.poppinsRegular,
    fontWeight: fontWeights.semiBold,
    fontSize: fonts.xxLarge,
    marginHorizontal: scale(34),
    textAlign: "center",
}
const styles = StyleSheet.create({
    mainContainer: {
        alignItems: "center",
        paddingTop: verticalScale(51),
    },
    headerText: {
        ...headerTextShared,
    },
    headerScoreText: {
        ...headerTextShared,
    },
    winnerImage: {
        resizeMode: "contain",
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
    },
    winnerText: {
        ...headerTextShared,
        marginHorizontal: scale(35),
        position: "absolute",
        alignSelf: "center",
        paddingTop: verticalScale(20),
    },
    imageContainer: {
        flex: 1,
        paddingHorizontal: scale(54),
        width: "100%",
    },
    LeaderboardButton: {
        backgroundColor: colors.buttonSecondary,
        height: 35,
        alignSelf: "center",
        paddingHorizontal: 23,
    },
    LeaderboardButtonTitle: {
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xxMedium,
        fontWeight: fontWeights.bold,
    },
    LeaderboardContainer: {
        position: "absolute",
        bottom: verticalScale(20),
        alignSelf: "center",
    },
})