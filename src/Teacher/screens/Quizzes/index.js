import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../../../utils/theme';


class Quizzes extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      navigation: PropTypes.shape({
        navigate: PropTypes.func,
      }),
    }),
  };
  
  static defaultProps = {
    screenProps: {
      navigation: {
        navigate: () => {},
      },
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {

    };
  }


  render() {
    // const {

    // } = this.state;

    // const { navigation } = this.props.screenProps;

    return (
      <View style={styles.container} />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark,
    flex: 1,
  },
});


export default props => <Quizzes screenProps={{ ...props }} />;
