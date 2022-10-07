import { useState } from "react"
import {
  Image, SafeAreaView, Text,
  TextInput, View
} from "react-native"
import { getUniqueId } from "react-native-device-info"
import PurpleBackground from "../../../components/PurpleBackground"
import RoundButton from "../../../components/RoundButton"
import { colors } from "../../../utils/theme"
import styles from "./styles"

const StudentName = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const { gameSession } = route.params

  const teamName = `${firstName} ${lastName}`

  onNameSubmit = () => {
    if (!firstName) {
      firstNameInput.focus()
    }

    if (!lastName) {
      this.lastNameInput.focus()
    }

    global.apiClient
      .addTeamToGameSessionId(gameSession.id, teamName, null)
      .then((team) => {
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

                console.debug(teamMember)
                navigation.navigate("SelectTeam", {
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

  handleNavigateToOnboardApp = () => {
    navigation.navigate("OnboardAppRouter")
  }

  return (
    <>
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
                <Text style={styles.title}>Enter Your Name</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    multiline={false}
                    onChangeText={setFirstName}
                    onSubmitEditing={this.onNameSubmit}
                    placeholder={"First Name"}
                    placeholderTextColor={colors.grey}
                    ref={(ref) => {
                      this.firstNameInput = ref
                    }}
                    returnKeyType={"next"}
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
                    placeholderTextColor={colors.grey}
                    ref={(ref) => {
                      this.lastNameInput = ref
                    }}
                    returnKeyType={"join"}
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
              </>
            )}
          </View>
        </PurpleBackground>
      </SafeAreaView>
    </>
  )
}

export default StudentName