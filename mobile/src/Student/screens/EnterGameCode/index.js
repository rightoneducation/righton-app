import { isNullOrUndefined } from "@righton/networking"
import { useState } from "react"
import { Image, SafeAreaView, Text, TextInput, View } from "react-native"
import PurpleBackground from "../../../components/PurpleBackground"
import RoundButton from "../../../components/RoundButton"
import { colors } from "../../../utils/theme"
import styles from "./styles"

const EnterGameCode = ({ navigation, fetchGameSessionByCode }) => {
    const [gameCode, setGameCode] = useState("")
    const [showErrorText, setShowErrorText] = useState(false)

    onGameCodeSubmit = () => {
        if (!gameCode && this.gameInput) {
            this.gameInput.focus()
            return
        }
        fetchGameSessionByCode(parseInt(gameCode))
            .then(gameSession => {
                if (isNullOrUndefined(gameSession)) {
                    console.debug("No game session found!")
                    setShowErrorText(true)
                    return
                }
                setGameCode(gameCode)
            }).catch(error => {
                console.debug(`Failed to fetch the game session ${error}`)
                setShowErrorText(true)
            })
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: "#312759" }} />
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
                            editable
                        />
                        <RoundButton
                            title="Enter"
                            disabled={gameCode.length < 4}
                            style={styles.enterButton}
                            onPress={this.onGameCodeSubmit}
                        />
                        {showErrorText && <Text
                            style={{ ...styles.errorText }}>
                            We were unable to{"\n"}join this game.{"\n"}
                            {"\n"}Check the Game Code{"\n"}and try again.
                        </Text>
                        }
                    </View>
                </PurpleBackground>
            </SafeAreaView>
        </>
    )
}

export default EnterGameCode

