import { useEffect } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fonts } from '../../../../../utils/theme'
import Answers from '../../../../components/Answers'
import ExpandableQuestion from '../../../../components/ExpandableQuestion'
import FooterView from '../Components/FooterView'

const GameAnswerPopular = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Leaderboard')
    }, 20000)
  }, [])
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
      <View style={styles.footer}>
        <FooterView
          text={'First, let’s see which answer the tricksters guessed might be the most popular answer...'}
        />
      </View>
      <View style={styles.scrollViewContainer}>
        <ScrollView
          style={styles.contentScrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <View style={[styles.cardsContainer, styles.questionCard]}>
              <ExpandableQuestion />
            </View>
            <View style={[styles.cardsContainer, styles.answersCard]}>
              <Answers teamSelectedTrickAnswer={360} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default GameAnswerPopular

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
  contentScrollView: {
    marginTop: -scale(180),
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  scrollViewContainer: {
    height: scale(365)
  },
  cardsContainer: {
    marginLeft: scale(42),
    marginRight: scale(42),
    backgroundColor: 'white',
    borderRadius: scale(24),
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
  answersCard: {
    marginTop: verticalScale(24),
  },
  footer: {
    marginBottom: verticalScale(5),
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 25,
    left: 0,
    marginBottom: verticalScale(5),
    marginRight: scale(25)
  }
})
