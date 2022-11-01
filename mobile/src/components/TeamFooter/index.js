import { Image, StyleSheet, Text, View } from 'react-native'
import { colors, fontFamilies, fonts, fontWeights } from '../../utils/theme'

const TeamFooter = ({ icon, name, totalScore }) => {
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
        marginHorizontal: 25,
    },
    itemContainer: {
        minWidth: 50,
    },
    icon: {
        width: 44,
        height: 44,
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
        height: 36,
        maxWidth: 55,
        backgroundColor: colors.lightBlue,
    },
    scoreText: {
        color: colors.white,
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: fontWeights.bold,
        fontSize: fonts.medium,
    },
})