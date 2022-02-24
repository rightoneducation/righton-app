import React, { useState } from 'react'
import { Text, SafeAreaView, ScrollView, TextInput, View, Image } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { colors, fontFamilies, fonts } from '../../utils/theme'
import PurpleBackground from '../../components/PurpleBackground'
import DropDownPicker from 'react-native-dropdown-picker'
import RoundButton from '../../components/RoundButton'

const PersonalDetails = ({ route, navigation }) => {
  const { username, password, email } = route.params
  const [openRaceDropdown, setOpenRaceDropdown] = useState(false)
  const [race, setRace] = useState(null)
  const [raceOptions, setRaceOptions] = useState([
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
    { label: 'Asian', value: 'asian' },
    { label: 'Black or African American', value: 'african_american' },
    { label: 'Hispanic or Latino', value: 'hispanic_or_latino' },
    { label: 'Native American or Alaskan Native', value: 'native_american_or_alaskan_native' },
    { label: 'White', value: 'white' },
    { label: 'Other', value: 'other' },
  ])
  const [openGenderDropdown, setOpenGenderDropDown] = useState(false)
  const [gender, setGender] = useState(null)
  const [genderOptions, setGenderOptions] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other/Prefer not to say', value: 'other' }
  ])
  const [openGradeDropdown, setOpenGradeDropdown] = useState(false)
  const [grade, setGrade] = useState(null)
  const [gradeOptions, setGradeOptions] = useState([
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
  ])

  const handleSignUp = () => {

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
        <View style={styles.rowContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.inputField} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.inputField} />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>School Zip</Text>
            <TextInput style={styles.inputField} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Race/Ethnicity</Text>
            <DropDownPicker
              open={openRaceDropdown}
              value={race}
              items={raceOptions}
              setOpen={setOpenRaceDropdown}
              setValue={setRace}
              setItems={setRaceOptions}
              containerStyle={styles.dropDownPicker}
              style={styles.dropDownPicker}
              zIndex={1000}
              maxHeight={60}
            />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <DropDownPicker
              open={openGenderDropdown}
              value={gender}
              items={genderOptions}
              setOpen={setOpenGenderDropDown}
              setValue={setGender}
              setItems={setGenderOptions}
              containerStyle={styles.dropDownPicker}
              style={styles.dropDownPicker}
              zIndex={1000}
              maxHeight={60}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Grade</Text>
            <DropDownPicker
              open={openGradeDropdown}
              value={grade}
              items={gradeOptions}
              setOpen={setOpenGradeDropdown}
              setValue={setGrade}
              setItems={setGradeOptions}
              containerStyle={styles.dropDownPicker}
              style={styles.dropDownPicker}
              zIndex={1000}
              maxHeight={60}
            />
          </View>
        </View>
        <RoundButton title='Sign Up' style={{ backgroundColor: colors.buttonPrimary, width: '60%', marginLeft: '20%', marginTop: 30 }} onPress={() => {handleSignUp()}} />
      </PurpleBackground>
    </SafeAreaView>
  )
}

export default PersonalDetails

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
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginBottom: 40
  },
  inputField: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 42,
    padding: 5,
    fontSize: 18,
    width: '90%',
    fontFamily: fontFamilies.montserratRegular,
    textAlign: 'center',
    marginBottom: '20@vs'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    textAlign: 'center',
    alignItems: 'center'
  },
  label: {
    fontFamily: fontFamilies.montserratBold,
    fontSize: fonts.medium,
    color: colors.white,
    alignSelf: 'center',
    marginBottom: '10@vs'
  },
  dropDownPicker: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 42,
    borderColor: colors.white,
    width: '90%',
  }
})
