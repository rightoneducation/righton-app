import { StyleSheet } from 'react-native';
import { colors, fonts, deviceWidth } from '../../utils/common';

export default styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    height: 65,
    justifyContent: 'center',
    width: (deviceWidth / 2) - 50,
  },
  buttonsContainer: {
    alignItems: 'center',
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  buttonRetry: {
    bottom: 15,
    position: 'absolute',
    left: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  codeInput: {
    borderColor: colors.white,
    borderBottomWidth: 1,
    color: colors.white,
    fontSize: fonts.medium,
    marginHorizontal: 15,
    width: 25,
  },
  codeInputsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  containerMain: {
    alignItems: 'center',
    backgroundColor: colors.black,
    flex: 1,
    paddingTop: 15,
  },
  containerSub: {
    alignItems: 'center',
    flex: 1,
  },
  countryCode: {
    color: colors.white,
    fontSize: fonts.medium,
    marginRight: 5,
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  numberInput: {
    borderColor: colors.white,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    color: colors.white,
    fontSize: fonts.medium,
    width: deviceWidth - 75,
  },
  title: {
    color: colors.white,    
    fontSize: 35,
    fontStyle: 'italic',
  },
  titleSub: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginTop: 25,
  },
});