import { useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { scale, verticalScale } from "react-native-size-matters"
import RoundButton from "../../../components/RoundButton"
import { colors, fontFamilies, fonts, fontWeights } from "../../../utils/theme"
import BaseView from "../../components/BaseView"

const ScorePage = ({
    gameSession,
    team,
    teamMember,
    monsterNumber,
    navigation,
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
        navigation.navigate("Leadership", {
            gameSession,
            team,
            teamMember,
            monsterNumber,
        })
    }

    return (
        <BaseView style={styles.mainContainer}>
            <Text
                style={styles.headerText}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                You've earned a total of
            </Text>
            <Text style={styles.headerScoreText}>{10} points</Text>
            <View style={styles.imageContainer}>
                <Image
                    source={winnerTeamImages[monsterNumber ? monsterNumber : 0]}
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
                    style={styles.leadershipButton}
                    titleStyle={styles.leadershipButtonTitle}
                    containerStyle={styles.leadershipContainer}
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
    leadershipButton: {
        backgroundColor: colors.buttonSecondary,
        height: 35,
        alignSelf: "center",
        paddingHorizontal: 23,
    },
    leadershipButtonTitle: {
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xxMedium,
        fontWeight: fontWeights.bold,
    },
    leadershipContainer: {
        position: "absolute",
        bottom: verticalScale(20),
        alignSelf: "center",
    },
})
