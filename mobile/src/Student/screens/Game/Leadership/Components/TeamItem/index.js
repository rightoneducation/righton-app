import { Image, StyleSheet, Text, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { colors, fontFamilies, fonts } from "../../../../../../utils/theme"
import Points from "../../../../../components/Points"

const TeamItem = ({ teamNo, score, showPoints, teamNames }) => {
    let backgroundColorStart
    let backgroundColorEnd
    let imageUrl

    switch (teamNo) {
        case 1:
            backgroundColorStart = colors.lightGreen
            backgroundColorEnd = "#5ACD3D"
            imageUrl = require("../../img/team_1_icon.png")
            break
        case 2:
            backgroundColorStart = "#7E00C4"
            backgroundColorEnd = "#9139F8"
            imageUrl = require("../../img/team_2_icon.png")
            break
        case 3:
            backgroundColorStart = "#69000B"
            backgroundColorEnd = "#8B000A"
            imageUrl = require("../../img/team_3_icon.png")
            break
        case 4:
            backgroundColorStart = "#0A4178"
            backgroundColorEnd = "#0F56A1"
            imageUrl = require("../../img/team_4_icon.png")
            break
        case 5:
            backgroundColorStart = "#FED52B"
            backgroundColorEnd = "#C64E0F"
            imageUrl = require("../../img/team_5_icon.png")
            break
    }

    return (
        <LinearGradient
            colors={[backgroundColorStart, backgroundColorEnd]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.contentContainer}>
                <>
                    <Image source={imageUrl} />
                </>
                <View style={styles.textContainer}>
                    <Text style={styles.teamTitle}>
                        {teamNames[teamNo - 1]}
                    </Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{score || 0}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

export default TeamItem

const styles = StyleSheet.create({
    container: {
        height: 75,
        borderRadius: 24,
        overflow: "hidden",
    },
    contentContainer: {
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
    },
    textContainer: {
        marginLeft: -30,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 9,
        alignContent: "center",
        alignItems: "center",
    },
    teamTitle: {
        color: "white",
        fontFamily: fontFamilies.montserratRegular,
        fontSize: fonts.large,
        fontWeight: "bold",
        textAlignVertical: "center",
    },
    scoreContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.302)",
        borderRadius: 17,
    },
    scoreText: {
        color: "white",
        fontFamily: fontFamilies.montserratRegular,
        fontSize: fonts.medium,
        fontWeight: "bold",
        width: 58,
        height: 58,
        textAlign: "center",
        textAlignVertical: "center",
    },
})
