import { scale, ScaledSheet } from 'react-native-size-matters';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderColor: colors.white,
    borderWidth: 1,
    color: colors.white,
    fontSize: fonts.medium,
    paddingVertical: '15@vs',
    width: deviceWidth - scale(75),
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
    position: 'absolute',
    top: '35@vs',
  },
});
