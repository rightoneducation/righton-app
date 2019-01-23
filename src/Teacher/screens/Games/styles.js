import { scale, ScaledSheet } from 'react-native-size-matters';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default ScaledSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  header: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    height: '200@vs',
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    marginTop: '50@vs',
    textAlign: 'center',
  },
  image: {
    height: '150@vs',
    width: '150@vs',
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: '125@vs',
    justifyContent: 'center',
    width: '125@vs',
  },
  imageLabel: {
    color: colors.white,
    fontSize: fonts.large,
    fontStyle: 'italic',
  },
  plusButton: {
    bottom: '15@vs',
    position: 'absolute',
    right: '15@s',
  },
  plusIcon: {
    color: colors.white,
    fontSize: '25@ms0.2',
  },
  gameButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: '125@vs',
    marginHorizontal: '15@s',
    marginVertical: '10@vs',
    paddingRight: '5@ms',
    width: deviceWidth - scale(30),
  },
  gameColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  gameCount: {
    bottom: '5@vs',
    color: colors.white,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    position: 'absolute',
  },
  gameDescription: {
    fontWeight: 'normal',
    fontSize: fonts.small,
  },
  gameOpenButton: {
    bottom: '8@vs',
    right: '40@s',
    position: 'absolute',
  },
  gameOpenText: {
    color: colors.primary,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  gamePlayButton: {
    alignItems: 'center',
    bottom: '5@vs',
    backgroundColor: colors.primary,
    borderRadius: 100,
    height: '25@ms',
    justifyContent: 'center',
    right: '5@s',
    width: '25@ms',
  },
  gamePlayIcon: {
    color: colors.white,
    fontSize: fonts.small,
  },
  gameTitle: {
    color: colors.dark,
    flexWrap: 'wrap',
    fontSize: fonts.medium,
    fontWeight: 'bold',
    padding: '10@ms',
  },
  scrollview: {
    flexGrow: 1,
    marginTop: '15@vs',
    paddingBottom: '25@vs',
  },
});
