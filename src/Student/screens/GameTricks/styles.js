import { StyleSheet } from 'react-native';
import { colors, deviceWidth, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    flex: 1,
  },
  image: {

  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 5,
    marginTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: deviceWidth - 150,
  },
  question: {
    color: colors.white,
    fontSize: fonts.large,
  },
  questionContainer: {
    alignItems: 'center',
    marginTop: 75,
  },
  tricksContainer: {
    bottom: 0,
    flexDirection: 'row',
    left: 15,
    position: 'absolute',
  },
});
