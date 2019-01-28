import { ScaledSheet } from 'react-native-size-matters';
import { colors, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  alignRight: {
    textAlign: 'right',
  },
  choiceButton: {
    alignItems: 'center',
    borderColor: colors.white,
    borderRadius: 100,
    borderWidth: 1,
    height: '15@ms',
    justifyContent: 'center',
    marginHorizontal: '15@s',
    width: '15@ms',
  },
  choiceCheck: {
    color: colors.primary,
    fontSize: '12@ms0.2',
  },
  choiceItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '5@vs',
  },
  choiceValue: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  choiceSquare: {
    borderRadius: 0,
  },
  dashboardContainer: {
    backgroundColor: colors.dark,
    flexGrow: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '15@vs',
  },
  extraMarginBottom: {
    marginBottom: '25@vs',
  },
  extraPaddingBottom: {
    paddingBottom: '95@vs',
  },
  gameContainer: {
    alignItems: 'flex-start',
    borderColor: colors.white,
    borderWidth: 1,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    margin: '15@s',
  },
  gameRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    alignItems: 'center',
    flex: 0.5,
    height: '100@ms',
    justifyContent: 'center',
    marginBottom: '10@vs',
  },
  textLabel: {
    color: colors.white,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    marginTop: '10@vs',
  },
  textNormal: {
    fontWeight: 'normal',
  },
  textCenter: {
    textAlign: 'center',
  },
  textLarge: {
    fontSize: fonts.large,
  },
});
