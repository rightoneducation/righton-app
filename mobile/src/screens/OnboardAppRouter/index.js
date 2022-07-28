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
<<<<<<< HEAD
import { Auth } from 'aws-amplify'

export default function OnboardAppRouter({ navigation }) {
  const [user, setUser] = React.useState(null)

  function handleJoinGame() {
    // screenProps.handleSetAppState('deviceSettings', { role: 'teacher' });
    if (user == null) {
      setTimeout(() => navigation.navigate('StudentFirst', { user: false }), 250)
    } else {
      setTimeout(() => navigation.navigate('StudentFirst', { user: true }), 250)
    }
  }

  function handleSignIn() {
    // screenProps.handleSetAppState('deviceSettings', { username: `${Math.random()}`, role: 'student' });
    setTimeout(() => navigation.navigate('SignIn'), 250)
  }

  function handleSignUp() {
    setTimeout(() => navigation.navigate('SignUp'), 250)
  }

  async function handleSignOut() {
    await Auth.signOut()
    setUser(null)
  }

  async function getUser() {
    try {
      const user = await Auth.currentUserInfo()
      if (user) setUser(user)
    } catch (e) {
      console.log(e)
    }
  }

  React.useEffect(() => {
    getUser()
  }, [])

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
          {!user ?
            <RoundButton
              title="Sign In"
              style={{ backgroundColor: colors.buttonSecondary }}
              onPress={() => handleSignIn()}
            /> : 
            <RoundButton
              title="Sign Out"
              style={{ backgroundColor: colors.buttonSecondary }}
              onPress={() => handleSignOut()}
            />
          }
        </View>
        <Text style={styles.footerText}>
          Making an account lets you join a game quicker! Don’t have an account? 
        <Text onPress={() => handleSignUp()} style={{ color: colors.lightblue }}>Tap Here to make one!</Text>
        </Text>
        <View style={styles.userContainer}>
          {user !== null ? (<Text style={styles.bottomUser}>{user.username}</Text>) 
          : (<Text style={styles.bottomUser}>Not signed in</Text>)}
        </View>
=======

export default function OnboardAppRouter({ navigation }) {
  function handleTeacher() {
    // screenProps.handleSetAppState('deviceSettings', { role: 'teacher' });
    setTimeout(() => navigation.navigate('TeacherApp'), 250)
  }

  function handleStudent() {
    // screenProps.handleSetAppState('deviceSettings', { username: `${Math.random()}`, role: 'student' });
    setTimeout(() => navigation.navigate('StudentFirst'), 250)
  }

  return (
    <SafeAreaView style={styles.container}>
      <PurpleBackground>
        <ImageBackground style={styles.heroImage} source={require('../../assets/images/mathBottleHero.png')}>
          <Image
            style={styles.rightOnHeroImage}
            resizeMode="contain"
            resizeMethod="resize"
            source={require('../../assets/images/rightOnLogo.png')}
          />
          <Text style={styles.headerText}>
            Unlocking every student’s potential in math!
          </Text>
        </ImageBackground>
        <View style={styles.buttonsContainer}>
          <RoundButton
            title="I'm a Student"
            style={{ backgroundColor: colors.buttonSecondary }}
            onPress={() => handleStudent()}
          />
          <RoundButton
            title="I'm a Teacher"
            style={{ backgroundColor: colors.buttonPrimary }}
            onPress={() => handleTeacher()}
          />
        </View>
        <Text style={styles.footerText}>
          Legal notice legal notice legal notice legal notice legal notice legal notice
        </Text>
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
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
<<<<<<< HEAD
    height: 180,
=======
    height: 145,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
    marginLeft: 33,
    marginRight: 33,
    justifyContent: 'space-between'
  },
  footerText: {
<<<<<<< HEAD
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
=======
    height: 30,
    marginTop: 10,
    marginLeft: 82,
    marginRight: 74,
    marginBottom: 12,
    fontSize: fonts.tiny,
    lineHeight: 15,
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: -0.04,
    fontFamily: fontFamilies.poppinsRegular,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  heroImage: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
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
<<<<<<< HEAD
  },
  bottomUser: {
    fontSize: fonts.medium,
    fontWeight: 'bold',
    fontFamily: fontFamilies.montserratBold,
    color: colors.white,
    alignSelf: 'center',
  },
  userContainer: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
=======
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
  }
})
