import React, { Fragment, useEffect, useState } from "react"
import {
    Text,
    TextInput,
    SafeAreaView,
    Image,
    View,
    StatusBar,
} from "react-native"
import { verticalScale } from "react-native-size-matters"
import NetInfo from "@react-native-community/netinfo"
import { colors } from "../../../utils/theme"
import styles from "./styles"
import debug from "../../../utils/debug"
import RoundButton from "../../../components/RoundButton"
import PurpleBackground from "../../../components/PurpleBackground"
import { getUniqueId } from "react-native-device-info"
import { GameSessionState } from "@righton/networking"

export default function StudentFirst({ navigation, route, setGlobalGameCode }) {
    const [portal, setPortal] = useState(null)
    const [gameCode, setGameCode] = useState("")
    const [gameSession, setGameSession] = useState(null)

    onGameCodeSubmit = () => {
        this.handleGameEntry()
    }

    handleGameEntry = () => {
        if (!gameCode && this.gameInput) {
            this.gameInput.focus()
            return
        }

        setPortal(`Joining ${gameCode}`)
        setGlobalGameCode(gameCode)
        navigation.navigate("StudentName")

        // global.apiClient
        //   .getGameSessionByCode(gameCode)
        //   .then((gameSession) => {
        //     if (!gameSession) {
        //       console.debug("Invalid game code.")
        //       return
        //     }

        //     if (gameSession.currentState != GameSessionState.TEAMS_JOINING) {
        //       return
        //     }

        //     if (gameSession.isAdvanced) {
        //       return
        //     }

        //     setGameSession(gameSession)
        //     navigation.navigate("StudentName", { gameSession })
        //   })
        //   .catch((error) => {
        //     setPortal(`error joining ${gameCode}: ${error}`)
        //   })
    }

    handleNavigateToOnboardApp = () => {
        navigation.navigate("OnboardAppRouter")
    }

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: "#483a82" }} />
            <SafeAreaView style={styles.container}>
                <PurpleBackground style={styles.innerContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.rightOnHeroImage}
                            resizeMode="contain"
                            source={require("../../../assets/images/rightOnLogo.png")}
                        />
                    </View>
                    <View style={styles.entryContainer}>
                        <Text style={styles.title}>Enter Game Code</Text>
                        <TextInput
                            keyboardType={"number-pad"}
                            maxLength={4}
                            multiline={false}
                            onChangeText={setGameCode}
                            onSubmitEditing={this.onGameCodeSubmit}
                            placeholder={"####"}
                            placeholderTextColor={colors.primary}
                            ref={(ref) => {
                                gameInput = ref
                            }}
                            returnKeyType={"done"}
                            style={styles.input}
                            textAlign={"center"}
                            value={gameCode}
                            autoFocus={true}
                            editable={gameSession == null}
                        />
                        <RoundButton
                            title="Enter"
                            disabled={gameSession != null}
                            style={styles.enterButton}
                            onPress={this.onGameCodeSubmit}
                        />
                    </View>
                </PurpleBackground>
            </SafeAreaView>
        </Fragment>
    )
}
