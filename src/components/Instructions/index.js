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
import ButtonWide from '../ButtonWide';


export default class Instructions extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.string),
    handleCloseModal: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  };
  
  static defaultProps = {
    data: [],
    handleCloseModal: () => {},
    visible: false,
  };

  constructor() {
    super();

    this.state = {
      visibleItems: [],
    };

    this.handleReveal = this.handleReveal.bind(this);
  }


  componentDidMount() {
    this.setVisibleItems();
  }


  setVisibleItems() {
    const visibleItems = [true];
    visibleItems[this.props.data.length - 1] = undefined;
    this.setState({ visibleItems });
  }


  handleReveal() {
    const { visibleItems } = this.state;
    const updatedVisibleItems = [...visibleItems];
    const index = updatedVisibleItems.indexOf(undefined);
    updatedVisibleItems[index] = true;
    this.setState({ visibleItems: updatedVisibleItems });
  }


  renderInstructionBox = (instruction, alignment) => (
    <View key={instruction} style={[styles.container, alignment === 'left' ? styles.justifyLeft : styles.justifyRight]}>
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


  renderRevealButton() {
    const { visibleItems } = this.state;
    if (visibleItems[visibleItems.length - 1] === undefined) {
      return (
        <ButtonWide
          buttonStyles={{
            backgroundColor: colors.dark,
            borderColor: colors.white,
            borderWidth: 1,
            marginTop: 25,
            position: 'relative',
          }}
          label={'Reveal next hint'}
          onPress={this.handleReveal}
          ripple={colors.black}
        />
      );
    }
    return null;
  }
  
  
  render() {
    const { data, handleCloseModal, visible } = this.props;
    const { visibleItems } = this.state;
    return (
      <Modal
        animationType={'slide'}
        onRequestClose={handleCloseModal}
        transparent
        visible={visible}
      >
        <View style={styles.instructionsWrapper}>
          <TouchableHighlight
            hitSlop={{ top: 45, right: 45, bottom: 45, left: 45 }}
            onPress={handleCloseModal}
            style={styles.closeArrow}
          >
            <View />
          </TouchableHighlight>
          <ScrollView contentContainerStyle={styles.instructionsContainer}>
            {data.map((instruction, idx) => {
              if (!visibleItems[idx]) return null;
              const alignment = idx % 2 === 0 ? 'left' : 'right';
              return this.renderInstructionBox(instruction, alignment);
            })}

            {this.renderRevealButton()}
          </ScrollView>
        </View>
      </Modal>
    );
  }
}


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
    flexGrow: 1,
  },
  instructionsWrapper: {
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
