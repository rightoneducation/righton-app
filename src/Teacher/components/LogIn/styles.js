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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.dark,
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
  },
  inputButton: {
    backgroundColor: colors.white,
    borderColor: colors.dark,
    borderWidth: 1,
    height: 45,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: deviceWidth - 30,
  },
  inputButtonText: {
    color: colors.dark,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  inputContainer: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexDirection: 'column',
    marginTop: 15,
  },
  inputLabel: {
    color: colors.primary,
    fontSize: fonts.small,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputPlaceholder: {
    color: colors.lightGray,
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
