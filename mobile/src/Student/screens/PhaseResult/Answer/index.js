import { Image, StyleSheet, Text, View } from 'react-native'
import { colors, fontFamilies, fonts, fontWeights } from '../../../../utils/theme'

const Answer = ({ text, icon, mode, isUserChoice, percentage }) => {
    const getMainBackgroundColor = () => {
        switch (mode) {
            case AnswerMode.RightAnswer:
                return '#D7EFC3'
            case AnswerMode.PopularTrickAnswer:
                return "rgba(101, 21, 201, 1)"
            default:
                return colors.white
        }
    }

    const getPercentageBackgroundColor = () => {
        switch (mode) {
            case AnswerMode.RightAnswer:
                return '#D7EFC3'
            case AnswerMode.ShowEmptyRightIcon:
                return "#F7F6F6"
            case AnswerMode.PopularTrickAnswer:
                return "rgba(101, 21, 201, 1)"
            default:
                return colors.white
        }
    }

    const getAnswerColor = () => {
        switch (mode) {
            case AnswerMode.Disabled:
                return "#AFB4C2"
            case AnswerMode.PopularTrickAnswer:
                return colors.white
            default:
                return colors.black
        }
    }

    return (
        <View
            style={{
                ...styles.mainContainer,
                backgroundColor: getMainBackgroundColor()
            }}>
            <Text style={{
                ...styles.text,
                color: getAnswerColor()
            }}>
                {text}
            </Text>
            <View style={{
                ...styles.percentageContainer,
                backgroundColor: getPercentageBackgroundColor(),
                minWidth: isUserChoice ? undefined : 45
            }}>
                {isUserChoice &&
                    <Image
                        style={styles.icon}
                        source={icon}
                    />
                }
                <Text style={{
                    ...styles.percentageText,
                    color: getAnswerColor(),
                }}>
                    {percentage}
                </Text>
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
    UserAnswer: "UserAnswer",
}

export default Answer

const sharedTextStyle = {
    fontFamily: fontFamilies.karlaRegular,
    fontWeight: fontWeights.bold,
    fontSize: fonts.xMedium,
    color: "rgba(56, 68, 102, 1)",
}
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
        alignItems: "center",
        justifyContent: "space-between",
    },
    text: {
        ...sharedTextStyle,
        flexGrow: 2,
    },
    percentageContainer: {
        paddingRight: 9,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100%",
    },
    percentageText: {
        ...sharedTextStyle,
       
    },
    icon: {
        maxHeight: 40,
        maxWidth: 40,
    },
})