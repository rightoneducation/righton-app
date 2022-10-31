import React, { useEffect } from "react"
import { Text, View, Image, SafeAreaView } from "react-native"
import { ScaledSheet } from "react-native-size-matters"
import { colors, fonts, fontFamilies } from "../../utils/theme"
import RoundButton from "../../components/RoundButton"
import PurpleBackground from "../../components/PurpleBackground"
import { GameSessionState } from "@righton/networking"

export default function JoinGame({
    navigation,
    gameSession,
    team,
    teamMember,
}) {

    useEffect(() => {
        switch (gameSession?.currentState) {
            case GameSessionState.NOT_STARTED:
            case GameSessionState.TEAMS_JOINING:
                // Game hasn't started yet, just let the kids join
                break

            case GameSessionState.CHOOSE_CORRECT_ANSWER:
                return navigation.navigate("PregameCountDown", {
                    gameSession,
                    team,
                    teamMember,
                })

            case GameSessionState.PHASE_1_DISCUSS:
                return navigation.navigate("PhaseOneBasicGamePlay", {
                    gameSession,
                    team,
                    teamMember,
                })

            case GameSessionState.PHASE_2_START:
                return navigation.navigate("StartPhase", {
                    gameSession,
                    team,
                    teamMember,
                })

            case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
            case GameSessionState.PHASE_2_DISCUSS:
                return navigation.navigate("PhaseTwoBasicGamePlay", {
                    gameSession,
                    team,
                    teamMember,
                })

            case GameSessionState.PHASE_1_RESULTS:
            case GameSessionState.PHASE_2_RESULTS:
                return navigation.navigate("PhaseResult", {
                    gameSession,
                    team,
                    teamMember,
                })

            case GameSessionState.FINAL_RESULTS:
                return navigation.navigate("ScorePage", {
                    gameSession,
                    team,
                    teamMember,
                })

            default:
                return navigation.navigate("JoinGame")
        }
    }, [gameSession?.currentState])

    function handleJoinGame() {
        navigation.navigate("EnterGameCode")
    }

    return (
        <SafeAreaView style={styles.container}>
            <PurpleBackground style={styles.background}>
                <Image
                    style={styles.rightOnHeroImage}
                    resizeMode="contain"
                    resizeMethod="resize"
                    source={require("../../assets/images/rightOnLogo.png")}
                />
                <View style={styles.buttonsContainer}>
                    <RoundButton
                        title="Join Game"
                        style={{ backgroundColor: colors.buttonPrimary }}
                        onPress={() => handleJoinGame()}
                    />
                </View>
            </PurpleBackground>
        </SafeAreaView>
    )
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundPurple,
    },
    buttonsContainer: {
        height: 180,
        marginLeft: 33,
        marginRight: 33,
        justifyContent: "space-between",
    },
    footerText: {
        fontSize: fonts.medium,
        fontWeight: "bold",
        alignItems: "center",
        textAlign: "center",
        marginHorizontal: 50,
        marginTop: -90,
        fontFamily: fontFamilies.montserratRegular,
        color: "rgba(255, 255, 255, 0.9)",
    },
    background: {
        flex: 1,
        justifyContent: "space-around",
    },
    rightOnHeroImage: {
        marginTop: 22,
        width: 230,
        height: 118,
        alignSelf: "center",
    },
    headerText: {
        fontSize: fonts.small,
        fontWeight: "bold",
        fontFamily: fontFamilies.montserratBold,
        color: colors.white,
        marginTop: 9,
        width: 230,
        textAlign: "center",
    },
    bottomUser: {
        fontSize: fonts.medium,
        fontWeight: "bold",
        fontFamily: fontFamilies.montserratBold,
        color: colors.white,
        alignSelf: "center",
    },
    userContainer: {
        alignSelf: "center",
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 10,
    },
})
