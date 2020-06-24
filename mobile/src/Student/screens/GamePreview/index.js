import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../utils/theme'
import * as Progress from 'react-native-progress'
import TeamsReadinessFooter from '../../components/TeamsReadinessFooter'
import HorizontalPageView from '../../components/HorizontalPageView'
import Card from '../../components/Card'
import Spinner from './Spinner'
import Question from './Question'
import TrickAnswers from './TrickAnswers'


const GamePreview = () => {
  const [countdown, setCountdown] = useState(300)
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    if (countdown == 0) {
      return
    }
    var refreshIntervalId = setInterval(() => {
      setCountdown(countdown - 1)
      setProgress(countdown / 300)
    }, 1000)
    return () => {
      clearInterval(refreshIntervalId)
    }
  })

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['rgba(62, 0, 172, 1)', 'rgba(98, 0, 204, 1)']}
        style={styles.headerContainer}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerText}>
          Trick Your Class!
        </Text>
        <View style={styles.timerContainer}>
          <Progress.Bar
            style={styles.timerProgressBar}
            progress={progress}
            color={'#349E15'}
            unfilledColor={'rgba(255,255,255,0.8)'}
            width={Dimensions.get('window').width - scale(90)}
          />
          <Text style={styles.timerText}>
            {Math.floor(countdown / 60)}:{('0' + Math.floor(countdown % 60)).slice(-2)}
          </Text>
        </View>
      </LinearGradient>
      <View style={styles.carouselContainer}>
        <HorizontalPageView>
          <Card headerTitle="Question">
            <Question />
          </Card>
          <Card headerTitle="Trick Answers">
            <TrickAnswers />
            {/* <Spinner text="You can enter trick answers after one minute." /> */}
          </Card>
          <Card headerTitle="Hints">
            <Spinner text="Hints will be available after one minute." />
          </Card>
        </HorizontalPageView>
      </View>
      <TeamsReadinessFooter style={styles.footer}></TeamsReadinessFooter>
    </View>
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
    color: 'white'
  },
  timerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: scale(15),
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: scale(30),
    marginRight: scale(21),
  },
  timerProgressBar: {
    marginRight: 9,
    marginTop: 5,
  },
  timerText: {
    color: 'white',
    opacity: 0.8,
    fontSize: fonts.xSmall,
    fontFamily: fontFamilies.latoBold,
    fontWeight: 'bold',
  },
  carouselContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 10,
    marginTop: -scale(75),
  },
  footer: {
    marginBottom: moderateScale(30)
  }
})
