
import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 0.5,
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
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderColor: colors.dark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerProfileContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    elevation: 5,
    height: 40,
    justifyContent: 'flex-end',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowColor: colors.dark,
    shadowOffset: { height: 3, width: 0 },
    width: 40,
    zIndex: 10,
  },
  headerProfileIcon: {
    bottom: -3,
    color: colors.dark,
    fontSize: 30,
    position: 'absolute',
  },
  headerSearchIcon: {
    color: colors.white,
    fontSize: 28,
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    fontStyle: 'italic',
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
    alignItems: 'center',
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
  scrollview: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
});
