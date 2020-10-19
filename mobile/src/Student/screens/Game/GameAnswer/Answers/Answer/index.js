import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { fontFamilies, fonts } from '../../../../../../utils/theme'

const Answer = ({ answer }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.answer}>{answer}</Text>
        </View>
    )
}

export default Answer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    answer: {
        fontSize: fonts.xMedium,
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: 'bold',
        color: '#384466',
        borderColor: '#E4E4E6',
        borderWidth: 1,
        flex: 1,
        borderRadius: 12,
        paddingLeft: 9,
        height: 47,
        textAlignVertical: 'center'
    }
})
