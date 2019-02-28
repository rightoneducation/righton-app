import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScaledSheet } from 'react-native-size-matters';
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

  constructor(props) {
    super(props);

    this.state = {
      visibleItems: [],
    };
  }


  componentDidMount() {
    this.setVisibleItems();
  }


  setVisibleItems() {
    const { data } = this.props;
    const visibleItems = data.length === 1 ? [undefined] : [true];
    if (this.props.data.length > 1) {
      visibleItems[this.props.data.length - 1] = undefined;
      visibleItems.fill(undefined, 1);
    }
    this.setState({ visibleItems });
  }


  handleReveal = () => {
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


  renderRevealButton(visibleItems, data) {
    if (visibleItems[visibleItems.length - 1] === undefined) {
      let label = 'Show next step';
      if (visibleItems.indexOf(undefined) === data.length - 1) {
        label = 'Show answer';
      }
      return (
        <ButtonWide
          buttonStyles={{
            backgroundColor: colors.dark,
            borderColor: colors.white,
            borderWidth: 1,
            marginTop: 25,
            position: 'relative',
          }}
          label={label}
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

            {this.renderRevealButton(visibleItems, data)}
          </ScrollView>
        </View>
      </Modal>
    );
  }
}


const styles = ScaledSheet.create({
  alignLeft: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: '10@s',
    marginLeft: '5@s',
  },
  alignRight: {
    borderBottomLeftRadius: '10@s',
    borderBottomRightRadius: 0,
    marginRight: '5@s',
  },
  box: {
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: '10@s',
    borderTopRightRadius: '10@s',
    padding: '10@ms',
  },
  closeArrow: {
    alignSelf: 'center',
    borderColor: colors.white,
    borderTopWidth: 1,
    borderRightWidth: 1,
    height: '15@s',
    marginBottom: '25@vs',
    marginTop: '10@vs',
    transform: [
      { rotate: '135deg' },
    ],
    width: '15@s',
  },
  container: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    flexDirection: 'row',
    margin: '10@s',
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
    top: '250@vs',
  },
  justifyLeft: {
    justifyContent: 'flex-start',
  },
  justifyRight: {
    justifyContent: 'flex-end',
  },
  teacher: {
    color: colors.dark,
    fontSize: '28@ms0.2',
  },
  teacherBubble: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 100,
    height: '40@ms',
    justifyContent: 'center',
    width: '40@ms',
  },
});
