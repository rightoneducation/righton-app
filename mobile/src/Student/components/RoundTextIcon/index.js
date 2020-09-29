import React from 'react'
import { StyleSheet, View, TextInput, Image, Pressable } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../utils/theme'

const RoundTextIcon = ({ icon, text, height, borderColor, onIconPress, data, onTextChanged }) => {
    return (
        <View>
            <View style={[styles.container, { height, borderColor }]}>
                <TextInput
                    style={styles.input}
                    onSubmitEditing={(event) => onTextChanged(data, event.nativeEvent.text)}
                >
                    {text}
                </TextInput>
                <Pressable onPress={() => onIconPress(data)}>
                    <View style={styles.iconContainer}>
                        <Image source={icon} style={styles.icon} />
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default RoundTextIcon

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
        alignSelf: 'stretch',
    },
    icon: {
        padding: scale(10),
        width: 16,
        height: 16,
    },
    iconContainer: {
        width: 44,
        alignItems: 'flex-end'
    },
    input: {
        color: '#384466',
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xMedium,
        marginRight: scale(5),
        paddingLeft: scale(5),
        flex: 1,
    },
})