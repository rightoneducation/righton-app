import { StyleSheet } from 'react-native'
import { scale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../../utils/theme'

export default StyleSheet.create({
    text: {
        textAlign: 'center',
        fontFamily: fontFamilies.karlaBold,
        fontWeight: 'bold',
        fontSize: fonts.small,
        color: '#384466'
    },
    cardContainer: {
        padding: scale(24),
    }
})