import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import SelectionModal from '../SelectionModal';
import styles from './styles';
import { colors } from '../../utils/theme';

export default class Birthdate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      month: 'Month',
      day: 'Day',
      year: 'Year',
      selectionHandler: () => {},
      selectionItems: [],
      selectionTitle: '',
      selectionVisible: false,
    };
    this.months = [
      {label: 'January', value: 'January'},
      {label: 'February', value: 'February'},
      {label: 'March', value: 'March'},
      {label: 'April', value: 'April'},
      {label: 'May', value: 'May'},
      {label: 'June', value: 'June'},
      {label: 'July', value: 'July'},
      {label: 'August', value: 'August'},
      {label: 'September', value: 'September'},
      {label: 'October', value: 'October'},
      {label: 'November', value: 'November'},
      {label: 'December', value: 'December'},
    ];
    this.days = this.generateDays();
    this.years = this.generateYears();

    this.handleCloseSelection = this.handleCloseSelection.bind(this);
    this.handleMonthSelection = this.handleMonthSelection.bind(this);
    this.handleDaySelection = this.handleDaySelection.bind(this);
    this.handleYearSelection = this.handleYearSelection.bind(this);
    this.onMonthSelection = this.onMonthSelection.bind(this);
    this.onDaySelection = this.onDaySelection.bind(this);
    this.onYearSelection = this.onYearSelection.bind(this);
  }

  generateDays = () => {
    const daysArray = [];
    for (let i = 1; i <= 31; i += 1) {
      daysArray.push({label: `${i}`, value: `${i}`});
    }
    return daysArray;
  }

  generateYears = () => {
    const yearsArray = [];
    const yearNow = new Date().getFullYear();
    for (let i = yearNow; i > yearNow - 100; i -= 1) {
      yearsArray.push({label: `${i}`, value: `${i}`});
    }
    return yearsArray;
  }

  handleMonthSelection() {
    this.setState({
      selectionVisible: true,
      selectionTitle: 'Month',
      selectionItems: this.months,
      selectionHandler: this.onMonthSelection,
    });
  }

  handleDaySelection() {
    this.setState({
      selectionVisible: true,
      selectionTitle: 'Day',
      selectionItems: this.days,
      selectionHandler: this.onDaySelection,
    });
  }

  handleYearSelection() {
    this.setState({
      selectionVisible: true,
      selectionTitle: 'Year',
      selectionItems: this.years,
      selectionHandler: this.onYearSelection,
    });
  }
  
  onMonthSelection(month) {
    this.setState({ month });
    this.handleCloseSelection();
  }

  onDaySelection(day) {
    this.setState({ day });
    this.handleCloseSelection();
  }

  onYearSelection(year) {
    this.setState({ year });
    this.handleCloseSelection();
  }

  handleCloseSelection() {
    this.setState({
      selectionHandler: () => {},
      selectionItems: [],
      selectionTitle: '',
      selectionVisible: false,
    });
  }

  render() {
    const {
      month,
      day,
      year,
      selectionHandler,
      selectionItems,
      selectionTitle,
      selectionVisible,
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter your birthdate</Text>
        <View style={styles.birthdateContainer}>
          <Touchable
            activeOpacity={.8}
            background={Touchable.Ripple(colors.primary, false)}
            hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
            onPress={this.handleMonthSelection}
            style={styles.birthButton}
          >
            <Text style={styles.birthText}>{ month }</Text>
          </Touchable>
          <Touchable
            activeOpacity={.8}
            background={Touchable.Ripple(colors.primary, false)}
            hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
            onPress={this.handleDaySelection}
            style={styles.birthButton}
          >
            <Text style={styles.birthText}>{ day }</Text>
          </Touchable>
          <Touchable
            activeOpacity={.8}
            background={Touchable.Ripple(colors.primary, false)}
            hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}
            onPress={this.handleYearSelection}
            style={styles.birthButton}
          >
            <Text style={styles.birthText}>{ year }</Text>
          </Touchable>
        </View>
        <SelectionModal
          items={selectionItems}
          handleClose={this.handleCloseSelection}
          onSelect={selectionHandler}
          title={selectionTitle}
          visible={selectionVisible}
        />
      </View>
    );
  }
}