
import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../utils/theme';

export default StyleSheet.create({
  birthdateContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45,
  },
  birthButton: {
    alignItems: 'center',
    flex: 1,
  },
  birthText: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginTop: 25,
  },
})