import { Image, StyleSheet, Text, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import { colors, fontFamilies, fonts, fontWeights } from '../../../utils/theme'
import BaseView from '../../components/BaseView'

const StartPhase = ({ phaseNo, gameSession, team, teamMember, smallAvatar, largeAvatar }) => {
    return (
        <BaseView style={styles.mainContainer}>
            <Text style={styles.headerText}>Starting Phase {phaseNo ? phaseNo : "2"}...</Text>
            <Text style={styles.subtitleText}>
                where the most popular wrong answer wins the most points!
            </Text>
            <Text style={styles.footerText}>
                Pick the answer you think tricked most of your classmates!
            </Text>
            <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    style={styles.image}
                    source={require("./img/monster_circle_bottom.png")}
                />
            </View>
        </BaseView>
    )
}

export default StartPhase

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        paddingHorizontal: 34,
    },
    headerText: {
        marginTop: verticalScale(160),
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.large,
        fontWeight: fontWeights.heavy,
        color: colors.white,
    },
    subtitleText: {
        color: colors.white,
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
        fontWeight: fontWeights.medium,
        marginTop: 5,
    },
    footerText: {
        color: colors.white,
        fontFamily: fontFamilies.karlaBold,
        fontSize: fonts.medium,
        fontWeight: fontWeights.heavy,
        textAlign: 'center',
        position: 'absolute',
        bottom: verticalScale(163),
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    image: {
        flex: 1,
        alignSelf: 'center',
    },
})