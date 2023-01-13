import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { scale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts, colors } from '../../../../utils/theme'
const win = Dimensions.get('window');

const IntroInfo = ({ screen, Monsters, phone, sticker, text }) => {
    return (
        <View style={styles.container}>
            <Image source={Monsters[0]} style={screen === 1 ? styles.monster1 : styles.monster3} />
            <View style={styles.imgContainer}>
                {text != "The most total points wins!" && <Image source={sticker} style={styles.phaseSticker} />}
                <Image source={phone} style={styles.phone} />
            </View>
            <Image source={Monsters[1]} style={screen < 4 ? styles.monster2 : (screen === 4) ? styles.monster4 : styles.monster5} />
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
        // width: win.width,
        // height: win.width,
        resizeMode: 'cover',
    },
    phaseSticker: {
        marginRight: scale(-55),
        marginTop: verticalScale(80),
        zIndex: 1
    },
    imgContainer: {
        flexDirection: 'row',
        //alignItems: 'center',
        //alignContent: 'center',
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'bottom',
        fontFamily: fontFamilies.montserratBold,
        fontSize: 20,
        lineHeight: 23,
        fontWeight: "800",
        color: colors.white,
        marginTop: verticalScale(20)
    },
    monster1: {
        position: 'absolute',
        left: 0,
        marginTop: verticalScale(100)
    },
    monster2: {
        position: 'absolute',
        right: 0,
        marginTop: verticalScale(200)
    },
    monster3: {
        position: 'absolute',
        left: 0,
        marginTop: verticalScale(200),
        marginLeft: scale(20)
    },
    monster4: {
        position: 'absolute',
        right: 0,
        marginTop: verticalScale(140)
    },
    monster5: {
        position: 'absolute',
        right: 0,
        marginTop: verticalScale(20),
        zIndex: -1
    },
})
