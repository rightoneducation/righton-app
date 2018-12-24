import React from 'react';
import {
  findNodeHandle,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import NativeMethodsMixin from 'NativeMethodsMixin';
import Touchable from 'react-native-platform-touchable';
import Aicon from 'react-native-vector-icons/FontAwesome';
import InputModal from '../../../../../components/InputModal';
import parentStyles from '../styles';
import { deviceWidth, elevation, fonts } from '../../../../../utils/theme';


export default class QuizBuilderQuestion extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    question: PropTypes.shape({
      answer: PropTypes.string,
      image: PropTypes.string,
      quesiton: PropTypes.string,
    }),
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    closeModal: () => {},
    question: {
      answer: '',
      image: '',
      question: '',
    },
    visible: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      question: {},
      showInput: false,
    };

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleExitModal = this.handleExitModal.bind(this);

    this.onQuestionLayout = this.onQuestionLayout.bind(this);
    this.handleQuestionRef = this.handleQuestionRef.bind(this);
    this.onAnswerLayout = this.onAnswerLayout.bind(this);
    this.handleAnswerRef = this.handleAnswerRef.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);
  }


  componentDidMount() {
    this.hydrateState(this.props.question);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.question.uid !== nextProps.question.uid || 
      nextProps.question.uid === undefined) {
      this.hydrateState(nextProps.question);
    }
  }


  onQuestionLayout() {
    if (this.questionRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.questionRef),
        (x, y) => {
          this.questionX = x;
          this.questionY = y + 9 + fonts.small;
        }
      );
    }
  }


  onAnswerLayout() {
    if (this.answerRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.answerRef),
        (x, y) => {
          this.answerX = x;
          this.answerY = y + 9 + fonts.small;
        }
      );
    }
  }


  hydrateState(question) {
    this.setState({ question });
  }

  
  handleQuestionRef(ref) {
    this.questionRef = ref;
  }


  handleAnswerRef(ref) {
    this.answerRef = ref;
  }


  closeInputModal(input, inputLabel) {
    switch (inputLabel) {
      case 'question':
        this.setState({ question: { ...this.state.question, question: input }, showInput: false });
        break;
      case 'answer':
        this.setState({ question: { ...this.state.question, answer: input }, showInput: false });
        break;
      default:
        break;
    }
  }


  handleInputModal(inputLabel, placeholder, maxLength, input, keyboardType = 'default') {
    if (inputLabel === 'question') {
      this.onQuestionLayout();
    } else if (inputLabel === 'answer') {
      this.onAnswerLayout();
    }
    setTimeout(() => {
      this.setState({
        showInput: {
          closeModal: this.closeInputModal,
          keyboardType,
          height: 45,
          input,
          inputLabel,
          maxLength,
          multiline: false,
          placeholder,
          visible: true,
          spellCheck: true,
          width: deviceWidth - 30,
          x: this[`${inputLabel}X`],
          y: this[`${inputLabel}Y`],
        }
      });
    }, 100);
  }


  handleCloseModal() {
    const { question } = this.state;
    const { edit } = question;
    const updatedQuestion = { ...question };
    if (typeof edit === 'number') {
      delete updatedQuestion.edit;
      this.props.closeModal(null, updatedQuestion, edit);
    } else {
      updatedQuestion.uid = `${Math.random()}`;
      this.props.closeModal(null, updatedQuestion);
    }
  }

  
  handleExitModal() {
    this.props.closeModal();
  }


  render() {
    // const {
    // closeModal,
    // visible,
    // } = this.props;

    const {
      answer,
      image,
      question,
    } = this.state.question;

    const { showInput } = this.state;

    return (
      <View style={parentStyles.container}>

        {showInput &&
          <InputModal {...showInput} />}

        <View style={[parentStyles.headerContainer, elevation]}>
          <Touchable
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            onPress={this.handleExitModal}
          >
            <View style={parentStyles.closeContainer}>
              <Aicon name={'close'} style={[parentStyles.closeIcon, parentStyles.closeIconShadow]} />
              <Aicon name={'close'} style={parentStyles.closeIcon} />
            </View>
          </Touchable>
          {/* <Text style={parentStyles.title}>Quiz Builder</Text> */}
          <Touchable
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={this.handleCloseModal}
            style={parentStyles.createContainer}
          >
            <Text style={parentStyles.createLabel}>Done</Text>
          </Touchable>
        </View>

        <ScrollView
          contentContainerStyle={parentStyles.scrollview}
        >
          <Touchable
            onPress={() => {}}
          >
            <View style={[parentStyles.avatarContainer, elevation]}>
              {image ?
                <Image source={{ uri: image }} style={parentStyles.avatarImage} />
                :
                <View>
                  <Aicon name={'image'} style={parentStyles.avatarIcon} />
                  <Text style={parentStyles.avatarLabel}>Tap to add an image</Text>
                </View>}
            </View>
          </Touchable>

          <View
            onLayout={this.onQuestionLayout}
            ref={this.handleQuestionRef}
            style={parentStyles.inputContainer}
          >
            <Text style={parentStyles.inputLabel}>Question</Text>
            <Touchable
              onPress={() => this.handleInputModal('question', 'Enter question', 100, question)}
              style={[parentStyles.inputButton, elevation]}
            >
              <Text
                style={[
                  parentStyles.inputButtonText,
                  !question && parentStyles.placeholder
                ]}
              >
                {question || 'Enter question'}
              </Text>
            </Touchable>
          </View>

          <View
            onLayout={this.onAnswerLayout}
            ref={this.handleAnswerRef}
            style={parentStyles.inputContainer}
          >
            <Text style={parentStyles.inputLabel}>Answer</Text>
            <Touchable
              onPress={() => this.handleInputModal('answer', 'Enter answer', 100, answer, 'numeric')}
              style={[parentStyles.inputButton, elevation]}
            >
              <Text
                style={[
                  parentStyles.inputButtonText,
                  !answer && parentStyles.placeholder
                ]}
              >
                {answer || 'Enter answer'}
              </Text>
            </Touchable>
          </View>
        </ScrollView>

      </View>
    );
  }
}
