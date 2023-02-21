import { Animated,  Image, StyleSheet, Text, View } from 'react-native'
import {useRef, useEffect} from 'react'
import { scale, verticalScale } from 'react-native-size-matters'
import { colors, fontFamilies, fonts, fontWeights } from '../../utils/theme'

const TeamFooter = ({ icon, name, totalScore, isAnswerCorrect }) => {

    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Image
                    source={icon}
                    style={styles.icon}
                />
            </View>
            <View style={[styles.itemContainer, styles.nameView]}>
                <Text style={styles.name}>
                    {name}
                </Text>
            </View>
            <View style={[styles.itemContainer, styles.scoreView]}>
                <Text style={styles.scoreText}>
                    {totalScore}
                </Text>
            </View>
        </View>
    )
}

export default TeamFooter

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 25
    },
    itemContainer: {
        minWidth: 50,
    },
    icon: {
        width: 34,
        height: 42,
        borderRadius: 12
    },
    nameView: {
        flex: 1,
        justifyContent: "center",
        alignContent: "flex-start",
    },
    name: {
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: fontWeights.extraBold,
        fontSize: fonts.medium,
        color: colors.blackTransparent38,
    },
    scoreView: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        height: verticalScale(19),
        width: scale(58),
        maxWidth: scale(58),
        backgroundColor: colors.lightBlue,
    },
    scoreText: {
        color: colors.white,
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: fontWeights.bold,
        fontSize: fonts.xMedium,
    },
})