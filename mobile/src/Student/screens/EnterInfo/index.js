import React from 'react'
import PurpleBackground from '../../../components/PurpleBackground'
import { Image, SafeAreaView, View, Text, TextInput } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { colors, fonts, fontFamilies } from '../../../utils/theme'
import RoundButton from '../../../components/RoundButton'

const EnterInfo = ({ navigation }) => {
  const [error, setError] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')

  const onSubmit = () => {
    if (firstName != '' && lastName != '') {
      navigation.navigate('StudentChooseTeam')
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <PurpleBackground style={styles.background}>
        <Image
          style={styles.rightOnHeroImage}
          resizeMode="contain"
          resizeMethod="resize"
          source={require('../../../assets/images/rightOnLogo.png')}
        />
        <View style={styles.formContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.inputField} onChangeText={setFirstName} autoCapitalize="none" />
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.inputField} onChangeText={setLastName} autoCapitalize="none" />
          <RoundButton title='Enter' style={{ backgroundColor: colors.buttonPrimary, width: '60%', marginLeft: '20%' }} onPress={() => {onSubmit()}} />
        </View>
      </PurpleBackground>
    </SafeAreaView>
  )
}

export default EnterInfo;

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
