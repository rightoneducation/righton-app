import React from 'react';
import {
  Modal,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { scale, ScaledSheet } from 'react-native-size-matters';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Touchable from 'react-native-platform-touchable';
import ButtonWide from '../../../../../components/ButtonWide';
import { colors, deviceWidth, elevation, fonts } from '../../../../../utils/theme';

export default class GameShare extends React.PureComponent {
  static propTypes = {
    handleClose: PropTypes.func,
  };
  
  static defaultProps = {
    handleClose: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }


  render() {
    const {
      handleClose,
    } = this.props;

    const { email } = this.state;

    return (
      <Modal
        animationType={'slide'}
        onRequestClose={handleClose}
        visible
      >
        <View style={styles.container}>

          <Touchable
            activeOpacity={0.8}
            hitSlop={{ top: 25, right: 25, bottom: 25, left: 25 }}
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Aicon name={'close'} style={styles.closeIcon} />
          </Touchable>

          <Text style={styles.label}>Share game with a teacher</Text>

          <View style={styles.itemContainer}>
            <TextInput
              keyboardType={'default'}
              maxLength={65}
              multiline={false}
              // onChangeText={this.handleSchoolInput}
              placeholder={'teacher@email.edu'}
              placeholderTextColor={colors.lightGray}
              returnKeyType={'done'}
              style={[styles.textinput, elevation]}
              textAlign={'center'}
              underlineColorAndroid={colors.white}
              value={email}
            />
          </View>

          <ButtonWide
            label={'Share game'}
            onPress={() => {}}
          />

        </View>
      </Modal>
    );
  }
}


const styles = ScaledSheet.create({
  closeButton: {
    left: '15@ms',
    position: 'absolute',
    top: '15@ms',
  },
  closeIcon: {
    color: colors.white,
    fontSize: fonts.large,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingHorizontal: '15@s',
    paddingVertical: '20@vs',
  },
  label: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
    position: 'absolute',
    top: '90@vs',
  },
  textinput: {
    backgroundColor: colors.white,
    color: colors.primary,
    fontSize: fonts.medium,
    paddingVertical: '15@ms',
    paddingHorizontal: '20@ms',
    width: deviceWidth - scale(30),
  },
});
