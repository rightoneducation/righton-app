
import { scale, ScaledSheet } from 'react-native-size-matters';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  button: {
    alignItems: 'center',
    flex: 0.5,
    justifyContent: 'center',
    paddingVertical: '25@vs',
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
  dashContainer: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderColor: colors.dark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: '65@vs',
    justifyContent: 'space-between',
    paddingHorizontal: '15@s',
  },
  headerProfileContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 100,
    elevation: 5,
    height: '40@ms',
    justifyContent: 'flex-end',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowColor: colors.dark,
    shadowOffset: { height: 3, width: 0 },
    width: '40@ms',
    zIndex: 10,
  },
  headerProfileIcon: {
    bottom: -3,
    color: colors.dark,
    fontSize: '30@ms0.2',
    position: 'absolute',
  },
  headerSearchIcon: {
    color: colors.white,
    fontSize: '28@ms0.2',
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
    marginHorizontal: '15@s',
    marginTop: '25@vs',
    paddingHorizontal: '15@s',
    paddingVertical: '20@vs',
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
    marginHorizontal: '15@s',
    marginBottom: '10@vs',
    marginTop: '25@vs',
    paddingTop: '15@vs',
  },
  roomInput: {
    color: colors.primary,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  roomScrollView: {
    alignItems: 'center',
    flexGrow: 1,
    // Size of ButtonWide + `15@s` from marginHorizontal of styles.roomContainer
    width: deviceWidth - scale(30),
  },
  teamButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: 100,
    justifyContent: 'center',
    marginHorizontal: '20@s',
    marginVertical: '15@vs',
    paddingVertical: '25@vs',
  },
  title: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
});
