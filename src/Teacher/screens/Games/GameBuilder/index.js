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
import ButtonPlay from '../../../../components/ButtonPlay';
import InputModal from '../../../../components/InputModal';
import SelectionModal from '../../../../components/SelectionModal';
import GameBuilderQuestion from './GameBuilderQuestion';
import { elevation, fonts } from '../../../../utils/theme';
import styles from './styles';
// import debug from '../../../../utils/debug';


export default class GameBuilder extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleCreateGame: PropTypes.func.isRequired,
    handlePlayGame: PropTypes.func.isRequired,
    game: PropTypes.shape({
      GameID: PropTypes.string,
      // banner: PropTypes.string,
      category: PropTypes.string,
      CCS: PropTypes.string,
      description: PropTypes.string,
      favorite: PropTypes.boolean,
      questions: PropTypes.arrayOf(PropTypes.shape({
        answer: PropTypes.string,
        image: PropTypes.string,
        instructions: PropTypes.arrayOf(PropTypes.string),
        question: PropTypes.string,
        uid: PropTypes.string,
      })),
      quizTime: PropTypes.string,
      title: PropTypes.string,
      trickTime: PropTypes.string,
    }),
    visible: PropTypes.bool.isRequired,
  };
  
  static defaultProps = {
    handleClose: () => {},
    handleCreateGame: () => {},
    handlePlayGame: () => {},
    game: {
      GameID: '',
      // banner: '',
      category: '',
      CCS: '',
      description: '',
      favorite: false,
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
        // banner: '',
        category: null,
        CCS: null,
        description: null,
        favorite: false,
        questions: [],
        title: null,
      },
      showInput: false,
      showSelection: false,
    };

    this.onTitleLayout = this.onTitleLayout.bind(this);
    this.handleTitleRef = this.handleTitleRef.bind(this);
    this.onDescriptionLayout = this.onDescriptionLayout.bind(this);
    this.handleDescriptionRef = this.handleDescriptionRef.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);

    this.showCategorySelection = this.showCategorySelection.bind(this);
    this.hideCategorySelection = this.hideCategorySelection.bind(this);
    this.showCCSSelection = this.showCCSSelection.bind(this);
    this.hideCCSSelection = this.hideCCSSelection.bind(this);
  
    this.toggleFavorite = this.toggleFavorite.bind(this);
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
          // banner: null,
          description: null,
          questions: [],
          title: null,
        }
      });
    }
  }


  toggleFavorite() {
    const { game } = this.state;
    this.setState({ game: { ...game, favorite: !game.favorite } });
  }

  
  createGame() {
    const { game } = this.state;
    if (this.props.currentGame !== null || game.GameID) {
      // TODO! Handle if editting a "quizmaker" game
      this.props.handleCreateGame(game);
    } else {
      this.props.handleCreateGame({ ...game, GameID: `${Math.random()}` });
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


  handleInputModal(inputLabel, placeholder, maxLength, input = '', keyboardType = 'default') {
    if (inputLabel === 'title') {
      this.onTitleLayout();
    } else if (inputLabel === 'description') {
      this.onDescriptionLayout();
    }
    setTimeout(() => {
      this.setState({
        showInput: {
          autoCapitalize: 'sentences',
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


  // renderBannerUploader = banner => (
  //   <Touchable
  //     onPress={() => {}}
  //   >
  //     <View style={[styles.bannerContainer, elevation]}>
  //       {banner ?
  //         <Image source={{ uri: banner }} style={styles.bannerImage} />
  //         :
  //         <View>
  //           <Aicon name={'image'} style={styles.bannerIcon} />
  //           <Text style={styles.bannerLabel}>Upload splash</Text>
  //         </View>}
  //     </View>
  //   </Touchable>
  // );


  showCategorySelection() {
    this.setState({ showSelection: 'Subject Category' });
  }


  hideCategorySelection(selection = null) {
    this.setState({
      game: { ...this.state.game, category: selection },
      showSelection: false,
    });
  }


  showCCSSelection() {
    this.setState({ showSelection: 'Common Core Standard' });
  }


  hideCCSSelection(selection = null) {
    this.setState({
      game: { ...this.state.game, CCS: selection },
      showSelection: false,
    });
  }


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
            <Text numberOfLines={1} style={styles.questionQuestion}>{`Q: ${question.question}`}</Text>
            <Text numberOfLines={2} style={[styles.questionAnswer, styles.colorPrimary]}>{`A: ${question.answer}`}</Text>
            <Text style={[styles.questionQuestion, styles.questionInstructions]}>
              { `${question.instructions.length} ${question.instructions.length === 1 ? 'Instruction' : 'Instructions'}` }
            </Text>

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
      handlePlayGame,
      visible,
    } = this.props;

    const {
      GameID,
      // banner,
      category,
      CCS,
      description,
      favorite,
      title,
    } = this.state.game;

    const {
      addQuestion,
      showInput,
      showSelection,
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

            {Boolean(showSelection) &&
              <SelectionModal
                handleClose={showSelection === 'Subject Category' ? this.hideCategorySelection : this.hideCCSSelection}
                items={showSelection === 'Subject Category' ?
                  [
                    { label: 'Math', value: 'Math' },
                    { label: 'Algebra', value: 'Algebra' },
                    { label: 'Geometry', value: 'Geometry' },
                    { label: 'Calculus', value: 'Calculus' },
                    { label: 'Statistics', value: 'Statistics' },
                    { label: 'Computer Science', value: 'Computer Science' },
                    { label: 'Art', value: 'Art' },
                    { label: 'Design', value: 'Design' },
                    { label: 'Speech', value: 'Speech' },
                    { label: 'Biology', value: 'Biology' },
                    { label: 'Chemistry', value: 'Chemistry' },
                    { label: 'Physics', value: 'Physics' },
                    { label: 'Geography', value: 'Geography' },
                    { label: 'Psychology', value: 'Psychology' },
                    { label: 'History', value: 'History' },
                    { label: 'Government', value: 'Government' },
                    { label: 'Economics', value: 'Economics' },
                    { label: 'English', value: 'English' },
                    { label: 'Spanish', value: 'Spanish' },
                    { label: 'French', value: 'French' },
                    { label: 'German', value: 'German' },
                    { label: 'Physical Education', value: 'Physical Education' },
                  ] :
                  [
                    { label: 'Level 1', value: '1' },
                    { label: 'Level 2', value: '2' },
                    { label: 'Level 3', value: '3' },
                    { label: 'Level 4', value: '4' },
                    { label: 'Level 5', value: '5' },
                    { label: 'Level 6', value: '6' },
                    { label: 'Level 7', value: '7' },
                    { label: 'Level 8', value: '8' },
                  ]
                }
                onSelect={showSelection === 'Subject Category' ? this.hideCategorySelection : this.hideCCSSelection}
                title={showSelection}
                visible={Boolean(showSelection)}
              />}

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
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                onPress={this.toggleFavorite}
                style={styles.heartWrapper}
              >
                <View style={styles.heartContainer}>
                  <Aicon name={'heart'} style={[styles.heartIcon, styles.heartIconBig]} />
                  <Aicon name={'heart'} style={[styles.heartIcon, favorite && styles.colorPrimary]} />
                </View>
              </Touchable>
              <Touchable
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={this.createGame}
                style={styles.createContainer}
              >
                <Text style={styles.createLabel}>{ GameID ? 'Save' : 'Create' }</Text>
              </Touchable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollview}>

              {/* <Touchable
                onPress={() => {}}
              >
                <View style={[styles.bannerContainer, elevation]}>
                  {banner ?
                    <Image source={{ uri: banner }} style={styles.bannerImage} />
                    :
                    <View>
                      <Aicon name={'image'} style={styles.bannerIcon} />
                      <Text style={styles.bannerLabel}>Upload banner</Text>
                    </View>}
                </View>
              </Touchable> */}

              <View
                onLayout={this.onTitleLayout}
                ref={this.handleTitleRef}
                style={styles.inputContainer}
              >
                <Text style={styles.inputLabel}>Game Title</Text>
                <Touchable
                  onPress={() => this.handleInputModal('title', 'Enter title', 75, title)}
                  style={[styles.inputButton, elevation]}
                >
                  <Text style={[styles.inputButtonText, !title && styles.placeholder]}>
                    {showInput && showInput.inputLabel === 'title' ? null : title || 'Enter title'}
                  </Text>
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
                    {showInput && showInput.inputLabel === 'description' ? null : description || 'Enter description'}
                  </Text>
                </Touchable>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Subject</Text>
                <Touchable
                  onPress={this.showCategorySelection}
                >
                  <View style={[styles.inputButton, elevation, styles.row, styles.spaceBetween]}>
                    <Text style={[styles.inputButtonText, !category && styles.colorPrimary]}>
                      { category || 'Subject Category' }
                    </Text>
                    <Aicon name={'caret-down'} style={[styles.caret, styles.colorPrimary]} />
                  </View>
                </Touchable>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Common Core Standard</Text>
                <Touchable
                  onPress={this.showCCSSelection}  
                >
                  <View style={[styles.inputButton, elevation, styles.row, styles.spaceBetween]}>
                    <Text style={[styles.inputButtonText, !CCS && styles.colorPrimary]}>
                      { CCS || 'Level' }
                    </Text>
                    <Aicon name={'caret-down'} style={[styles.caret, styles.colorPrimary]} />
                  </View>
                </Touchable>
              </View>
              
              {this.renderQuestions()}

              <ButtonWide
                onPress={this.openAddQuestion}
                label={'Add question'}
              />

            </ScrollView>
            
            {Boolean(GameID) && 
              <ButtonPlay onPress={() => handlePlayGame(null, this.state.game)} />}

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
