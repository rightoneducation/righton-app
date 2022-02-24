import React from 'react'
import {
  Text,
  View,
  ImageBackground,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { colors, fonts, fontFamilies } from '../../utils/theme'
import RoundButton from '../../components/RoundButton'
import PurpleBackground from '../../components/PurpleBackground'

export default function OnboardAppRouter({ navigation }) {
  function handleJoinGame() {
    // screenProps.handleSetAppState('deviceSettings', { role: 'teacher' });
    setTimeout(() => navigation.navigate('StudentFirst'), 250)
  }

  function handleSignIn() {
    // screenProps.handleSetAppState('deviceSettings', { username: `${Math.random()}`, role: 'student' });
    setTimeout(() => navigation.navigate('SignIn'), 250)
  }

  function handleSignUp() {
    setTimeout(() => navigation.navigate('SignUp'), 250)
  }

  return (
    <SafeAreaView style={styles.container}>
      <PurpleBackground style={styles.background}>
        <Image
          style={styles.rightOnHeroImage}
          resizeMode="contain"
          resizeMethod="resize"
          source={require('../../assets/images/rightOnLogo.png')}
        />
        <View style={styles.buttonsContainer}>
          <RoundButton
            title="Join Game"
            style={{ backgroundColor: colors.buttonPrimary }}
            onPress={() => handleJoinGame()}
          />
          <RoundButton
            title="Sign In"
            style={{ backgroundColor: colors.buttonSecondary }}
            onPress={() => handleSignIn()}
          />
        </View>
        <Text style={styles.footerText}>
          Making an account lets you join a game quicker! Don’t have an account? 
          <Text onPress={() => handleSignUp()} style={{ color: colors.lightblue }}>Tap Here to make one!</Text>
        </Text>
      </PurpleBackground>
    </SafeAreaView>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPurple
  },
  buttonsContainer: {
    height: 180,
    marginLeft: 33,
    marginRight: 33,
    justifyContent: 'space-between'
  },
  footerText: {
    fontSize: fonts.medium,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
    marginHorizontal: 50,
    marginTop: -90,
    fontFamily: fontFamilies.montserratRegular,
    color: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    flex: 1,
    justifyContent: "space-around"
  },
  rightOnHeroImage: {
    marginTop: 22,
    width: 230,
    height: 118,
    alignSelf: 'center'
  },
  headerText: {
    fontSize: fonts.small,
    fontWeight: 'bold',
    fontFamily: fontFamilies.montserratBold,
    color: colors.white,
    marginTop: 9,
    width: 230,
    textAlign: 'center'
  }
})
