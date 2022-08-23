import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import sharedStyles from '../sharedStyles'
import { verticalScale } from 'react-native-size-matters'

const Question = ({ question }) => {
    return (
        <View style={[sharedStyles.cardContainer, { alignItems: 'center' }]}>
            {question.imageUrl != null && <Image
                source={question.imageUrl}
                resizeMethod='resize'
                style={styles.image} />
            }
            <Text style={[sharedStyles.text, styles.text]}>
                {question.text}
            </Text>
        </View>
    )
}

export default Question

const styles = StyleSheet.create({
    image: {
        marginBottom: verticalScale(15),
    },
    text: {
        marginBottom: verticalScale(15)
    }
})
