import { scale, ScaledSheet } from 'react-native-size-matters';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    flex: 1,
  },
  image: {

  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 5,
    marginTop: '50@vs',
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    width: deviceWidth - scale(150),
  },
  question: {
    color: colors.white,
    fontSize: fonts.large,
  },
  questionContainer: {
    alignItems: 'center',
    marginTop: '75@vs',
  },
  tricksContainer: {
    bottom: 0,
    flexDirection: 'row',
    left: '15@s',
    position: 'absolute',
  },
});
