import React from 'react';
import {
  ScrollView,
  Text,
  // View,
} from 'react-native';
import PropTypes from 'prop-types';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
// import Aicon from 'react-native-vector-icons/FontAwesome';
// import Touchable from 'react-native-platform-touchable';
import { colors, elevation, fonts } from '../../utils/theme';
import ButtonWide from '../../../components/ButtonWide';
import ButtonBack from '../../../components/ButtonBack';


export default class MainHeader extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    screenProps: PropTypes.shape({
      doSignOut: PropTypes.func,
    }),
  };
  
  static defaultProps = {
    navigation: {
      navigate: () => {},
    },
    screenProps: {
      doSignOut: () => {},
    },
  };

  constructor(props) {
    super(props);

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }


  handleNavigateBack() {
    const { parent } = this.props.navigation.state.params;
    this.props.navigation.navigate(parent);
  }


  handleSignOut() {
    const { doSignOut } = this.props.screenProps;
    const { navigation } = this.props;

    doSignOut();
    navigation.navigate('OnboardAppRouter');
  }

  
  render() {
    return (
      <ScrollView style={styles.container}>
        <ButtonBack
          buttonStyles={{
            alignItems: 'center',
            backgroundColor: colors.white,
            borderRadius: 100,
            height: moderateScale(40),
            justifyContent: 'center',
            width: moderateScale(40),
            ...elevation,
          }}
          iconName={'arrow-left'}
          iconStyles={{
            color: colors.primary,
          }}
          onPress={this.handleNavigateBack}
        />
        <Text style={styles.headerTitle}>Profile</Text>


        <ButtonWide
          label={'Log out'}
          onPress={this.handleSignOut}
        />
      </ScrollView>
    );
  }
}

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    paddinBottom: '90@vs',
    paddingTop: '75@vs',
  },
  // headerProfileContainer: {
  //   alignItems: 'center',
  //   backgroundColor: colors.lightGray,
  //   borderRadius: 100,
  //   height: '40@ms',
  //   justifyContent: 'flex-end',
  //   width: '40@ms',
  // },
  // headerProfileIcon: {
  //   color: colors.dark,
  //   fontSize: '30@ms0.2',
  //   marginTop: '3@vs',
  // },
  // headerSearchIcon: {
  //   color: colors.white,
  //   fontSize: '28@ms0.2',
  // },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    position: 'absolute',
    right: '15@s',
    top: '25@vs',
  },
});
