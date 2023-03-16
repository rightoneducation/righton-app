import { GameSessionState, isNullOrUndefined } from "@righton/networking"
import React, { useEffect, useState } from "react"
import { useFocusEffect } from '@react-navigation/native'
import { Image, ImageBackground, Text, View } from "react-native"
import { ScaledSheet } from "react-native-size-matters"
import PurpleBackground from "../../components/PurpleBackground"
import RoundButton from "../../components/RoundButton"
import sharedStyles from "../../Student/screens/Game/Components/sharedStyles"
import { fonts } from '../../utils/theme'
import RejoinModal from './RejoinModal'

export default function JoinGame({
    navigation,
    gameSession,
    loadLocalSession,
    clearLocalSession,
    handleRejoinSession,
    isFirstPlay
}) {
    const [isModalVisible, setIsModalVisible] = useState(true)
    const [prevGameData, setPrevGameData] = useState(null)

    useFocusEffect(
      React.useCallback(() => {
        loadLocalSession().then(data => {
            if (data){
              setPrevGameData(data)
              setIsModalVisible(true)
            }
        })  
      }, [navigation])
    )

    useEffect(() => { 
        if (isNullOrUndefined(gameSession)) {
            resetState()
            return
        }
        switch (gameSession.currentState) {
            case GameSessionState.NOT_STARTED:
                resetState()
                break

            case GameSessionState.TEAMS_JOINING:
                // Game hasn't started yet, just let the kids join
                navigation.navigate("StudentName")
                break

            case GameSessionState.CHOOSE_CORRECT_ANSWER:
                if (isFirstPlay === true)
                  navigation.navigate("PregameCountDown")
                else
                  navigation.navigate("PhaseOneBasicGamePlay")
                break

            case GameSessionState.PHASE_1_DISCUSS:
                navigation.navigate("PhaseOneBasicGamePlay")
                break

            case GameSessionState.PHASE_2_START:
                navigation.navigate("StartPhase")
                break

            case GameSessionState.CHOOSE_TRICKIEST_ANSWER:
            case GameSessionState.PHASE_2_DISCUSS:
                navigation.navigate("PhaseTwoBasicGamePlay")
                break

            case GameSessionState.PHASE_1_RESULTS:
            case GameSessionState.PHASE_2_RESULTS:
                navigation.navigate("PhaseResult")
                break

            case GameSessionState.FINAL_RESULTS:
                clearLocalSession()
                navigation.navigate("ScorePage")
                break

            case GameSessionState.FINISHED:
                resetState()
                break

            default:
                resetState()
                console.error(`Unhandled state: ${gameSession.currentState}`)
                break
        }
    }, [gameSession?.currentState])

    const handleJoinGame = () => {
        navigation.navigate("EnterGameCode")
    }

    const resetState = () => {
        navigation.navigate("JoinGame")
    }

    return (
        <View style={styles.container}>
            <PurpleBackground>
              <RejoinModal isModalVisible={true} prevGameData={prevGameData} handleRejoinSession={handleRejoinSession} clearLocalSession={clearLocalSession}/>
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
