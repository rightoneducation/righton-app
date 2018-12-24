import React from 'react';
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  View,
  // WebView,
} from 'react-native';
import PropTypes from 'prop-types';
import HeaderTeam from '../../components/HeaderTeam';
import ButtonRound from '../../../components/ButtonRound';
import styles from './styles';
import { colors } from '../../../utils/theme';
// import { deviceHeight, deviceWidth } from '../../../utils/theme';


export default class GamePreview extends React.PureComponent {
  static propTypes = {
    // GameAppNavigator: PropTypes.shape({ navigate: PropTypes.func }),
    navigator: PropTypes.shape({ navigate: PropTypes.func }),
    gameState: PropTypes.shape({
      team0: PropTypes.shape({
        question: PropTypes.string,
        team: PropTypes.string,
      }),
    }),
    group: PropTypes.number.isRequired,
    studentAppNavigator: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  }
  
  static defaultProps = {
    // GameAppNavigator: {},
    navigator: {},
    gameState: {
      team0: {
        question: __DEV__ ? 'What did you eat for breakfast?' : '',
        team: __DEV__ ? 'Scool' : '',
      },
    },
    group: 0,
    studentAppNavigator: {},
  }

  constructor(props) {
    super(props);

    this.webViewRef = undefined;

    this.state = {
      currentTrick: 1,
      js: '',
      trick1: '',
      trick2: '',
      trick3: '',
    };

    this.handleRenderDemo = this.handleRenderDemo.bind(this);

    this.handleTrickInput = this.handleTrickInput.bind(this);
    this.handleTrickSubmit = this.handleTrickSubmit.bind(this);

    this.handleTrick1 = this.handleTrick1.bind(this);
    this.handleTrick2 = this.handleTrick2.bind(this);
    this.handleTrick3 = this.handleTrick3.bind(this);
  }


  componentDidMount() {
    // this.setState({ js: 'doDemo("f(x) = \\int_{-\\infty}^\\infty")' });
    // this.setState({ js: 'doDemo("c = \\pm\\sqrt{a^2 + b^2}")' });
    // setTimeout(() => {
    //   this.setState({ js: 'doDemo("f(x)")' });
    //   setTimeout(() => this.webViewRef.reload(), 1000);
    // }, 5000);
  }


  handleDoDemo() {
    const func = this.state.js;
    // const runThisFunc = `${func}`;
    // console.log(func, runThisFunc);
    setTimeout(() => this.handleDoDemo(), 1000);
    return func;
  }


  handleRenderDemo() {
    const func = this.state.js;
    return func;
  }


  handleTrickInput(val) {
    const { currentTrick } = this.state;
    switch (currentTrick) {
      case 1:
        this.setState({ trick1: val });
        break;
      case 2:
        this.setState({ trick2: val });
        break;
      case 3:
        this.setState({ trick3: val });
        break;
      default:
    }
  }


  handleTrickSubmit() {
    const { currentTrick } = this.state;
    switch (currentTrick) {
      case 1:
        this.setState({ currentTrick: 2 });
        break;
      case 2:
        this.setState({ currentTrick: 3 });
        break;
      case 3:
        Keyboard.dismiss();
        // TODO: Review and submit!
        break;
      default:
    }
  }


  handleTrick1() {
    this.setState({ currentTrick: 1 });
  }


  handleTrick2() {
    this.setState({ currentTrick: 2 });
  }


  handleTrick3() {
    this.setState({ currentTrick: 3 });
  }


  renderQuestion() {
    const { gameState, group } = this.props;
    const team = `team${group}`;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{ gameState[team].question }</Text>
        {gameState[team].image &&
          <Image source={{ uri: gameState[team].image }} style={styles.image} />} 
      </View>
    );
  }


  renderTricksButtons() {
    const { currentTrick, trick1, trick2, trick3 } = this.state;
    let icon1;
    let icon2;
    let icon3;
    if (trick1 && currentTrick !== 1) {
      icon1 = colors.primary;
    } else {
      icon1 = colors.white;
    }
    if (trick2 && currentTrick !== 2) {
      icon2 = colors.primary;
    } else {
      icon2 = colors.white;
    }
    if (trick3 && currentTrick !== 3) {
      icon3 = colors.primary;
    } else {
      icon3 = colors.white;
    }
    return (
      <View style={styles.tricksContainer}>
        <ButtonRound
          animated={false}
          buttonStyles={{
            backgroundColor: currentTrick !== 1 ? colors.white : colors.primary,
            marginHorizontal: 10,
            position: 'relative',
          }}
          icon={trick1 && 'check'}
          iconLabel={!trick1 ? 'A' : ''}
          iconStyles={{
            color: icon1,
          }}
          onPress={this.handleTrick1}
        />
        <ButtonRound
          animated={false}
          buttonStyles={{
            backgroundColor: currentTrick !== 2 ? colors.white : colors.primary,
            marginHorizontal: 10,
            position: 'relative',
          }}
          icon={trick2 && 'check'}
          iconLabel={!trick2 ? 'B' : ''}
          iconStyles={{
            color: icon2,
          }}
          onPress={this.handleTrick2}
        />
        <ButtonRound
          animated={false}
          buttonStyles={{
            backgroundColor: currentTrick !== 3 ? colors.white : colors.primary,
            marginHorizontal: 10,
            position: 'relative',
          }}
          icon={trick3 && 'check'}
          iconLabel={!trick3 ? 'C' : ''}
          iconStyles={{
            color: icon3,
          }}
          onPress={this.handleTrick3}
        />
      </View>
    );
  }


  render() {
    const { 
      currentTrick,
      trick1,
      trick2,
      trick3,
    } = this.state;

    const { gameState, group } = this.props;
    const team = `team${group}`;

    const showDoneButton = Boolean(trick1) && Boolean(trick2) && Boolean(trick3);

    return (
      <View style={styles.container}>
        <HeaderTeam team={gameState[team].team} />
        {this.renderQuestion()}
        <View>
          {/* {
            Boolean(this.state.js) &&
            <WebView
              // contentInset={{ top: 0, right: 0, bottom: 0, left: 0 }}
              injectedJavaScript={
                // `setInterval(() => {
                `
                setTimeout(() => {
                  ${this.handleRenderDemo()};
                  console.log(document.getElementById('demo-output'));
                }, 500);
                `
                // }, 500);`
              }
              mixedContentMode={'compatibility'}
              originWhitelist={['*']}
              ref={(WEBVIEW_REF) => { this.webViewRef = WEBVIEW_REF; }}
              scalesPageToFit={false}
              source={{ uri: 'file:///android_asset/KaTeX/KaTeX.htm' }} 
              startInLoadingState={false}
              domStorageEnabled
              javaScriptEnabled
              style={{ height: 300, width: deviceWidth, flex: 1 }}
              // style={{ height: 200, width: deviceWidth }}
            />
          } */}
          <TextInput
            blurOnSubmit={false}
            keyboardType={'numeric'}
            maxLength={100}
            multiline={false}
            onChangeText={this.handleTrickInput}
            onSubmitEditing={this.handleTrickSubmit}
            placeholder={'Your trick answer'}
            placeholderTextColor={colors.primary} 
            returnKeyType={'done'}
            style={styles.input} 
            textAlign={'center'}
            underlineColorAndroid={colors.white}   
            value={this.state[`trick${currentTrick}`]}
          />
        </View>
        {showDoneButton &&
        <ButtonRound
          icon={'arrow-right'}
          onPress={() => {}}
        />}
        {this.renderTricksButtons()}
      </View>
    );
  }
}
