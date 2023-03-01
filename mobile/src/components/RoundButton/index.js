import PropTypes from 'prop-types'
import { Text, TouchableOpacity, View } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { colors, fontFamilies, fonts } from '../../utils/theme'

RoundButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool
}
export default function RoundButton(props) {
    const style = { ...styles.roundButton, ...props.style }
    return (
        <TouchableOpacity
            disabled={props.disabled || false}
            style={props.containerStyle}
            onPress={() => { props.onPress() }}
        >
            <View style={style}>
                <Text style={[styles.buttonTitle, props.titleStyle]}>{props.title}</Text>
            </View>
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
        fontFamily: fontFamilies.poppinsRegular,
        fontWeight: 'bold',
        color: colors.white
    },
})
