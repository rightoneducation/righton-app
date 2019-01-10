import { ScaledSheet } from 'react-native-size-matters';
import { colors, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  dashboardContainer: {
    backgroundColor: colors.dark,
    flexGrow: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '25@vs',
  },
  gameContainer: {
    alignItems: 'flex-start',
    borderColor: colors.white,
    borderWidth: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    margin: '15@s',
  },
  playersContainer: {
    alignItems: 'center',
    flex: 0.5,
    marginVertical: '10@vs',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: '20@vs',
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
});
