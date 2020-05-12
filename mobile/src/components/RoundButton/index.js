import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { colors, fonts, fontFamilies } from '../../utils/theme';
import { ScaledSheet } from 'react-native-size-matters';

RoundButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
}
export default function RoundButton(props) {
    const style = { ...styles.roundButton, ...props.style }
    return (
        <TouchableOpacity
            style={style}
            onPress={() => { props.onPress() }}>
            <Text style={styles.buttonTitle}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = ScaledSheet.create({
    roundButton: {
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 34
    },
    buttonTitle: {
        fontSize: fonts.large,
        fontFamily: fontFamilies.poppinsSemiBold,
        fontWeight: 'bold',
        color: colors.white
    },
})
