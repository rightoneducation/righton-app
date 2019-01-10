import { ScaledSheet, verticalScale } from 'react-native-size-matters';
import { colors, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  arrow: {
    borderColor: colors.primary,
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: '50@s',
    position: 'absolute',
    transform: [
      { rotate: '-45deg' },
    ],
    width: '50@s',
  },
  arrow1: {
    bottom: '50@vs',
  },
  arrow2: {
    bottom: '35@vs',
  },
  arrow3: {
    bottom: '20@vs',
  },
  arrowButton: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: verticalScale(-40),
    height: '125@vs',
    position: 'absolute',
    width: '70@s',
  },
  choiceAnswer: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  choiceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: '10@vs',
  },
  choiceContainerWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  choiceDot: {
    borderColor: colors.white,
    borderWidth: 1,
    height: '10@s',
    width: '10@s',
    marginHorizontal: '15@s',
  },
  choicesContainer: {
    alignItems: 'flex-start',
    flex: 1,
    marginVertical: '25@vs',
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
    marginTop: '50@vs',
  },
  time: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  timeContainer: {
    position: 'absolute',
    right: '5@s',
    top: '25@vs',
  },
});
