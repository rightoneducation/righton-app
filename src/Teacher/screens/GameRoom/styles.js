import { ScaledSheet } from 'react-native-size-matters';
import { colors, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  alignRight: {
    textAlign: 'right',
  },
  dashboardContainer: {
    backgroundColor: colors.dark,
    flexGrow: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '15@vs',
  },
  gameContainer: {
    alignItems: 'flex-start',
    borderColor: colors.white,
    borderWidth: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    margin: '15@s',
  },
  marginBottom: {
    marginBottom: '5@vs'
  },
  playersContainer: {
    alignItems: 'center',
  },
  teamsContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: '35@vs',
  },
  teamContainer: {
    flex: 0.5,
    height: '100@ms',
    marginBottom: '10@vs',
  },
  textLabel: {
    color: colors.white,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    marginTop: '10@vs',
  },
  textCenter: {
    textAlign: 'center',
  },
  textLarge: {
    fontSize: fonts.large,
  },
  trickButton: {
    borderColor: colors.white,
    borderRadius: 100,
    borderWidth: 1,
    height: '15@ms',
    marginHorizontal: '15@s',
    width: '15@ms',
  },
  trickButtonSelected: {
    backgroundColor: colors.primary,
  },
  trickItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '5@vs',
  },
  trickValue: {
    color: colors.white,
    fontSize: fonts.medium,
  },
});
