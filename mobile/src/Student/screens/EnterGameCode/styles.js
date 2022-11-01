import { scale, ScaledSheet } from 'react-native-size-matters'
import { colors, fonts, fontFamilies } from '../../../utils/theme'

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
    fontSize: fonts.large,
    fontFamily: fontFamilies.latoBold,
    height: 68,
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 14,
    marginBottom: 60,
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    textAlign: 'center',
    paddingBottom: 9,
    fontFamily: fontFamilies.montserratBold,
  },
  entryContainer: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  enterButton: {
    backgroundColor: colors.buttonPrimary,
    fontFamily: fontFamilies.karlaBold,
    fontSize: fonts.xxLarge,
    fontWeight: 'bold',
    marginHorizontal: 50,
  },
  rightOnHeroImage: {
    width: 230,
    height: 120,
    alignSelf: 'center'
  },
  logoContainer: {
    marginTop: 22,
    height: scale(166)
  }
})
