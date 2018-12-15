
import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: .5,
    justifyContent: 'center',
    paddingVertical: 25,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
  },
  input: {
    color: colors.primary,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 25,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  profileValue: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  profileValueContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileValuesContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileValueLabel: {
    color: colors.dark,
    fontSize: fonts.small,
    fontWeight: 'bold',
  },
  roomContainer: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: 25,
  },
  roomInput: {
    color: colors.primary,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
})