import React from "react"
import { View, Text, StyleSheet, Image, Pressable } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { scale } from "react-native-size-matters"
import { colors, fonts, fontFamilies } from "../../../../utils/theme"
import { useNavigation } from "@react-navigation/native"

const FooterView = () => {
  const navigation = useNavigation()
  return (
    <View>
      <LinearGradient colors={["#003668", "#0B5EA2"]} style={styles.container}>
        <Pressable style={styles.sectionContainer}>
          <Image source={require('./img/clone.png')} />
          <Text style={styles.footerText}>Clone</Text>
        </Pressable>
        <Pressable style={styles.sectionContainer} onPress={() => {
          navigation.navigate('OverseeGamesStack')
        }}>
          <Text style={styles.footerText}>Create Session</Text>
          <Image source={require('./img/createSession.png')} />
        </Pressable>
      </LinearGradient>
    </View>
  )
}

export default FooterView

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: scale(15),
    height: scale(50)
  },
  footerText: {
    fontSize: fonts.xxxMedium,
    color: colors.white,
    fontFamily: fontFamilies.poppinsRegular,
    marginHorizontal: scale(10)
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})
