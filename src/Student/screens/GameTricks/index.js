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
import Message from '../../../components/Message';
import styles from './styles';
import { colors } from '../../../utils/theme';
// import { deviceHeight, deviceWidth } from '../../../utils/theme';


export default class GameTricks extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({ type: PropTypes.any }),
      handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
      team: PropTypes.number.isRequired,
    }),
  }
  
  static defaultProps = {
    screenProps: {
      gameState: {
        team0: {
          instructions: __DEV__ ? ['Look up and to the left', 'Think back to earlier this morning', 'What was the texture of your food?', 'What did it smell like?', 'How was it cooked or prepared?', 'Who made breakfast this morning?', 'Do you want to eat it again right now?', 'What was it?!'] : [],
          question: __DEV__ ? 'What did you eat for breakfast?' : '',
          team: __DEV__ ? 'Scool' : '',
        },
      },
      handleSetAppState: () => {},
      IOTPublishMessage: () => {},
      team: 0,
    },
  }

  constructor(props) {
    super(props);

    this.webViewRef = undefined;

    this.state = {
      currentTrick: 0,
      js: '',
      messageProps: {},
      trick0: '',
      trick1: '',
      trick2: '',
    };

    this.trick0Ref = '';
    this.trick1Ref = '';
    this.trick2Ref = '';

    // this.handleRenderDemo = this.handleRenderDemo.bind(this);

    this.handleTrickInput = this.handleTrickInput.bind(this);
    this.handleTrickSubmit = this.handleTrickSubmit.bind(this);

    this.handleTrick0 = this.handleTrick0.bind(this);
    this.handleTrick1 = this.handleTrick1.bind(this);
    this.handleTrick2 = this.handleTrick2.bind(this);
  }


  componentDidMount() {
    // this.setState({ js: 'doDemo("f(x) = \\int_{-\\infty}^\\infty")' });
    // this.setState({ js: 'doDemo("c = \\pm\\sqrt{a^2 + b^2}")' });
    // setTimeout(() => {
    //   this.setState({ js: 'doDemo("f(x)")' });
    //   setTimeout(() => this.webViewRef.reload(), 1000);
    // }, 5000);
    this.hydrateTricksState();
  }


  componentWillReceiveProps(nextProps) {
    const { team } = this.props.screenProps;
    const teamRef = `team${team}`;

    // Handle updating the tricks in state when teammates enter values. 
    if (this.props.screenProps.gameState[teamRef].tricks[0] !== 
      nextProps.screenProps.gameState[teamRef].tricks[0]) {
      this.setState({
        trick0: nextProps.screenProps.gameState[teamRef].tricks[0]
      });
      this.trick0Ref = nextProps.screenProps.gameState[teamRef].tricks[0];
    }
    if (this.props.screenProps.gameState[teamRef].tricks[1] !== 
      nextProps.screenProps.gameState[teamRef].tricks[1]) {
      this.setState({
        trick1: nextProps.screenProps.gameState[teamRef].tricks[1]
      });
      this.trick1Ref = nextProps.screenProps.gameState[teamRef].tricks[1];
    }
    if (this.props.screenProps.gameState[teamRef].tricks[2] !== 
      nextProps.screenProps.gameState[teamRef].tricks[2]) {
      this.setState({
        trick2: nextProps.screenProps.gameState[teamRef].tricks[2]
      });
      this.trick2Ref = nextProps.screenProps.gameState[teamRef].tricks[2];
    }

    if (this.props.screenProps.gameState.state.startQuiz !==
      nextProps.screenProps.gameState.state.startQuiz) {
      if (nextProps.screenProps.gameState.state.teamRef === `team${this.props.screenProps.team}`) {
        this.props.navigation.navigate('GameReasons');
      } else {
        this.props.navigation.navigate('GameQuiz');
      }
    }
  }


  hydrateTricksState() {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;
    if (gameState[teamRef].tricks[0]) {
      this.setState({ trick0: gameState[teamRef].tricks[0] });
    }
    if (gameState[teamRef].tricks[1]) {
      this.setState({ trick1: gameState[teamRef].tricks[1] });
    }
    if (gameState[teamRef].tricks[2]) {
      this.setState({ trick2: gameState[teamRef].tricks[2] });
    }
  }


  // handleDoDemo() {
  //   const func = this.state.js;
  //   // const runThisFunc = `${func}`;
  //   // console.log(func, runThisFunc);
  //   setTimeout(() => this.handleDoDemo(), 1000);
  //   return func;
  // }


  // handleRenderDemo() {
  //   const func = this.state.js;
  //   return func;
  // }


  handleTrickInput(val) {
    const { currentTrick } = this.state;
    switch (currentTrick) {
      case 0:
        this.setState({ trick0: val });
        break;
      case 1:
        this.setState({ trick1: val });
        break;
      case 2:
        this.setState({ trick2: val });
        break;
      default:
    }
  }


  handleTrickSubmit() {
    const { currentTrick } = this.state;
    const { handleSetAppState, IOTPublishMessage, team } = this.props.screenProps;
    const teamRef = `team${team}`;
    const message = {
      action: 'UPDATE_TEAM_TRICK',
      index: currentTrick,
      teamRef,
      uid: `${Math.random()}`,
    };
    switch (currentTrick) {
      case 0:
        // this.setState({ currentTrick: 1 });
        Keyboard.dismiss();
        if (this.trick0Ref !== this.state.trick0 &&
        this.props.screenProps.gameState[`team${team}`].answer !== this.state.trick0 &&
        this.state.trick0 !== this.state.trick1 && this.state.trick0 !== this.state.trick2) {
          message.payload = this.state.trick0;
          this.trick0Ref = this.state.trick0;
        } else if (this.state.trick0 === this.props.screenProps.gameState[`team${team}`].answer) {
          this.setState({
            messageProps: {
              message: 'Trick answer cannot be actual answer.',
            },
            trick0: '',
          });
        } else if (this.state.trick0 === this.state.trick1 ||
        this.state.trick0 === this.state.trick2) {
          this.setState({
            messageProps: {
              message: 'Trick answers should be unique from each other.',
            },
            trick0: '',
          });
        }
        break;
      case 1:
        // this.setState({ currentTrick: 2 });
        Keyboard.dismiss();
        if (this.trick1Ref !== this.state.trick1 &&
        this.props.screenProps.gameState[`team${team}`].answer !== this.state.trick1 &&
        this.state.trick1 !== this.state.trick0 && this.state.trick1 !== this.state.trick2) {
          message.payload = this.state.trick1;
          this.trick1Ref = this.state.trick1;
        } else if (this.state.trick1 === this.props.screenProps.gameState[`team${team}`].answer) {
          this.setState({
            messageProps: {
              message: 'Trick answer cannot be actual answer.',
            },
            trick1: '',
          });
        } else if (this.state.trick1 === this.state.trick0 ||
        this.state.trick1 === this.state.trick2) {
          this.setState({
            messageProps: {
              message: 'Trick answers should be unique from each other.',
            },
            trick1: '',
          });
        }
        break;
      case 2:
        Keyboard.dismiss();
        if (this.trick2Ref !== this.state.trick2 &&
        this.props.screenProps.gameState[`team${team}`].answer !== this.state.trick2 &&
        this.state.trick2 !== this.state.trick0 && this.state.trick2 !== this.state.trick1) {
          message.payload = this.state.trick2;
          this.trick2Ref = this.state.trick2;
        } else if (this.state.trick2 === this.props.screenProps.gameState[`team${team}`].answer) {
          this.setState({
            messageProps: {
              message: 'Trick answer cannot be actual answer.',
            },
            trick2: '',
          });
        } else if (this.state.trick2 === this.state.trick0 ||
        this.state.trick2 === this.state.trick1) {
          this.setState({
            messageProps: {
              message: 'Trick answers should be unique from each other.',
            },
            trick2: '',
          });
        }
        break;
      default:
    }
    if (message.payload) {
      IOTPublishMessage(message);
      const { gameState } = this.props.screenProps;
      const updatedGameState = { ...gameState };
      updatedGameState[teamRef].tricks[currentTrick] = this.state[`trick${currentTrick}`];
      handleSetAppState('gameState', updatedGameState);
    }
  }


  handleTrick0() {
    this.setState({ currentTrick: 0 });
  }


  handleTrick1() {
    this.setState({ currentTrick: 1 });
  }


  handleTrick2() {
    this.setState({ currentTrick: 2 });
  }


  renderQuestion() {
    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{ gameState[teamRef].question }</Text>
        {Boolean(gameState[teamRef].image) &&
          <Image source={{ uri: gameState[teamRef].image }} style={styles.image} />} 
      </View>
    );
  }


  renderTricksButtons() {
    const { currentTrick, trick0, trick1, trick2 } = this.state;
    let icon1;
    let icon2;
    let icon3;
    if (trick0 && currentTrick !== 0) {
      icon1 = colors.primary;
    } else {
      icon1 = colors.white;
    }
    if (trick1 && currentTrick !== 1) {
      icon2 = colors.primary;
    } else {
      icon2 = colors.white;
    }
    if (trick2 && currentTrick !== 2) {
      icon3 = colors.primary;
    } else {
      icon3 = colors.white;
    }
    return (
      <View style={styles.tricksContainer}>
        <ButtonRound
          animated={false}
          buttonStyles={{
            backgroundColor: currentTrick !== 0 ? colors.white : colors.primary,
            marginHorizontal: 10,
            position: 'relative',
          }}
          icon={trick0 && 'check'}
          iconLabel={!trick0 ? 'A' : ''}
          iconStyles={{
            color: icon1,
          }}
          onPress={this.handleTrick0}
        />
        <ButtonRound
          animated={false}
          buttonStyles={{
            backgroundColor: currentTrick !== 1 ? colors.white : colors.primary,
            marginHorizontal: 10,
            position: 'relative',
          }}
          icon={trick1 && 'check'}
          iconLabel={!trick1 ? 'B' : ''}
          iconStyles={{
            color: icon2,
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
          iconLabel={!trick2 ? 'C' : ''}
          iconStyles={{
            color: icon3,
          }}
          onPress={this.handleTrick2}
        />
      </View>
    );
  }


  render() {
    const { 
      currentTrick,
      messageProps,
      trick0,
      trick1,
      trick2,
    } = this.state;

    const { gameState, team } = this.props.screenProps;
    const teamRef = `team${team}`;

    const showDoneButton = Boolean(trick0) && Boolean(trick1) && Boolean(trick2);

    return (
      <View style={styles.container}>
        <Message {...messageProps} />
        <HeaderTeam team={gameState[teamRef].team} />
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
