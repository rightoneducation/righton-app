import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { scale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts, colors, fontWeights } from '../../../../utils/theme'
const win = Dimensions.get('window');

const IntroInfo = ({ monsterStyles, monsters, phone, sticker, text, showSticker }) => {
    if ({ monsterStyles }.length != 2) {
        console.debug("'monsterStyles' must be an array of 2 entries")
    }
    return (
        <View style={styles.container}>
            <Image source={monsters[0]} style={monsterStyles[0]} />
            <View style={styles.imgContainer}>
                {showSticker && <Image source={sticker} style={styles.phaseSticker} />}
                <Image source={phone} style={styles.phone} />
            </View>
            <Image source={monsters[1]} style={monsterStyles[1]} />
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

export default IntroInfo

const styles = StyleSheet.create({
    container: {
        paddingLeft: 35,
        paddingRight: 35,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    phone: {
        resizeMode: 'cover'
    },
    phaseSticker: {
        marginRight: scale(-55),
        marginTop: verticalScale(80),
        zIndex: 1
    },
    imgContainer: {
        flexDirection: 'row'
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'bottom',
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.medium,
        lineHeight: 23,
        fontWeight: fontWeights.extraBold,
        color: colors.white,
        marginTop: verticalScale(20)
    }
})
