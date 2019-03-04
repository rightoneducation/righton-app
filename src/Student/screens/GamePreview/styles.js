import { ScaledSheet, moderateScale, verticalScale } from 'react-native-size-matters';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  arrow: {
    borderColor: colors.primary,
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: '50@ms0.2',
    position: 'absolute',
    transform: [
      { rotate: '-45deg' },
    ],
    width: '50@ms0.2',
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
    paddingBottom: '90@vs',
  },
  choiceButton: {
    alignItems: 'center',
    borderColor: colors.white,
    borderRadius: 100,
    borderWidth: 1,
    height: '15@ms',
    justifyContent: 'center',
    marginHorizontal: '15@ms',
    width: '15@ms',
  },
  choiceCheck: {
    color: colors.primary,
    fontSize: '12@ms0.2',
  },
  choiceItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '5@vs',
  },
  choiceValue: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  choiceSelected: {
    backgroundColor: colors.primary,
  },
  choiceSquare: {
    borderRadius: 0,
  },
  choicesContainer: {
    alignItems: 'flex-start',
    flex: 1,
    marginVertical: '25@vs',
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    flexGrow: 1,
  },
  extraPaddingBottom: {
    paddingBottom: '140@vs',
  },
  image: {
    height: '250@ms',
    marginVertical: '15@ms',
    width: deviceWidth - moderateScale(50),
  },
  marginBottom: {
    marginBottom: '15@vs',
  },
  question: {
    color: colors.white,
    fontSize: fonts.medium,
    marginHorizontal: '15@ms',
    textAlign: 'center',
  },
  questionContainer: {
    alignItems: 'center',
    marginTop: '50@vs',
    paddingHorizontal: '15@ms',
  },
  questionContainerTeacher: {
    // Account for back button
    marginTop: '65@vs',
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
  tricksContainer: {
    alignItems: 'flex-start',
  },
  tricksWrapper: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'flex-start',
    marginHorizontal: '15@ms',
    marginVertical: '35@vs',
    paddingHorizontal: '15@s',
    paddingBottom: '5@vs',
    paddingTop: '20@vs',
  },
});
