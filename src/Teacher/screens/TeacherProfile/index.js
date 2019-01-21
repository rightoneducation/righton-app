import React from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
// import Aicon from 'react-native-vector-icons/FontAwesome';
// import Touchable from 'react-native-platform-touchable';
// import InputModal from '../../../components/InputModal';
import { colors, elevation, fonts } from '../../../utils/theme';
import ButtonWide from '../../../components/ButtonWide';
import ButtonBack from '../../../components/ButtonBack';


export default class MainHeader extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    screenProps: PropTypes.shape({
      account: PropTypes.shape({}),
      doSignOut: PropTypes.func,
      handleSetAppState: PropTypes.func,
    }),
  };
  
  static defaultProps = {
    navigation: {
      navigate: () => {},
    },
    screenProps: {
      account: {},
      doSignOut: () => {},
      handleSetAppState: () => {},
    },
  };

  constructor(props) {
    super(props);

    this.updatedAccount = false;

    this.state = {
      account: props.screenProps.account,
      // showInput: null,
    };

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }


  handleNavigateBack() {
    const { parent } = this.props.navigation.state.params;
    this.props.navigation.navigate(parent);
    this.props.navigation.state.params = {};
    if (this.updatedAccount) {
      const { account } = this.state;
      const { handleSetAppState } = this.props.screenProps;
      handleSetAppState('account', account);
    }
  }


  handleSignOut() {
    const { doSignOut } = this.props.screenProps;
    const { navigation } = this.props;

    doSignOut();
    navigation.navigate('OnboardAppRouter');
  }


  handleSchoolInput(input) {
    this.setState({ account: { ...this.state.account, schoolID: input } });
    this.updatedAccount = true;
  }


  // closeInputModal(input, inputLabel) {
  //   switch (inputLabel) {
  //     case 'trick0':
  //       this.setState({ trick0Reason: input, showInput: false });
  //       break;
  //     case 'trick1':
  //       this.setState({ trick1Reason: input, showInput: false });
  //       break;
  //     case 'trick2':
  //       this.setState({ trick2Reason: input, showInput: false });
  //       break;
  //     default:
  //       break;
  //   }
  // }


  // handleInputModal(inputLabel, placeholder, maxLength, input, keyboardType = 'default') {
  //   if (inputLabel === 'trick0') {
  //     this.onTrick0Layout();
  //   } else if (inputLabel === 'trick1') {
  //     this.onTrick1Layout();
  //   } else if (inputLabel === 'trick2') {
  //     this.onTrick2Layout();
  //   } 
  //   setTimeout(() => {
  //     this.setState({
  //       showInput: {
  //         autoCapitalize: 'sentences',
  //         closeModal: this.closeInputModal,
  //         keyboardType,
  //         height: 45,
  //         input,
  //         inputLabel,
  //         maxLength,
  //         multiline: false,
  //         placeholder,
  //         visible: true,
  //         spellCheck: true,
  //         width: deviceWidth - scale(30),
  //         x: this[`${inputLabel}X`],
  //         y: this[`${inputLabel}Y`],
  //       }
  //     });
  //   }, 100);
  // }

  
  render() {
    const {
      account,
      // showInput,
    } = this.state;

    return (
      <ScrollView style={styles.container}>

        {/* {showInput &&
          <InputModal {...showInput} />} */}

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

        <View style={styles.itemContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{ account.TeacherID }</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.label}>School ID</Text>
          <TextInput
            keyboardType={'numeric'}
            maxLength={10}
            multiline={false}
            onChangeText={this.handleSchoolInput}
            placeholder={'123456'}
            placeholderTextColor={colors.primary}
            returnKeyType={'done'}
            style={styles.value}
            textAlign={'left'}
            underlineColorAndroid={colors.dark}
            value={account.schoolID}
          />
        </View>

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
    paddingBottom: '90@vs',
    paddingTop: '75@vs',
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.large,
    position: 'absolute',
    right: '15@s',
    top: '25@vs',
  },
  itemContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginBottom: '10@vs',
    paddingHorizontal: '15@s',
  },
  label: {
    color: colors.white,
    fontSize: fonts.small,
    marginBottom: '5@vs',
  },
  value: {
    color: colors.white,
    fontSize: fonts.medium,
  },
});
