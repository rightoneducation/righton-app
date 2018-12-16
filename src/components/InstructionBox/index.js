import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Aicon from 'react-native-vector-icons/FontAwesome';
import { colors, fonts } from '../../utils/theme';

export default function InstructionBox({ instruction, alignment }) {
  return (
    <View style={styles.container}>
      {
        alignment === 'left' &&
        <View style={styles.teacherBubble}>
          <Aicon name={'user'} style={styles.teacher} />
        </View>
      }
      <View style={[styles.box, alignment === 'left' ? styles.alignLeft : styles.alignRight]}>
        <Text style={styles.instruction}>{ instruction }</Text>
      </View>
      {
        alignment === 'right' &&
        <View style={styles.teacherBubble}>
          <Aicon name={'user'} style={styles.teacher} />
        </View>
      }
    </View>
  );
}

InstructionBox.propTypes = {
  instruction: PropTypes.string.isRequired,
  alignment: PropTypes.string.isRequired,
};

InstructionBox.defaultProps = {
  instruction: '',
  alignment: 'left',
};

const styles = StyleSheet.create({
  alignLeft: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,

  },
  alignRight: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
  },
  box: {
    backgroundColor: colors.dark,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    margin: 10,
  },
  instruction: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  teacher: {
    color: colors.dark,
    fontSize: 25,
  },
  teacherBubble: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
});
