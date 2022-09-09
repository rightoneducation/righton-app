import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { fontFamilies, fonts, colors } from '../../../../utils/theme'
const win = Dimensions.get('window');

const IntroInfo = ({ image, text }) => {
    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} />
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
    image: {
        // width: win.width,
        // height: win.width,
        resizeMode: 'cover',
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'bottom',
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.xxMedium,
        color: colors.white,
        marginTop: 30,
    }
})
