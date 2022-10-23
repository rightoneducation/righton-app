import { Image, StyleSheet, Text, View } from 'react-native'
import { colors, fontFamilies, fonts, fontWeights } from '../../../../utils/theme'

const Answer = ({ text, icon, mode, isUserChoice }) => {
    const getMainBackgroundColor = () => {
        return mode === AnswerMode.RightAnswer ? colors.lightGreen : colors.white
    }

    const getPercentageBackgroundColor = () => {
        switch (mode) {
            case AnswerMode.RightAnswer:
                return colors.lightGreen
            case AnswerMode.ShowEmptyRightIcon:
                return "#F7F6F6"
        }
    }

    return (
        <View
            style={{
                ...styles.mainContainer,
                backgroundColor: getMainBackgroundColor()
            }}>
            <Text style={styles.text}>
                {text}
            </Text>
            <View style={{
                ...styles.percentageContainer,
                backgroundColor: getPercentageBackgroundColor()
            }}>
                {isUserChoice &&
                    <Image
                        style={styles.icon}
                        source={icon}
                    />
                }
            </View>
        </View>
    )
}

export const AnswerMode = {
    Disabled: "Disabled",
    Percentage: "Percentage",
    RightAnswer: "RightAnswer",
    PopularTrickAnswer: "PopularTrickAnswer",
    ShowEmptyRightIcon: "ShowEmptyRightIcon",
}

export default Answer

const styles = StyleSheet.create({
    mainContainer: {
        borderRadius: 12,
        borderColor: "#E4E4E6",
        borderWidth: 1,
        height: 47,
        flexDirection: "row",
        flex: 1,
        paddingLeft: 9,
        overflow: "hidden",
    },
    text: {
        fontFamily: fontFamilies.karlaRegular,
        fontWeight: fontWeights.bold,
        fontSize: fonts.xMedium,
        alignSelf: "center",
        color: "rgba(56, 68, 102, 1)",
        flex: 1,
    },
    percentageContainer: {
        backgroundColor: "#F7F6F6",
        width: 45,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        height: "90%",
        width: undefined,
        aspectRatio: 1,
        alignSelf: "center",
    },
})