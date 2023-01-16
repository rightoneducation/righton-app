import { useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale } from 'react-native-size-matters'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import PurpleBackground from '../../../components/PurpleBackground'
import RoundButton from '../../../components/RoundButton'
import { colors, fontFamilies, fonts } from '../../../utils/theme'
import TeamIcons from '../../containers/TeamIcons'

const SelectTeam = ({ navigation, team, saveTeamAvatar }) => {
  console.log(team)
  const [avatar, setAvatar] = useState(TeamIcons[0])
  const [enabledSubmitButton, setEnabledSubmitButton] = useState(true)

  const goBack = () => {
    navigation.navigate("StudentName")
  }

  const selectTeam = (icon) => {
    const avatar = TeamIcons.find(val => val.id === icon.id)
    setAvatar(avatar)
    setEnabledSubmitButton(true)
    saveTeamAvatar(avatar)
  }

  const submit = () => {
    navigation.navigate("StudentGameIntro")
  }

  return (
    <SafeAreaView style={styles.container}>
      <PurpleBackground>
        <View style={styles.headerContainer}>
          <Pressable
            onPress={goBack}
            style={styles.backButton}
          >
            <Image source={require('./img/BackButton.png')} />
          </Pressable>
          <Text style={styles.headerText}>
            Choose an Avatar!
          </Text>
        </View>
        <View style={styles.teamIcons}>
          <FlatList
            data={TeamIcons}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={item => `${item.id}`}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ alignContent: 'stretch' }}
            renderItem={({ item }) =>
              <View
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => selectTeam(item)}
                style={styles.teamIconContainer}
              >
                <Image source={item.smallSrc} style={ (item == avatar) ? styles.selectedTeamIcon :
                  styles.teamIcon} />
              </View>
            }
          />
        </View>
        <View style={styles.teamIconNameContainer}>
          <Image style={styles.largeIcon} source={avatar && avatar.largeSrc} />
          <Text style={styles.fullNameText}>
            {team ? team.name: null}  {/*propertyuuid doesn't exist*/}
          </Text>
        </View>
        <View>
          <RoundButton
            title='Submit'
            style={{
              backgroundColor: colors.buttonSecondary,
              width: 84,
              height: 30,
              alignSelf: 'center'
            }}
            disabled={!enabledSubmitButton}
            titleStyle={{
              fontSize: fonts.xxMedium,
              fontFamily: fontFamilies.karlaRegular,
              fontWeight: '700',
              color: enabledSubmitButton ? 'white' : colors.lightGray
            }}
            onPress={submit} />
        </View>
      </PurpleBackground>
    </SafeAreaView>
  )
}

export default SelectTeam

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundPurple,
    flex: 1
  },
  headerText: {
    color: 'white',
    fontSize: fonts.xLarge,
    fontFamily: fontFamilies.karlaBold,
    textAlign: 'center',
    flex: 1,
    marginLeft: -30
  },
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 20
  },
  backButton: {
    width: 20,
    height: 20
  },
  teamIcons: {
    marginHorizontal: scale(32),
    marginTop: verticalScale(40),
    flex: 1
  },
  teamIconContainer: {
    width: scale(80),
    height: verticalScale(106)
  },
  teamIcon: {
    resizeMode: 'contain',
    flex: 1,
    alignSelf: 'center',
    marginTop: 15,
    borderColor: 'rgba(111,111,111,0)',
     borderRadius: 20
  },
  selectedTeamIcon: {
    flex: 1,
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 20,
    marginTop: 15
  },
  largeIcon: {
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  fullNameText: {
    color: 'white',
    fontFamily: fontFamilies.montserratRegular,
    fontWeight: '800',
    fontSize: fonts.xMedium,
    textAlign: 'center',
    marginBottom: verticalScale(30),
    marginTop: verticalScale(10)
  },
  teamIconNameContainer: {
    marginTop: verticalScale(50)
  }
})