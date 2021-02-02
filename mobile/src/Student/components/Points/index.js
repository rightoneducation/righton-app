import React from 'react'
import { StyleSheet, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { fontFamilies, fonts } from '../../../utils/theme'

const Points = ({ point }) => {
    return (
        <LinearGradient
            colors={['#22B851', '#7BDD61']}
            style={styles.pointsContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Text style={styles.pointsText}>{'+' + point}</Text>
        </LinearGradient>
    )
}

export default Points

const styles = StyleSheet.create({
    pointsContainer: {
        marginLeft: 10,
        height: 28,
        width: 58,
        borderRadius: 23,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 5
            }
        }),
    },
    pointsText: {
        color: '#F5F5F5',
        fontFamily: fontFamilies.montserratExtraBold,
        fontStyle: 'normal',
        fontSize: fonts.xMedium,
        textAlign: 'center',
        lineHeight: 22,
        textAlignVertical: 'center',
        flex: 1,
        color: '#f5f5f5',
        fontWeight: '800',
    },
})