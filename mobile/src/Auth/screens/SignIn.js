import React from 'react'
import { Auth } from 'aws-amplify'
import PurpleBackground from '../../components/PurpleBackground'
import { Image, SafeAreaView, View, Text, TextInput } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { colors, fonts, fontFamilies } from '../../utils/theme'
import RoundButton from '../../components/RoundButton'

const SignIn = ({ navigation }) => {
  const [error, setError] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleSignIn = async () => {
    try {
      await Auth.signIn(username, password)
      navigation.navigate('StudentFirst', { user: true })
    } catch (e) {
      console.log(e)
      setError("Invalid username or password")
    }
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
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username/Email</Text>
          <TextInput style={styles.inputField} onChangeText={setUsername} autoCapitalize="none" />
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.inputField} secureTextEntry={true} onChangeText={setPassword} autoCapitalize="none" />
          <RoundButton title='Enter' style={{ backgroundColor: colors.buttonPrimary, width: '60%', marginLeft: '20%' }} onPress={() => {handleSignIn()}} />
        </View>
        {error != '' && <Text style={styles.errorText}>{error}</Text>}
      </PurpleBackground>
    </SafeAreaView>
  )
}

export default SignIn;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPurple
  },
  background: {
    flex: 1
  },
  rightOnHeroImage: {
    marginTop: 22,
    width: 230,
    height: 118,
    alignSelf: 'center',
    marginBottom: '50@vs'
  },
  label: {
    fontFamily: fontFamilies.montserratBold,
    fontSize: fonts.medium,
    color: colors.white,
    alignSelf: 'center',
    marginBottom: '10@vs'
  },
  inputField: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 42,
    padding: 5,
    fontSize: 18,
    fontFamily: fontFamilies.montserratRegular,
    textAlign: 'center',
    marginBottom: '20@vs'
  },
  formContainer: {
    marginHorizontal: '7%'
  },
  errorText: {
    fontFamily: fontFamilies.montserratBold,
    fontSize: fonts.medium,
    color: colors.red,
    alignSelf: 'center',
    marginBottom: '10@vs',
    marginTop: '10@vs'
  },
})
