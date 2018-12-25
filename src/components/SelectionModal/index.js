import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { colors, fonts } from '../../utils/theme';


export default class SelectionModal extends React.PureComponent {
  renderOneTouchableItem = (item, onSelect) => (
    <Touchable
      key={item.value}
      onPress={() => onSelect(item.value)}
    >
      <View style={[styles.itemContainer, styles.center]}>
        <Text style={styles.item}>{ item.label }</Text>
      </View>
    </Touchable>
  );


  renderTwoTouchableItems = (item, onSelect) => (
    <Touchable
      key={item.value}
      onPress={() => onSelect(item.value)}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.item}>{ item.label }</Text>
        <Text style={styles.item}>{ item.label_2 }</Text>
      </View>
    </Touchable>
  );


  renderThreeTouchableItems = (item, onSelect) => (
    <Touchable
      key={item.value}
      onPress={() => onSelect(item.value)}
    >
      <View style={styles.itemContainer}>
        <Text style={[styles.item, styles.flexOne]}>{ item.label }</Text>
        <Text style={[styles.item, styles.flexTwo]}>{ item.label_2 }</Text>
        <Text style={[styles.item, styles.flexThree]}>{ item.label_3 }</Text>
      </View>
    </Touchable>
  );


  render() {
    const { 
      items,
      handleClose,
      onSelect,
      title,
      visible
    } = this.props;
    
    const numberOfLabels = items.length && Object.keys(items[0]).length - 1;

    return (
      <Modal
        animationType={'slide'}
        onRequestClose={handleClose}
        transparent
        visible={visible}
        style={styles.modalContainer}
      >
        <Touchable
          onPress={handleClose}
          style={styles.closeContainer}
        >
          <View />
        </Touchable>
        <View style={styles.selectionContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{ title }</Text>
          </View>
          <ScrollView style={styles.scrollview}>
            {
              numberOfLabels === 1 && 
              items.map(item => this.renderOneTouchableItem(item, onSelect))
            }
            {
              numberOfLabels === 2 && 
              items.map(item => this.renderTwoTouchableItems(item, onSelect))
            }
            {
              numberOfLabels === 3 && 
              items.map(item => this.renderThreeTouchableItems(item, onSelect))
            }
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

SelectionModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};

SelectionModal.defaultProps = {
  handleClose: () => {},
  items: [],
  onSelect: () => {},
  title: '',
  visible: false,
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
  },
  closeContainer: {
    flex: 0.5,
    height: 150,
  },
  flexOne: {
    flex: 0.1,
  },
  flexTwo: {
    flex: 0.8,
  },
  flexThree: {
    flex: 0.1,
  },
  item: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingVertical: 15,
  },
  modalContainer: {
    flex: 1,
  },
  selectionContainer: {
    backgroundColor: colors.white,
    flex: 0.5,
  },
  scrollview: {
    flexGrow: 1,
    paddingBottom: 25,
    paddingTop: 15,
  },
  title: {
    color: colors.white,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderColor: colors.dark,
    justifyContent: 'center',
    paddingVertical: 15,
  },
});
