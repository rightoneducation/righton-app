import React from "react"
import { StyleSheet, View, Text, Image, Pressable } from "react-native"
import { scale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts } from "../../../utils/theme"

const RoundTextIcon = ({
    icon,
    text,
    height,
    borderColor,
    backgroundColor,
    marginHorizontal,
    onPress,
    data,
    showIcon,
    readonly,
    onTextChanged,
    style = {},
    disabled,
}) => {
    return (
        <Pressable
            disabled={disabled}
            onPress={() => onPress(data)}
        >
            <View
                style={[styles.container, { height, borderColor, backgroundColor, marginHorizontal }, { ...style }]}
                pointerEvents={readonly ? "none" : "auto"}
            >
                <Text style={styles.input}>
                    {text}
                </Text>
                {(showIcon === undefined ? false : showIcon) ? (
                    <Image source={icon} style={styles.icon} />
                ) : null}
            </View>
        </Pressable>
    )
}

export default RoundTextIcon

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 2,
        borderRadius: 22,
        paddingLeft: scale(10),
        paddingRight: scale(10),
        alignItems: "center",
        marginTop: verticalScale(5),
        marginBottom: verticalScale(5),
        alignSelf: "stretch",
    },
    icon: {
        padding: scale(10),
        width: 16,
        height: 16,
    },
    input: {
        color: "#384466",
        fontFamily: fontFamilies.karlaRegular,
        fontSize: fonts.xxMedium,
        marginRight: scale(5),
        marginLeft: scale(5),
        flex: 1,
    },
})