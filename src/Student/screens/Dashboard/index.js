import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import HeaderSimple from '../../../components/HeaderSimple';
import styles from './styles';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }



  render() {
    const {

    } = this.state;

    return (
      <View style={styles.container}>
        <HeaderSimple />
      </View>
    );
  }
}