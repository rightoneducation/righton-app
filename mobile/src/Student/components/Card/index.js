import React from 'react'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'
import { StyleSheet, Text, View, Platform } from 'react-native'
import { fontFamilies, fonts } from '../../../utils/theme'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'

const Card = ({ extraStyle, headerTitle, children }) => {
    const cardStyle = { ...(extraStyle || {}), ...styles.cardContent }
    return (
        <View style={styles.cardContainer}>
            <KeyboardAwareScrollView
                style={cardStyle}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </KeyboardAwareScrollView>
        </View>
    )
}

export default Card

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingVertical: verticalScale(6),
        shadowColor: '#000',
        shadowOffset: { width: 12, height: 14 },
        shadowOpacity: 0.03,
    },
    cardContent: {
        marginLeft: moderateScale(25),
        marginRight: moderateScale(25),
        paddingVertical: verticalScale(5),
        padding: scale(3),
        borderRadius: 24,
        backgroundColor: 'white',
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
    headerContainer: {
        marginBottom: verticalScale(20),
    },
    headerText: {
        fontFamily: fontFamilies.montserratBold,
        fontWeight: 'bold',
        fontSize: fonts.large,
        color: 'white',
        textAlign: 'center'
    }
})
