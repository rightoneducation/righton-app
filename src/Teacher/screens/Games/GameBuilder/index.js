import React from 'react';
import {
  findNodeHandle,
  Image,
  Modal,
  ScrollView,
  Text,
  View,
} from 'react-native';
import NativeMethodsMixin from 'NativeMethodsMixin';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import Touchable from 'react-native-platform-touchable';
import Aicon from 'react-native-vector-icons/FontAwesome';
import ButtonWide from '../../../../components/ButtonWide';
import InputModal from '../../../../components/InputModal';
import GameBuilderQuestion from './GameBuilderQuestion';
import { deviceWidth, elevation, fonts } from '../../../../utils/theme';
import styles from './styles';


export default class GameBuilder extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleCreateGame: PropTypes.func.isRequired,
    game: PropTypes.shape({
      avatar: PropTypes.string,
      description: PropTypes.string,
      questions: PropTypes.arrayOf(PropTypes.shape({
        answer: PropTypes.string,
        image: PropTypes.string,
        instructions: PropTypes.arrayOf(PropTypes.string),
        question: PropTypes.string,
        uid: PropTypes.string,
      })),
      title: PropTypes.string,
    }),
    visible: PropTypes.bool.isRequired,
  };
  
  static defaultProps = {
    handleClose: () => {},
    handleCreateGame: () => {},
    game: {
      avatar: '',
      description: '',
      questions: [],
      title: '',
    },
    visible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      addQuestion: {},
      game: {
        avatar: '',
        description: '',
        questions: [],
        title: '',
      },
      showInput: false,
    };

    this.onTitleLayout = this.onTitleLayout.bind(this);
    this.handleTitleRef = this.handleTitleRef.bind(this);
    this.onDescriptionLayout = this.onDescriptionLayout.bind(this);
    this.handleDescriptionRef = this.handleDescriptionRef.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);
    
    this.createGame = this.createGame.bind(this);
    this.closeAddQuestion = this.closeAddQuestion.bind(this);
    this.openAddQuestion = this.openAddQuestion.bind(this);
  }


  componentDidMount() {
    this.hydrateState(this.props.game);
  }


  onTitleLayout() {
    if (this.titleRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.titleRef),
        (x, y) => {
          this.titleX = x;
          this.titleY = y + 9 + fonts.small;
        }
      );
    }
  }


  onDescriptionLayout() {
    if (this.descriptionRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.descriptionRef),
        (x, y) => {
          this.descriptionX = x;
          this.descriptionY = y + 9 + fonts.small;
        }
      );
    }
  }

  
  hydrateState(game) {
    if (game && Object.keys(game).length) {
      this.setState({ game });
    } else {
      this.setState({ 
        game: {
          avatar: '',
          description: '',
          questions: [],
          title: '',
        }
      });
    }
  }

  
  createGame() {
    const { game } = this.state;
    if (this.props.currentgame !== null || game.uid) {
      this.props.handleCreateGame(game);
    } else {
      this.props.handleCreateGame({ ...game, uid: `${Math.random()}` });
    }
  }

  
  handleTitleRef(ref) {
    this.titleRef = ref;
  }


  handleDescriptionRef(ref) {
    this.descriptionRef = ref;
  }


  closeInputModal(input, inputLabel) {
    switch (inputLabel) {
      case 'title':
        this.setState({ game: { ...this.state.game, title: input }, showInput: false });
        break;
      case 'description':
        this.setState({ game: { ...this.state.game, description: input }, showInput: false });
        break;
      default:
        break;
    }
  }


  handleInputModal(inputLabel, placeholder, maxLength, input, keyboardType = 'default') {
    if (inputLabel === 'title') {
      this.onTitleLayout();
    } else if (inputLabel === 'description') {
      this.onDescriptionLayout();
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


  openAddQuestion(event, question = {}, edit) {
    this.setState({ addQuestion: { ...question, edit } });
    this.swiperRef.scrollBy(1, false);
  }


  closeAddQuestion(event, question, edit) {
    const { game } = this.state;
    if (typeof edit === 'number') {
      const updatedGame = { ...game };
      updatedGame.questions.splice(edit, 1, question);
      this.setState({ addQuestion: {}, game: updatedGame });
    } else if (question) {
      this.setState({
        addQuestion: {},
        game: { ...game, questions: [...game.questions, question] },
      });
    } else {
      this.setState({ addQuestion: {} });
    }
    this.swiperRef.scrollBy(-1, false);
  }


  // renderHeader() {
  //   const { handleClose } = this.props;
  //   return (
  //     <View style={[styles.headerContainer, elevation]}>
  //       <Touchable
  //         hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
  //         onPress={handleClose}
  //       >
  //         <View style={styles.closeContainer}>
  //           <Aicon name={'close'} style={[styles.closeIcon, styles.closeIconShadow]} />
  //           <Aicon name={'close'} style={styles.closeIcon} />
  //         </View>
  //       </Touchable>
  //       <Text style={styles.title}>Game Builder</Text>
  //       <Touchable
  //         hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
  //         onPress={handleClose}
  //         style={styles.createContainer}
  //       >
  //         <Text style={styles.createLabel}>Create</Text>
  //       </Touchable>
  //     </View>
  //   );
  // }


  // renderAvatarUploader = avatar => (
  //   <Touchable
  //     onPress={() => {}}
  //   >
  //     <View style={[styles.avatarContainer, elevation]}>
  //       {avatar ?
  //         <Image source={{ uri: avatar }} style={styles.avatarImage} />
  //         :
  //         <View>
  //           <Aicon name={'image'} style={styles.avatarIcon} />
  //           <Text style={styles.avatarLabel}>Upload splash</Text>
  //         </View>}
  //     </View>
  //   </Touchable>
  // );


  // renderTitleInput = (title, showInput) => (
  //   <View
  //     onLayout={this.onTitleLayout}
  //     style={styles.inputContainer}
  //   >
  //     <Text style={styles.inputLabel}>Title</Text>
  //     {showInput ?
  //       <TextInput
  //         keyboardType={'default'}
  //         maxLength={40}
  //         multiline={false}
  //         onBlur={this.handleTitleBlur}
  //         onChangeText={this.handleTitleInput}
  //         onSubmitEditing={this.handleTitleSubmit}
  //         placeholder={'Enter title'}
  //         placeholderTextColor={colors.dark}
  //         returnKeyType={'done'}
  //         spellCheck
  //         style={[styles.inputButton, styles.inputButtonText, elevation]}
  //         textAlign={'left'}
  //         underlineColorAndroid={colors.lightGray}
  //         value={title}
  //       />
  //       :
  //       <Touchable
  //         onPress={() => this.handleInputModal('title')}
  //         style={[styles.inputButton, elevation]}
  //       >
  //         <Text style={[styles.inputButtonText, !title && styles.placeholder]}>
  //           {title || 'Enter title'}
  //         </Text>
  //       </Touchable>}
  //   </View>
  // );


  // renderDescriptionInput = (description, showInput) => (
  //   <View style={styles.inputContainer}>
  //     <Text style={styles.inputLabel}>Description</Text>
  //     {showInput ?
  //       <TextInput
  //         keyboardType={'default'}
  //         maxLength={40}
  //         multiline={false}
  //         onBlur={this.handleDescriptionBlur}
  //         onChangeText={this.handleDescriptionInput}
  //         onSubmitEditing={this.handleDescriptionSubmit}
  //         placeholder={'Enter description'}
  //         placeholderTextColor={colors.lightGray}
  //         returnKeyType={'done'}
  //         spellCheck
  //         style={[styles.inputButton, styles.inputButtonText, elevation]}
  //         textAlign={'left'}
  //         underlineColorAndroid={colors.lightGray}
  //         value={description}
  //       />
  //       :
  //       <Touchable
  //         onPress={() => {}}
  //         style={[styles.inputButton, elevation]}
  //       >
  //         <Text style={[styles.inputButtonText, !description && styles.placeholder]}>
  //           {description || 'Enter description'}
  //         </Text>
  //       </Touchable>}
  //   </View>
  // );


  renderQuestionBlock(question, idx) {
    return (
      <Touchable
        activeOpacity={0.8}
        key={question.uid}
        onPress={() => this.openAddQuestion(null, question, idx)}
      >
        <View style={[styles.questionContainer, elevation]}>

          {question.image ?
            <Image source={{ uri: question.image }} style={styles.questionImage} /> :
            <View style={styles.questionImage}>
              <Text style={styles.questionImageText}>RightOn!</Text>
            </View>}
          
          <View style={styles.questionTextContainer}>
            <Text style={styles.questionQuestion}>{question.question}</Text>
            <Text style={styles.questionAnswer}>{question.answer}</Text>

            {(!question.question || !question.answer) &&
              <Aicon name={'exclamation-triangle'} style={styles.warning} />}

          </View>
        </View>
      </Touchable>
    );
  }


  renderQuestions() {
    const { questions } = this.state.game;
    if (Array.isArray(questions)) {
      return (
        <View style={styles.questionsContainer}>
          {Boolean(questions.length) && <Text style={styles.inputLabel}>Questions</Text>}
          {questions.map((question, idx) => this.renderQuestionBlock(question, idx))}
        </View>
      );
    }
    return null;
  }


  render() {
    const {
      handleClose,
      visible,
    } = this.props;

    const {
      avatar,
      description,
      title,
    } = this.state.game;

    const {
      addQuestion,
      showInput,
    } = this.state;

    return (
      <Modal
        animationType={'slide'}
        onRequestClose={handleClose}
        transparent={false}
        visible={visible}
      >
        <Swiper
          horizontal={false}
          index={0}
          loadMinimal={false}
          loop={false}
          ref={(ref) => { this.swiperRef = ref; }}
          scrollEnabled={false}
          showsPagination={false}
        >
          <View style={styles.container}>

            {showInput &&
              <InputModal {...showInput} />}

            <View style={[styles.headerContainer, elevation]}>
              <Touchable
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                onPress={handleClose}
              >
                <View style={styles.closeContainer}>
                  <Aicon name={'close'} style={[styles.closeIcon, styles.closeIconShadow]} />
                  <Aicon name={'close'} style={styles.closeIcon} />
                </View>
              </Touchable>
              <Text style={styles.title}>Game Builder</Text>
              <Touchable
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={this.createGame}
                style={styles.createContainer}
              >
                <Text style={styles.createLabel}>Create</Text>
              </Touchable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollview}>

              <Touchable
                onPress={() => {}}
              >
                <View style={[styles.avatarContainer, elevation]}>
                  {avatar ?
                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                    :
                    <View>
                      <Aicon name={'image'} style={styles.avatarIcon} />
                      <Text style={styles.avatarLabel}>Upload banner</Text>
                    </View>}
                </View>
              </Touchable>

              <View
                onLayout={this.onTitleLayout}
                ref={this.handleTitleRef}
                style={styles.inputContainer}
              >
                <Text style={styles.inputLabel}>Title</Text>
                <Touchable
                  onPress={() => this.handleInputModal('title', 'Enter title', 75, title)}
                  style={[styles.inputButton, elevation]}
                >
                  <Text style={[styles.inputButtonText, !title && styles.placeholder]}>{title || 'Enter title'}</Text>
                </Touchable>
              </View>

              <View
                onLayout={this.onDescriptionLayout}
                ref={this.handleDescriptionRef}
                style={styles.inputContainer}
              >
                <Text style={styles.inputLabel}>Description</Text>
                <Touchable
                  onPress={() => this.handleInputModal('description', 'Enter description', 100, description)}
                  style={[styles.inputButton, elevation]}
                >
                  <Text
                    style={[
                      styles.inputButtonText, 
                      !description && styles.placeholder
                    ]}
                  >
                    {description || 'Enter description'}
                  </Text>
                </Touchable>
              </View>
              
              {this.renderQuestions()}

              <ButtonWide
                onPress={this.openAddQuestion}
                label={'Add question'}
              />

            </ScrollView>
          </View>

          <GameBuilderQuestion
            closeModal={this.closeAddQuestion}
            question={addQuestion}
          />

        </Swiper>
      </Modal>
    );
  }
}
