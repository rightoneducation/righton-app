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

export default function StudentFirst({ navigation, route }) {

  const [portal, setPortal] = useState(null)
  const [gameCode, setGameCode] = useState("")
  const [name, setName] = useState("")
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
    global.apiClient.getGameSessionByCode(gameCode)
      .then(gameSession => {
        console.debug(gameSession)
        if (!gameSession) {
          console.debug('Invalid game code.')
          return
        }

        if (gameSession.currentState != GameSessionState.TEAMS_JOINING) {
          return
        }

        if (gameSession.isAdvanced) {
          return
        }
        setGameSession(gameSession)
      }).catch(error => {
        setPortal(`error joining ${gameCode}: ${error}`)
      })
  }

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
            <Text style={styles.title}>
              Enter Game Code
            </Text>
            <TextInput
              keyboardType={'number-pad'}
              maxLength={4}
              multiline={false}
              onChangeText={setGameCode}
              onSubmitEditing={this.onGameCodeSubmit}
              placeholder={'####'}
              placeholderTextColor={colors.primary}
              ref={(ref) => { gameInput = ref }}
              returnKeyType={'done'}
              style={styles.input}
              textAlign={'center'}
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
