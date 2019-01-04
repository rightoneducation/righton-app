import { StyleSheet } from 'react-native';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  activityIndicator: {
    backgroundColor: colors.mask,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.dark,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginBottom: 15,
  },
  input: {
    borderColor: colors.white,
    borderWidth: 1,
    color: colors.white,
    fontFamily: 'lato',
    fontSize: fonts.medium,
    paddingLeft: 10,
    paddingVertical: 15,
    width: deviceWidth - 75,
  },
  inputLabel: {
    color: colors.white,
    fontSize: fonts.small,
    marginBottom: 5,
  },
  italic: {
    fontStyle: 'italic',
  },
  req: {
    color: colors.white,
    fontSize: fonts.small,
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',  
    marginBottom: 55,
    marginTop: 35,
  },
});
