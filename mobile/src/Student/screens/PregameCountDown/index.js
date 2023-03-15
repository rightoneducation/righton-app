import { Dimensions, StyleSheet, Text } from "react-native"
import { scale } from "react-native-size-matters"
import React from 'react';
import { useFocusEffect } from '@react-navigation/native'
import PurpleBackground from "../../../components/PurpleBackground"
import { fontFamilies, fonts } from "../../../utils/theme"
import LoadingIndicator from "../../components/LoadingIndicator"

const PregameCountDown = ({
    navigation,
    teamAvatar,
    team,
    gameSession,
    saveLocalSession
}) => {

    //team data stored in local session in case player drops
    useFocusEffect(
        React.useCallback(() => {
            const resetOnLeaveScreen = navigation.addListener('focus', () => {
                saveLocalSession(teamAvatar, team, gameSession)
            });
            return resetOnLeaveScreen
        },[navigation])
    )
    return (
        <PurpleBackground style={styles.mainContainer}>
            <LoadingIndicator
                theme={[
                    "#F5246A20",
                    "#F5246A40",
                    "#F5246A60",
                    "#F5246A80",
                    "#F5246AA0",
                    "#F5246AC0",
                    "#F5246AE0",
                    "#F5246AFF",
                ]}
                radius={Dimensions.get("window").width / 2 - scale(30) * 2}
                fontSize={scale(100)}
                timerStartInSecond={3}
                onTimerFinished={() => {
                    navigation.navigate("PhaseOneBasicGamePlay")
                }}
            />
            <Text style={styles.text}>
                Your team's question will appear soon. {"\n"}{"\n"}Pick the correct answer!
            </Text>
        </PurpleBackground>
    )
}

export default PregameCountDown

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: "column",
        paddingLeft: scale(30),
        paddingRight: scale(30),
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "white",
        fontFamily: fontFamilies.montserratBold,
        fontSize: fonts.medium,
        fontWeight: "bold",
        marginLeft: 34,
        marginRight: 34,
        textAlign: "center",
    },
})
