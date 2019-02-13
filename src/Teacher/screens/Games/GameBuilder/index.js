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
import Eicon from 'react-native-vector-icons/Entypo';
import { verticalScale } from 'react-native-size-matters';
import ButtonWide from '../../../../components/ButtonWide';
import ButtonStart from '../../../../components/ButtonStart';
import InputModal from '../../../../components/InputModal';
import Menu from '../../../../components/Menu';
import GameShare from './GameShare';
import SelectionModal from '../../../../components/SelectionModal';
import { categorySelection, categorySelectionHS, difficultySelection, gradeSelection, levelSelection } from '../../../../config/selections';
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
      grade: PropTypes.string,
      category: PropTypes.string,
      level: PropTypes.string,
      difficulty: PropTypes.string,
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
      grade: '',
      category: '',
      level: '',
      difficulty: '',
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
      edited: false,
      game: {
        // banner: '',
        grade: null,
        category: null,
        level: null,
        difficulty: null,
        description: null,
        favorite: false,
        questions: [],
        title: null,
      },
      showInput: false,
      showMenu: false,
      showSelection: false,
      showShare: false,
    };

    this.onTitleLayout = this.onTitleLayout.bind(this);
    this.handleTitleRef = this.handleTitleRef.bind(this);
    this.onDescriptionLayout = this.onDescriptionLayout.bind(this);
    this.handleDescriptionRef = this.handleDescriptionRef.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);

    this.showGradeSelection = this.showGradeSelection.bind(this);
    this.showCategorySelection = this.showCategorySelection.bind(this);
    this.showLevelSelection = this.showLevelSelection.bind(this);
    this.showDifficultySelection = this.showDifficultySelection.bind(this);  
    this.hideSelection = this.hideSelection.bind(this);
  
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.createGame = this.createGame.bind(this);
    this.closeAddQuestion = this.closeAddQuestion.bind(this);
    this.openAddQuestion = this.openAddQuestion.bind(this);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
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


  setEdited = () => {
    const { edited } = this.state;
    if (!edited) {
      this.setState({ edited: true });
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


  handleCloseGame = () => {
    const { handleClose } = this.props;
    const { edited, game } = this.state;
    if (game.explore && game.favorite && !edited) {
      this.createGame();
    } else if (this.props.game.favorite !== game.favorite && !edited) {
      // Automatically update game is `favorite` was update but fields were not.
      this.createGame();
    }
    handleClose();
  }


  toggleFavorite() {
    const { game } = this.state;
    this.setState({ game: { ...game, favorite: !game.favorite } });
  }

  
  createGame() {
    const { game } = this.state;
    if (this.props.currentGame !== null || game.GameID) {
      const saveGame = { ...game };
      if (saveGame.explore) {
        delete saveGame.explore;
      }
      if (this.props.game.quizmaker && this.state.edited) {
        this.props.handleCreateGame({ ...saveGame, GameID: `${Math.random()}`, quizmaker: null });
      } else {
        this.props.handleCreateGame(saveGame);
      }
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
    this.setEdited();    
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
    this.setEdited();
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


  showGradeSelection() {
    this.setState({ showSelection: 'Grade' });
  }


  showCategorySelection() {
    this.setState({ showSelection: 'Category' });
  }


  showLevelSelection() {
    this.setState({ showSelection: 'Level' });
  }


  showDifficultySelection() {
    this.setState({ showSelection: 'Difficulty' });
  }


  hideSelection(selection) {
    if (typeof selection === 'object') { // Dismiss the event object
      this.setState({ showSelection: false });
      return;
    }
    const { showSelection } = this.state;
    switch (showSelection) {
      case 'Grade': 
        this.setState({
          game: { ...this.state.game, grade: selection || this.props.game.grade },
          showSelection: false,
        });
        break;
      case 'Category': 
        this.setState({
          game: { ...this.state.game, category: selection || this.props.game.category },
          showSelection: false,
        });
        break;
      case 'Level': 
        this.setState({
          game: { ...this.state.game, level: selection || this.props.game.level },
          showSelection: false,
        });
        break;
      case 'Difficulty': 
        this.setState({
          game: { ...this.state.game, difficulty: selection || this.props.game.difficulty },
          showSelection: false,
        });
        break;
      default:
        this.setState({ showSelection: false });
        break;
    }
    this.setEdited();
  }


  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }


  toggleShare() {
    this.setState({ showMenu: false, showShare: !this.state.showShare });
  }


  renderQuestionBlock(question, idx) {
    return (
      <Touchable
        activeOpacity={0.8}
        key={question.uid}
        onPress={() => this.openAddQuestion(null, question, idx)}
      >
        <View style={[styles.questionContainer, elevation]}>

          {question.image && question.image !== 'null' ?
            <Image source={{ uri: question.image }} style={styles.questionImage} /> :
            <View style={styles.questionImage}>
              <Text style={styles.questionImageText}>RightOn!</Text>
            </View>}
          
          <View style={styles.questionTextContainer}>
            <Text style={styles.questionQuestion}>{`Q: ${question.question}`}</Text>
            <Text style={[styles.questionAnswer, styles.colorPrimary]}>{`A: ${question.answer}`}</Text>
            <Text style={[styles.questionQuestion, styles.questionInstructions]}>
              { `${question.instructions.length} ${question.instructions.length === 1 ? 'Solution step' : 'Solution steps'}` }
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
      // handleClose,
      handlePlayGame,
      visible,
    } = this.props;

    const {
      GameID,
      // banner,
      grade,
      category,
      level,
      difficulty,
      description,
      favorite,
      title,
    } = this.state.game;

    const {
      addQuestion,
      edited,
      showInput,
      showMenu,
      showSelection,
      showShare,
    } = this.state;

    let action = '';
    if (GameID && edited) {
      action = 'save';
    } else if (!GameID) {
      action = 'create';
    }

    let selectionItems = [];
    if (showSelection) {
      switch (showSelection) {
        case 'Grade':
          selectionItems = gradeSelection;
          break;
        case 'Category':
          if (!grade) {
            break;
          } else if (grade === 'HS') {
            selectionItems = categorySelectionHS;
          } else {
            selectionItems = categorySelection;
          }
          break;
        case 'Level':
          selectionItems = levelSelection;
          break;
        case 'Difficulty':
          selectionItems = difficultySelection;
          break;
        default:
          break;
      }
    }

    return (
      <Modal
        animationType={'slide'}
        onRequestClose={this.handleCloseGame}
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

            {showMenu && 
              <Menu
                handleClose={this.toggleMenu}
                items={[
                  { onPress: this.toggleShare, label: 'Share' },
                ]}
              />}

            {showShare && 
              <GameShare handleClose={this.toggleShare} />}
            
            {Boolean(GameID) && 
              <ButtonStart onPress={() => handlePlayGame(null, this.state.game)} />}

            {Boolean(showSelection) &&
              <SelectionModal
                handleClose={this.hideSelection}
                items={selectionItems}
                onSelect={this.hideSelection}
                title={showSelection}
                visible={Boolean(showSelection)}
              />}

            <View style={[styles.headerContainer, elevation]}>
              <Touchable
                hitSlop={{ top: 25, right: 25, bottom: 25, left: 25 }}
                onPress={this.handleCloseGame}
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
                <Text style={styles.createLabel}>{ action }</Text>
              </Touchable>
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
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                onPress={this.toggleMenu}
                style={styles.menuWrapper}
              >
                <Eicon name={'dots-three-vertical'} style={styles.heartIconBig} />
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
                <Text style={styles.inputLabel}>Common Core Standard</Text>
                { grade && category && level && difficulty &&
                  <Text style={styles.inputLabel}>{ `${grade === 'HS' ? '' : `${grade}.`}${category}.${level}.${difficulty}` }</Text>}
                <Touchable
                  onPress={this.showGradeSelection}
                >
                  <View style={[styles.inputButton, elevation, styles.row, styles.spaceBetween]}>
                    <Text style={[styles.inputButtonText, !grade && styles.colorPrimary]}>
                      { grade || 'Grade' }
                    </Text>
                    <Aicon name={'caret-down'} style={[styles.caret, styles.colorPrimary]} />
                  </View>
                </Touchable>

                <Touchable
                  onPress={this.showCategorySelection}
                >
                  <View style={[styles.inputButton, elevation, styles.row, styles.spaceBetween]}>
                    <Text style={[styles.inputButtonText, !category && styles.colorPrimary]}>
                      { category || 'Category' }
                    </Text>
                    <Aicon name={'caret-down'} style={[styles.caret, styles.colorPrimary]} />
                  </View>
                </Touchable>

                <Touchable
                  onPress={this.showLevelSelection}
                >
                  <View style={[styles.inputButton, elevation, styles.row, styles.spaceBetween]}>
                    <Text style={[styles.inputButtonText, !level && styles.colorPrimary]}>
                      { level || 'Level' }
                    </Text>
                    <Aicon name={'caret-down'} style={[styles.caret, styles.colorPrimary]} />
                  </View>
                </Touchable>

                <Touchable
                  onPress={this.showDifficultySelection}
                >
                  <View style={[styles.inputButton, elevation, styles.row, styles.spaceBetween]}>
                    <Text style={[styles.inputButtonText, !difficulty && styles.colorPrimary]}>
                      { difficulty || 'Difficulty' }
                    </Text>
                    <Aicon name={'caret-down'} style={[styles.caret, styles.colorPrimary]} />
                  </View>
                </Touchable>
              </View>
              
              {this.renderQuestions()}

              <ButtonWide
                buttonStyles={{ position: 'relative', marginVertical: verticalScale(25) }}
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
