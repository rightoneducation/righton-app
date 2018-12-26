import { StyleSheet } from 'react-native';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  header: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    height: 200,
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    marginTop: 50,
    textAlign: 'center',
  },
  image: {
    height: 150,
    width: 150,
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: 150,
    justifyContent: 'center',
    width: 150,
  },
  imageLabel: {
    color: colors.dark,
    fontSize: fonts.small,
    fontStyle: 'italic',
  },
  plusButton: {
    bottom: 15,
    position: 'absolute',
    right: 15,
  },
  plusIcon: {
    color: colors.white,
    fontSize: 25,
  },
  quizButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 150,
    marginHorizontal: 15,
    marginVertical: 10,
    width: deviceWidth - 30,
  },
  quizCount: {
    bottom: 5,
    color: colors.dark,
    fontSize: fonts.large,
    fontWeight: 'bold',
    position: 'absolute',
    right: 5,
  },
  quizDescription: {
    fontWeight: 'normal',
  },
  quizTitle: {
    color: colors.dark,
    fontSize: fonts.medium,
    fontWeight: 'bold',
    padding: 10,
  },
  scrollview: {
    flexGrow: 1,
    marginTop: 15,
    paddingBottom: 25,
  },
});
