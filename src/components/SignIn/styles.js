import { StyleSheet } from 'react-native';
import { colors, deviceWidth, fonts } from '../../utils/theme';

export default StyleSheet.create({
  bla: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.dark,
  },
  activityIndicator: {
    backgroundColor: colors.mask,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  countryCode: {
    color: colors.white,
    fontSize: fonts.medium,
    marginRight: 10,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
  },
  input: {
    fontFamily: 'lato',
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45,
  },
  numberInput: {
    borderColor: colors.white,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    color: colors.white,
    fontSize: fonts.medium,
    width: deviceWidth - 75,
  },
  title: {
    color: colors.white,    
    fontSize: 35,
    fontStyle: 'italic',
  },
  titleSub: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginTop: 25,
  },
});