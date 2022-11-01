import React, { useEffect } from "react"
import { Text, View, Image, ImageBackground } from "react-native"
import { ScaledSheet } from "react-native-size-matters"
import { GameSessionState } from "@righton/networking"
import RoundButton from "../../components/RoundButton"
import PurpleBackground from "../../components/PurpleBackground"
import sharedStyles from "../../Student/screens/Game/Components/sharedStyles"
import { fonts } from '../../utils/theme'

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
        <View style={styles.container}>
            <PurpleBackground>
                <View style={styles.heroContainer}>
                    <ImageBackground style={styles.heroImage} source={require("../../assets/images/Hero.png")} resizeMode="cover">
                        <View style={styles.heroText}>
                            <Image
                                style={styles.logo}
                                resizeMode="contain"
                                resizeMethod="resize"
                                source={require("../../assets/images/rightOnLogo.png")}
                            />
                            <Text style={[sharedStyles.text, styles.caption]}>
                                Unlocking every student's potential in math!
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.buttonsContainer}>
                    <RoundButton
                        title="Join Game"
                        style={{ backgroundColor: '#159EFA' }}
                        onPress={() => handleJoinGame()}
                    />
                </View>
            </PurpleBackground>
        </View>
    )
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#312759',
    },
    heroContainer: {
        flex: 4,
    },
    heroImage: {
        flex: 1,
    },
    heroText: {
        flex: 1,
        paddingHorizontal: 50,
        color: 'white',
        justifyContent: 'flex-start',
    },
    logo: {
        width: '100%',
        height: 120,
        marginTop: 50,
        marginBottom: 20,
    },
    caption: {
        color: 'white',
        fontSize: fonts.medium,
        textAlign: 'center',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 30,
        paddingHorizontal: 40,
    },
})
