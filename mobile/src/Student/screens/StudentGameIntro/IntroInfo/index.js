import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { fontFamilies, fonts, colors } from '../../../../utils/theme'

const IntroInfo = ({ image, text }) => {
    return (
        <View style={styles.container}>
            <View style={{ height: 260, alignContent: 'center', alignItems: 'center' }}>
                <Image source={image} style={styles.image} />
            </View>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

export default IntroInfo

const styles = StyleSheet.create({
    container: {
        paddingLeft: 35,
        paddingRight: 35,
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    image: {
        resizeMode: 'cover',
        position: 'absolute',
        bottom: 0
    },
    text: {
        textAlign: 'center',
        textAlignVertical: 'bottom',
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.medium,
        color: colors.white,
        marginTop: 30,
    }
})
