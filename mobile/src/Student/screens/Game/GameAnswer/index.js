import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, SafeAreaView, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../../utils/theme'
import ExpandableQuestion from './ExpandableQuestion'

const GamePreview = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={['rgba(62, 0, 172, 1)', 'rgba(98, 0, 204, 1)']}
        style={styles.headerContainer}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerText}>
          Who Guessed What?
        </Text>
      </LinearGradient>
      <ScrollView style={styles.cardsContainer}>
        <View style={styles.questionContainer}>
          <ExpandableQuestion />
        </View>
      </ScrollView>
      <View
        style={styles.footer}

      />
    </SafeAreaView>
  )
}

export default GamePreview

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(247,249,250,1)'
  },
  headerContainer: {
    height: verticalScale(225),
    shadowColor: 'rgba(0, 141, 239, 0.3)',
  },
  headerText: {
    marginTop: scale(24),
    marginLeft: scale(30),
    fontFamily: fontFamilies.montserratBold,
    fontSize: fonts.large,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: 'white',
    lineHeight: 32,
  },
  cardsContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 10,
    marginTop: -scale(75),
    marginLeft: scale(42),
    marginRight: scale(42),
    backgroundColor: 'white',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 5
      }
    }),
  },
  footer: {
    marginBottom: moderateScale(30),
  }
})
