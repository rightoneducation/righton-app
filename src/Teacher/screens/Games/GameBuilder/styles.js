import { StyleSheet } from 'react-native';
import { colors, deviceWidth, fonts } from '../../../../utils/theme';


export default StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.dark,
    borderWidth: 1,
    height: 200,
    justifyContent: 'center',
    width: deviceWidth - 30,
  },
  avatarIcon: {
    alignSelf: 'center',
    color: colors.primary,
    fontSize: fonts.large,
    marginBottom: 10,
  },
  avatarImage: {
    height: 200,
    width: deviceWidth - 30,
  },
  avatarLabel: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  closeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.white,
    fontSize: 25,
    position: 'absolute',
  },
  closeIconShadow: {
    color: colors.primary,
    fontSize: 33,
  },
  container: {
    backgroundColor: colors.lightGray,
    flex: 1,
  },
  createContainer: {
    position: 'absolute',
    right: 15,
  },
  createLabel: {
    color: colors.primary,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  headerContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    elevation: 2,
    flexDirection: 'row',
    height: 65,
    justifyContent: 'flex-start',
    borderBottomWidth: 0.5,
    borderColor: colors.dark,
    paddingLeft: 20,
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
    color: colors.dark,
    fontSize: fonts.small,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  marginTop: {
    marginTop: 15,
  },
  placeholder: {
    color: colors.lightGray,
  },
  questionAnswer: {
    color: colors.dark,
    fontSize: fonts.small,
  },
  questionContainer: {
    borderColor: colors.dark,
    borderRadius: 1,
    flexDirection: 'row',
    height: 100,
    marginBottom: 25,
    width: deviceWidth - 30,
  },
  questionImage: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  questionImageText: {
    color: colors.white,
    fontSize: fonts.small,
    fontStyle: 'italic',
  },
  questionQuestion: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  questionTextContainer: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  questionsContainer: {
    alignSelf: 'stretch',
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
  },
  scrollview: {
    flexGrow: 1,
    paddingBottom: 95,
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  timeSelectionContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 30,
    bottom: -30,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
    width: 60,
    zIndex: 2,
  },
  timeSelectionLabel: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  title: {
    color: colors.dark,
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginLeft: 25,
  },
  warning: {
    color: colors.red,
    fontSize: fonts.medium,
    bottom: 5,
    position: 'absolute',
    right: 5,
  },
});
