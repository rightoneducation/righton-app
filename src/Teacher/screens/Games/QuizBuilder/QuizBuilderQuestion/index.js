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
import ButtonWide from '../../../../../components/ButtonWide';
import SelectionModal from '../../../../../components/SelectionModal';
import parentStyles from '../styles';
import { deviceWidth, elevation, fonts } from '../../../../../utils/theme';


export default class QuizBuilderQuestion extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    question: PropTypes.shape({
      answer: PropTypes.string,
      image: PropTypes.string,
      instructions: PropTypes.arrayOf(PropTypes.string),
      quesiton: PropTypes.string,
      time: PropTypes.string,
    }),
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    closeModal: () => {},
    question: {
      answer: '',
      image: '',
      instructions: [],
      question: '',
      time: '0:00',
      uid: '',
    },
    visible: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      question: {
        answer: '',
        image: '',
        instructions: [],
        question: '',
        time: '0:00',
        uid: '',
      },
      showInput: false,
      showSelection: false,
    };

    this.blankQuestionState = this.state.question;

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleExitModal = this.handleExitModal.bind(this);
    this.handleTimeSelection = this.handleTimeSelection.bind(this);
    this.handleOpenTimeSelection = this.handleOpenTimeSelection.bind(this);
    this.handleAddInstruction = this.handleAddInstruction.bind(this);

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
    if (this.props.question.uid !== nextProps.question.uid) {
      this.hydrateState(nextProps.question);
    } else if (nextProps.question.uid === undefined) {
      this.hydrateState(this.blankQuestionState);
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
      case 'instruction':
        if (this.instructionIndex) {
          const updatedInstructions = [...this.state.question.instructions];
          updatedInstructions.splice(this.instructionIndex, 1, input);
          this.setState({
            question: { ...this.state.question, instructions: updatedInstructions },
            showInput: false,
          });
          this.instructionIndex = null;
        } else {
          this.setState({
            question: {
              ...this.state.question,
              instructions: [...this.state.question.instructions, input],
            },
            showInput: false,
          });
        }
        break;
      default:
        break;
    }
  }


  handleAddInstruction(idx) {
    if (typeof idx === 'number') {
      this.instructionIndex = idx;
    }
    this.handleInputModal('instruction', 'Enter instruction', 100, '', 'default');
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


  handleTimeSelection(time) {
    if (typeof time === 'object' || !time) {
      this.setState({ showSelection: false });
    } else {
      this.setState({ question: { ...this.state.question, time }, showSelection: false });
    }
  }


  handleOpenTimeSelection() {
    this.setState({ showSelection: true });
  }


  render() {
    const {
      answer,
      image,
      instructions,
      question,
      time,
    } = this.state.question;

    const { showInput, showSelection } = this.state;

    return (
      <View style={parentStyles.container}>

        {showInput &&
          <InputModal {...showInput} />}

        {showSelection &&
          <SelectionModal
            handleClose={this.handleTimeSelection}
            items={[
              { label: 'No time limit', value: '0:00' },
              { label: '0:30', value: '0:30' },
              { label: '1:00', value: '1:00' },
              { label: '1:30', value: '1:30' },
              { label: '2:00', value: '2:00' },
              { label: '2:30', value: '2:30' },
              { label: '3:00', value: '3:00' },
              { label: '3:30', value: '3:30' },
              { label: '4:00', value: '4:00' },
              { label: '4:30', value: '4:30' },
              { label: '5:00', value: '5:00' },
              { label: '10:00', value: '10:00' },
              { label: '15:00', value: '15:00' },
              { label: '20:00', value: '20:00' },
              { label: '25:00', value: '25:00' },
              { label: '30:00', value: '30:00' },
              { label: '45:00', value: '45:00' },
              { label: '60:00', value: '60:00' },
            ]}
            onSelect={this.handleTimeSelection}
            title={'Time remaining'}
            visible={showSelection}
          />}

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
          contentContainerStyle={[parentStyles.scrollview, { paddingBottom: 115 }]}
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
              <Touchable
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={this.handleOpenTimeSelection}
                style={parentStyles.timeSelectionContainer}
              >
                <Text style={parentStyles.timeSelectionLabel}>{ time }</Text>
              </Touchable>
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

          {Boolean(instructions) &&
            <Text style={[parentStyles.inputLabel, parentStyles.marginTop]}>Instructions</Text>}

          {Boolean(instructions) && instructions.map((instruction, idx) => (
            <Touchable
              activeOpacity={0.8}
              key={instruction}
              onPress={() => this.handleAddInstruction(idx)}
            >
              <View style={[parentStyles.inputContainer, parentStyles.row]}>
                <Text style={parentStyles.avatarLabel}>{`${idx + 1}.  `}</Text>
                <Text style={parentStyles.avatarLabel}>{ instruction }</Text>
              </View>
            </Touchable>
          ))}

          <ButtonWide
            buttonStyles={{ position: 'absolute', bottom: 25 }}
            label={'+ Instruction Step'}
            onPress={this.handleAddInstruction}
          />
        </ScrollView>

      </View>
    );
  }
}
