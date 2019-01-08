import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  dashboardContainer: {
    backgroundColor: colors.dark,
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  gameContainer: {
    alignItems: 'flex-start',
    borderColor: colors.white,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 15,
  },
  playersContainer: {
    alignItems: 'center',
    flex: 0.5,
    marginVertical: 10,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  textLabel: {
    color: colors.white,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textNumber: {
    fontSize: fonts.large,
  },
});
