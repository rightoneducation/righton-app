import { StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../../../../utils/theme'

const Hint = ({ hintNo, hint }) => {
    return (
        <View key={hintNo} style={styles.container}>
            <Text style={styles.hintNoText}>{hintNo}</Text>
            <Text style={styles.hintText}>{hint}</Text>
        </View>
    )
}

export default Hint

const styles = StyleSheet.create({
    container: {
        marginLeft: scale(24),
        marginRight: scale(24),
        marginTop: verticalScale(24),
        flex: 1,
        flexDirection: 'row',
    },
    hintNoText: {
        color: '#4700B2',
        fontFamily: fontFamilies.montserratBold,
        fontWeight: 'bold',
        fontSize: fonts.medium,
        marginRight: scale(10),
    },
    hintText: {
        color: '#384466',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xxMedium,
        marginRight: 10
    }
})
