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

export default function StudentName({
    navigation,
    route,
    gameSession,
    setTeamInfo,
}) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const teamName = `${firstName} ${lastName}`

    onNameSubmit = () => {
        if (!firstName && !lastName && nameInput) {
            this.nameInput.focus()
            return
        }

        global.apiClient
            .addTeamToGameSessionId(gameSession.id, teamName, null)
            .then((team) => {
                console.debug(team)
                if (!team) {
                    console.error("Failed to add team")
                    return
                }

                getUniqueId()
                    .then((uniqueId) => {
                        global.apiClient
                            .addTeamMemberToTeam(team.id, true, uniqueId)
                            .then((teamMember) => {
                                if (!teamMember) {
                                    console.error("Failed to add team member")
                                    return
                                }

                                setTeamInfo(team, teamMember)

                                navigation.navigate("StudentGameIntro", {
                                    gameSession,
                                    team,
                                    teamMember,
                                })
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            })
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
                                            this.nameInput = ref
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
                                            this.nameInput = ref
                                        }}
                                        returnKeyType={"done"}
                                        style={styles.input}
                                        textAlign={"center"}
                                        value={lastName}
                                        autoFocus={true}
                                    />
                                </View>
                                <RoundButton
                                    title="Enter"
                                    style={styles.enterButton}
                                    onPress={this.onNameSubmit}
                                />
                            </>
                        )}
                    </View>
                </PurpleBackground>
            </SafeAreaView>
        </Fragment>
    )
}
