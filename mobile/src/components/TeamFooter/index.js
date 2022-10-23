import { Image, StyleSheet, Text, View } from 'react-native'
import { colors, fontFamilies, fonts, fontWeights } from '../../utils/theme'

const TeamFooter = ({ icon, name, score, totalScore }) => {
    return (
        <View style={styles.container}>
            <Image
                source={icon}
                style={styles.icon}
            />
            <Text
                style={styles.name}
            >
                {name}
            </Text>
            <View style={styles.scoreContainer}>
                {score !== undefined && score !== null &&
                    <View style={styles.scoreView}>
                        <Text style={styles.scoreText}>
                            +{score}
                        </Text>
                    </View>
                }
                <View style={styles.totalScoreView}>
                    <Text style={styles.scoreText}>
                        {totalScore}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default TeamFooter

const sharedScoreContainer = {
    height: 22,
    width: 58,
    alignItems: "center",
    borderRadius: 10,
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 25,
    },
    icon: {
        width: 34,
        height: 42,
        marginTop: 11,
    },
    name: {
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: fontWeights.extraBold,
        fontSize: fonts.medium,
        color: colors.blackTransparent38,
        flex: 1,
        textAlignVertical: "center",
        alignSelf: "center",
    },
    scoreView: {
        ...sharedScoreContainer,
        backgroundColor: colors.lightGreen,
    },
    totalScoreView: {
        ...sharedScoreContainer,
        backgroundColor: colors.lightBlue,
        marginTop: 4,
    },
    scoreContainer: {
        flexDirection: "column",
        justifyContent: "flex-end",
        height: "100%",
    },
    scoreText: {
        color: colors.white,
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: fontWeights.extraBold,
        fontSize: fonts.xMedium,
    },
})