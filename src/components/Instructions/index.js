import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Aicon from 'react-native-vector-icons/FontAwesome';
import { colors, fonts } from '../../utils/theme';

function InstructionBox({ instruction, alignment }) {
  return (
    <View style={[styles.container, alignment === 'left' ? styles.justifyLeft : styles.justifyRight]}>
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


function Instructions({ data, handleCloseModal, visible }) {
  return (
    <Modal
      animationType={'slide'}
      onRequestClose={handleCloseModal}
      transparent
      visible={visible}
    >
      <ScrollView contentContainerStyle={styles.instructionsContainer}>
        <TouchableHighlight
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={handleCloseModal}
          style={styles.closeArrow}
        >
          <View />
        </TouchableHighlight>
        {data.map((instruction, idx) => {
          const alignment = idx % 2 === 0 ? 'left' : 'right';
          return (
            <InstructionBox
              alignment={alignment}
              key={instruction}
              instruction={instruction}
            />
          );
        })}
      </ScrollView>
    </Modal>
  );
}


Instructions.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  handleCloseModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

Instructions.defaultProps = {
  data: [],
  handleCloseModal: () => {},
  visible: false,
};


const styles = StyleSheet.create({
  alignLeft: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 10,
    marginLeft: 5,
  },
  alignRight: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    marginRight: 5,
  },
  box: {
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  closeArrow: {
    alignSelf: 'center',
    borderColor: colors.white,
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: 15,
    marginBottom: 25,
    marginTop: 10,
    transform: [
      { rotate: '135deg' },
    ],
    width: 15,
  },
  container: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    flexDirection: 'row',
    margin: 10,
  },
  instruction: {
    color: colors.white,
    fontSize: fonts.medium,
  },
  instructionsContainer: {
    backgroundColor: colors.dark,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 250,
  },
  justifyLeft: {
    justifyContent: 'flex-start',
  },
  justifyRight: {
    justifyContent: 'flex-end',
  },
  teacher: {
    color: colors.dark,
    fontSize: 20,
  },
  teacherBubble: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});

export default Instructions;
