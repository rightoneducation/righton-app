import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  arrow: {
    borderColor: colors.primary,
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: 50,
    position: 'absolute',
    transform: [
      { rotate: '-45deg' },
    ],
    width: 50,
  },
  arrow1: {
    bottom: 50,
  },
  arrow2: {
    bottom: 35,
  },
  arrow3: {
    bottom: 20,
  },
  arrowButton: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: -40,
    height: 125,
    position: 'absolute',
    width: 70,
  },
  choiceAnswer: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  choiceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  choiceContainerWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  choiceDot: {
    borderColor: colors.white,
    borderWidth: 1,
    height: 10,
    width: 10,
    marginHorizontal: 15,
  },
  choicesContainer: {
    alignItems: 'flex-start',
    flex: 1,
    marginVertical: 25,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    flex: 1,
  },
  image: {

  },
  question: {
    color: colors.white,
    fontSize: fonts.large,
  },
  questionContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  time: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  timeContainer: {
    position: 'absolute',
    right: 5,
    top: 25,
  },
});
