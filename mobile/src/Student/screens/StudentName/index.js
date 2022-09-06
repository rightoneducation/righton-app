import React, { Fragment, useEffect, useState } from 'react'
import {
  Text,
  TextInput,
  SafeAreaView,
  Image,
  View,
  StatusBar
} from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import NetInfo from '@react-native-community/netinfo'
import { colors } from '../../../utils/theme'
import styles from './styles'
import debug from '../../../utils/debug'
import RoundButton from '../../../components/RoundButton'
import PurpleBackground from '../../../components/PurpleBackground'
import { getUniqueId } from 'react-native-device-info'
import { GameSessionState } from '@righton/networking'

export default function StudentName({ navigation, route }) {
  

  const [name, setName] = useState("")
  const { gameSession} = route.params


  console.log(gameSession)
  onNameSubmit = () => {
    if (!name && nameInput) {
      this.nameInput.focus()
      return
    }

    global.apiClient.addTeamToGameSessionId(gameSession.id, name, null)
      .then(team => {
        console.debug(team)
        if (!team) {
          console.error('Failed to add team')
          return
        }
        getUniqueId().then((uniqueId) => {
          global.apiClient.addTeamMemberToTeam(team.id, true, uniqueId)
            .then(teamMember => {
              if (!teamMember) {
                console.error('Failed to add team member')
                return
              }

              console.debug(teamMember)
              navigation.navigate('StudentGameIntro', { gameSession, team, teamMember })
            }).catch(error => {
              console.error(error)
            })
        }).catch(error => {
          console.error(error)
        })
      })
  }

  handleNavigateToOnboardApp = () => {
    navigation.navigate('OnboardAppRouter')
  }

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#483a82' }} />
      <SafeAreaView style={styles.container}>
        <PurpleBackground style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.rightOnHeroImage}
              resizeMode='contain'
              source={require('../../../assets/images/rightOnLogo.png')} />
          </View>
          <View style={styles.entryContainer}>
            {gameSession != null && !gameSession.isAdvanced && (
              <>
                <Text style={styles.title}>
                  Enter Your Name
                </Text><TextInput
                  multiline={false}
                  onChangeText={setName}
                  onSubmitEditing={this.onNameSubmit}
                  placeholder={'Your name'}
                  placeholderTextColor={colors.primary}
                  ref={(ref) => { this.nameInput = ref }}
                  returnKeyType={'done'}
                  style={styles.input}
                  textAlign={'center'}
                  value={name}
                  autoFocus={true} /><RoundButton
                  title="Enter"
                  style={styles.enterButton}
                  onPress={this.onNameSubmit} />
              </>
           )
           }
          </View>
        </PurpleBackground>
      </SafeAreaView>
    </Fragment>
  )
}