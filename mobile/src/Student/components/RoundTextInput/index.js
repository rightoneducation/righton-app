import React from 'react'
import { StyleSheet, View, TextInput, Image } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../utils/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'

const RoundTextInput = ({ icon, text, height, borderColor, onTappedIcon, data, onChangeText }) => {
    return (
        <View style={[styles.container, { height, borderColor }]}>
            <TextInput
                style={styles.input}
                placeholder="Text Here"
                value={text || ''}
                onChangeText={(text) => console.log(text)}
                underlineColorAndroid="transparent"
                onChangeText={(text) => onChangeText(data, text)}
            />
            <TouchableOpacity onPress={() => onTappedIcon(data)}>
                <Image source={icon} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
}

export default RoundTextInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 22,
        paddingLeft: scale(5),
        paddingRight: scale(5),
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: verticalScale(8),
        marginBottom: verticalScale(8),
    },
    icon: {
        padding: scale(10),
        width: 16,
        height: 16,
    },
    input: {
        color: '#384466',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
        marginRight: scale(5),
        flex: 1,
    },
})