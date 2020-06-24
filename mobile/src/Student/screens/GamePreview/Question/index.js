import React from 'react'
import { StyleSheet, Text, ScrollView, Image, View } from 'react-native'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../../utils/theme'
import sharedStyles from '../sharedStyles'

const Questions = () => {
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={[sharedStyles.cardContainer, { alignItems: 'center' }]}>
                <Image
                    source={require('../img/Stop.png')}
                    resizeMethod='resize'
                    style={styles.image} />
                <Text style={[sharedStyles.text, styles.text]}>
                    In many countries, a stop sign is represented as a red eight-sided shape with the word “STOP” in the middle.{"\n\n"}This eight-sided shape is known as an octagon.{"\n\n"}How many degrees are in the interior angles of a stop sign?
                </Text>
            </View>
        </ScrollView>
    )
}

export default Questions

const styles = StyleSheet.create({
    container: {
        alignContent: 'center'
    },
    image: {
        marginBottom: verticalScale(15),
    },
    text: {
        marginBottom: verticalScale(15)
    }
})
