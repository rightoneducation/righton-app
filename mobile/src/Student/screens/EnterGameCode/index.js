import { useState } from "react"
import { Image, SafeAreaView, Text, TextInput, View } from "react-native"
import PurpleBackground from "../../../components/PurpleBackground"
import RoundButton from "../../../components/RoundButton"
import { colors } from "../../../utils/theme"
import styles from "./styles"

export default function EnterGameCode({
    navigation,
    setGlobalGameCode,
}) {
    const [gameCode, setGameCode] = useState("")

    onGameCodeSubmit = () => {
        this.handleGameEntry()
    }

    handleGameEntry = () => {
        if (!gameCode && this.gameInput) {
            this.gameInput.focus()
            return
        }
        setGlobalGameCode(gameCode)
        navigation.navigate("StudentName")
    }

    return (
        <>
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
                            editable
                        />
                        <RoundButton
                            title="Enter"
                            disabled={gameCode.length < 4}
                            style={styles.enterButton}
                            onPress={this.onGameCodeSubmit}
                        />
                    </View>
                </PurpleBackground>
            </SafeAreaView>
        </>
    )
}
