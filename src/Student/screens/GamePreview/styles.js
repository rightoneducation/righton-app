import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../utils/theme';

export default StyleSheet.create({
  arrow: {
    borderColor: colors.primary,
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: 50,
    position: 'absolute',
    transform: [
      { rotate: '-45deg' },
    ],
    width: 50,
  },
  arrow1: {
    bottom: 50,
  },
  arrow2: {
    bottom: 35,
  },
  arrow3: {
    bottom: 20,
  },
  arrowButton: {
    alignItems: 'center',
    bottom: -40,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    flex: 1,
  },
  image: {

  },
  question: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  questionContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
});
