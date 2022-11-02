import React from "react"
import { StyleSheet, View, TextInput, Image, Pressable } from "react-native"
import { scale, verticalScale } from "react-native-size-matters"
import { fontFamilies, fonts } from "../../../utils/theme"

const RoundTextIcon = ({
    icon,
    text,
    height,
    borderColor,
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
                style={[styles.container, { height, borderColor }, { ...style }]}
                pointerEvents={readonly ? "none" : "auto"}
            >
                <TextInput
                    editable={!readonly}
                    style={styles.input}
                    onSubmitEditing={(event) =>
                        onTextChanged(data, event.nativeEvent.text)
                    }
                >
                    {text}
                </TextInput>
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
        paddingTop: scale(15),
        paddingBottom: scale(15),
        backgroundColor: "white",
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
        fontSize: fonts.xMedium,
        marginRight: scale(5),
        marginLeft: scale(5),
        flex: 1,
    },
})
