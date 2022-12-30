import { isNullOrUndefined } from "@righton/networking"
import { useRef, useState } from "react"
import { Image, SafeAreaView, Text, TextInput, View } from "react-native"
import uuid from "react-native-uuid"
import PurpleBackground from "../../../components/PurpleBackground"
import RoundButton from "../../../components/RoundButton"
import { colors } from "../../../utils/theme"
import styles from "./styles"

const StudentName = ({ navigation, gameSession, setTeamInfo }) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const firstNameTextRef = useRef(null)
    const lastNameTextRef = useRef(null)
    const [showErrorText, setShowErrorText] = useState(false)

    onNameSubmit = () => {
        /*if (!firstName && firstNameTextRef) {
            firstNameTextRef.focus()
            return
        }

        if (!lastName && lastNameTextRef) {
            lastNameTextRef.focus()
            return
        }*/
        if (!firstName && this.firstNameInput) {
            this.firstNameInput.focus()
            setShowErrorText(true)
            return
        }
        if (!lastName && this.lastNameInput) {
            this.lastNameInput.focus()
            setShowErrorText(true)
            return
        }

        const teamName = `${firstName} ${lastName}`

        global.apiClient
            .addTeamToGameSessionId(gameSession.id, teamName, null)
            .then((team) => {
                console.debug(team)
                if (!team) {
                    console.error("Failed to add team")
                    return
                }


                global.apiClient
                    .addTeamMemberToTeam(team.id, true, uuid.v4())
                    .then((teamMember) => {
                        if (!teamMember) {
                            console.error("Failed to add team member")
                            return
                        }

                        if (isNullOrUndefined(team.teamMembers)) {
                            team.teamMembers = [teamMember]
                        }

                        return setTeamInfo(team, teamMember)
                    }).then(() => {
                        navigation.navigate("SelectTeam")
                    }).catch((error) => {
                        console.error(error)
                    })
            })
            .catch((error) => {
                console.error(error)
            })
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
                        {gameSession != null && !gameSession.isAdvanced && (
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
                                        ref={(ref) => {
                                            //this.firstNameTextRef = ref
                                            firstNameInput = ref
                                        }}
                                        returnKeyType={"done"}
                                        style={styles.input}
                                        textAlign={"center"}
                                        value={firstName}
                                        autoFocus={true}
                                    />
                                    <TextInput
                                        multiline={false}
                                        onChangeText={setLastName}
                                        onSubmitEditing={this.onNameSubmit}
                                        placeholder={"Last Name"}
                                        placeholderTextColor={colors.primary}
                                        ref={(ref) => {
                                            //this.lastNameTextRef = ref
                                            lastNameInput = ref
                                        }}
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
                                {showErrorText &&
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
                                }
                            </>
                        )}
                    </View>
                </PurpleBackground>
            </SafeAreaView>
        </>
    )
}

export default StudentName

