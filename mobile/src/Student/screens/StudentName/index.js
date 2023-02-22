import { isNullOrUndefined } from "@righton/networking"
import { useRef, useState, useEffect } from "react"
import { Image, SafeAreaView, Text, TextInput, View } from "react-native"
import uuid from "react-native-uuid"
import PurpleBackground from "../../../components/PurpleBackground"
import RoundButton from "../../../components/RoundButton"
import { colors } from "../../../utils/theme"
import styles from "./styles"

const StudentName = ({ navigation, gameSession, setTeamInfo, handleAddTeam }) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const firstNameTextRef = useRef(null)
    const lastNameTextRef = useRef(null)
    const [showErrorText, setShowErrorText] = useState(false)

    const validateIsNotEmpty = (text, textInputRef) => {
        if (text) {
            setShowErrorText(false)
            return true
        }

        textInputRef.current.focus()

        setShowErrorText(true)
        return false
    }

    onNameSubmit = () => {
        if (!validateIsNotEmpty(firstName, firstNameTextRef) ||
            !validateIsNotEmpty(lastName, lastNameTextRef)) {
            return
        }

        const teamName = `${firstName} ${lastName}`
        handleAddTeam(teamName).then(() =>  navigation.navigate("SelectTeam"))
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
                        {(gameSession != null && !gameSession.isAdvanced) ? (
                            <>
                                <Text style={styles.title}>
                                    Enter Your Name
                                </Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        multiline={false}
                                        onChangeText={setFirstName}
                                        onSubmitEditing={this.onNameSubmit}
                                        placeholder={"First Name"}
                                        placeholderTextColor={colors.primary}
                                        ref={firstNameTextRef}
                                        returnKeyType={"done"}
                                        style={styles.input}
                                        textAlign={"center"}
                                        value={firstName}
                                    />
                                    <TextInput
                                        multiline={false}
                                        onChangeText={setLastName}
                                        onSubmitEditing={this.onNameSubmit}
                                        placeholder={"Last Name"}
                                        placeholderTextColor={colors.primary}
                                        ref={lastNameTextRef}
                                        returnKeyType={"done"}
                                        style={styles.input}
                                        textAlign={"center"}
                                        value={lastName}
                                    />
                                </View>
                                <RoundButton
                                    title="Enter"
                                    style={styles.enterButton}
                                    onPress={this.onNameSubmit}
                                />
                                {showErrorText ?
                                    <View>
                                        <Text
                                            style={styles.noNameErrorTextBold}>
                                            Type in both your first and{"\n"}
                                            last name to enter the game.{"\n"}
                                        </Text>
                                        <Text
                                            style={styles.noNameErrorText}>
                                            This will be used to identify you{"\n"}
                                            only during the game, and{"\n"}
                                            will not be stored.
                                        </Text>
                                    </View>
                                : null}
                            </>
                        ) : null}
                    </View>
                </PurpleBackground>
            </SafeAreaView>
        </>
    )
}
export default StudentName