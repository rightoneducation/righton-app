import React from 'react';
import {
  Modal,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
import Aicon from 'react-native-vector-icons';
import Touchable from 'react-native-platform-touchable';
import ButtonWide from '../../../../../components/ButtonWide';
import { colors, elevation, fonts } from '../../../../../utils/theme';

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
        transparent
        visible
        style={styles.container}
      >
        <Touchable
          activeOpacity={0.8}
          style={styles.closeButton}
        >
          <View>
            <Aicon name={'close'} style={styles.closeIcon} />
          </View>
        </Touchable>

        <View style={styles.itemContainer}>
          <Text style={styles.label}>Share game with teacher</Text>
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
            underlineColorAndroid={colors.dark}
            value={email}
          />
        </View>

        <ButtonWide
          label={'Share game'}
          onPress={() => {}}
        />
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
    backgroundColor: colors.dark,
    flex: 1,
  },
  itemContainer: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingHorizontal: '15@s',
    paddingVertical: '20@vs',
  },
  label: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginBottom: '2@vs',
  },
  textinput: {
    backgroundColor: colors.white,
    color: colors.primary,
    fontSize: fonts.medium,
    paddingVertical: '15@ms',
    paddingHorizontal: '20@ms',
  },
});
