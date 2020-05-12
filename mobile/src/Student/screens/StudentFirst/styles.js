import { scale, ScaledSheet } from 'react-native-size-matters';
import { colors, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  container: {
    backgroundColor: colors.backgroundPurple,
    flex: 1
  },
  innerContainer: {
    alignContent: "center",
    alignItems: "center"
  },
  input: {
    color: colors.primary,
    fontSize: fonts.medium,
    height: 68,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: '14@vs',
    marginBottom: 13,
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 9
  },
  entryContainer: {
    alignSelf: 'center',
    width: scale(265),
  },
  enterButton: {
    backgroundColor: colors.buttonPrimary,
  },
  rightOnHeroImage: {
    width: 230,
    height: 118,
    alignSelf: 'center'
  },
  logoContainer: {
    marginTop: 22,
    height: scale(166)
  }
});
