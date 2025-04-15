import React, { useState, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import {
  CentralQuestionTemplateInput,
  IGameTemplate,
  IQuestionTemplate,
  PublicPrivateType,
} from '@righton/networking';
import { Box, CircularProgress, Grid, Fade, useTheme } from '@mui/material';
import CentralButton from '../components/button/Button';
import { ButtonType, buttonContentMap } from '../components/button/ButtonModels';
import CreateGameCardBase from '../components/cards/creategamecard/CreateGameCardBase';
import ManageQuestionsButtons from '../components/button/managequestionsbutton/ManageQuestionButtons';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameBoxContainer,
  CreateGameGridContainer,
  CreateGameCardGridItem,
  GameCreateButtonStack,
  TitleText,
} from '../lib/styledcomponents/CreateGameStyledComponent';
import {
  GameQuestionType,
  CreateQuestionHighlightCard,
  ScreenSize,
  StorageKey,
} from '../lib/CentralModels';
import tabExploreQuestionsIcon from '../images/tabExploreQuestions.svg';
import tabMyQuestionsIcon from '../images/tabMyQuestions.svg';
import tabFavoritesIcon from '../images/tabFavorites.svg';
import { reverseTimesMap } from '../components/cards/creategamecard/time';
import ViewQuestionCards from '../components/question/ViewQuestionCards';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';

interface ViewGameProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
}

// Library Questions
const tabMap: { [key: number]: string } = {
  0: 'Explore Questions',
  1: 'My Questions',
  2: 'Favorites',
};

const tabIconMap: { [key: number]: string } = {
  0: tabExploreQuestionsIcon,
  1: tabMyQuestionsIcon,
  2: tabFavoritesIcon,
};

// Create Question
type TDraftQuestionsList = {
  publicPrivate: PublicPrivateType;
  isAIEnabled: boolean;
  isAIError: boolean;
  question: CentralQuestionTemplateInput;
  questionImageModalIsOpen: boolean;
  isCCSSVisibleModal: boolean;
  isImageUploadVisible: boolean;
  isImageURLVisible: boolean;
  isCreatingTemplate: boolean;
  isQuestionCardErrored: boolean;
  isQuestionCardSubmitted: boolean;
  highlightCard: CreateQuestionHighlightCard;
  isMultipleChoice: boolean;
  questionTemplate: IQuestionTemplate;
};

const newEmptyTemplate: CentralQuestionTemplateInput = {
  questionCard: {
    title: '',
    ccss: 'CCSS',
    isFirstEdit: true,
    isCardComplete: false,
  },
  correctCard: {
    answer: '',
    answerSteps: ['', '', ''],
    isFirstEdit: true,
    isCardComplete: false,
  },
  incorrectCards: [
    {
      id: 'card-1',
      answer: '',
      explanation: '',
      isFirstEdit: true,
      isCardComplete: false,
    },
    {
      id: 'card-2',
      answer: '',
      explanation: '',
      isFirstEdit: true,
      isCardComplete: false,
    },
    {
      id: 'card-3',
      answer: '',
      explanation: '',
      isFirstEdit: true,
      isCardComplete: false,
    },
  ],
};

const emptyQuestionTemplate: IQuestionTemplate = {
  id: '',
  title: '',
  lowerCaseTitle: '',
  version: 0,
  ccss: '',
  domain: '',
  cluster: '',
  grade: '',
  gradeFilter: '',
  standard: '',
  gameTemplatesCount: 0,
};

const draftTemplate: TDraftQuestionsList = {
  publicPrivate: PublicPrivateType.PUBLIC,
  isAIEnabled: false,
  isAIError: false,
  question: newEmptyTemplate,
  questionImageModalIsOpen: false,
  isCCSSVisibleModal: false,
  isImageUploadVisible: false,
  isImageURLVisible: false,
  isCreatingTemplate: false,
  isQuestionCardErrored: false,
  isQuestionCardSubmitted: false,
  highlightCard: CreateQuestionHighlightCard.QUESTIONCARD,
  isMultipleChoice: true,
  questionTemplate: emptyQuestionTemplate,
};

// Create Game
export type TGameTemplateProps = {
  gameTemplate: IGameTemplate;
  isGameCardSubmitted: boolean;
  questionCount: number;
  openQuestionBank: boolean;
  openCreateQuestion: boolean;
  publicPrivateGame: PublicPrivateType;
  isGameCardErrored: boolean;
  isGameImageUploadVisible: boolean;
  isGameURLUploadVisible: boolean;
  isCreatingTemplate: boolean;
  image?: File | null;
  imageUrl?: string | undefined;
};

export type TPhaseTime = {
  phaseOne: string;
  phaseTwo: string;
};

const newGameTemplate = {
  id: '',
  title: '',
  lowerCaseTitle: '',
  owner: '',
  version: 0,
  description: '',
  lowerCaseDescription: '',
  phaseOneTime: 0,
  phaseTwoTime: 0,
  questionTemplatesCount: 0,
  questionTemplatesOrder: [],
};

const gameTemplate: TGameTemplateProps = {
  gameTemplate: newGameTemplate,
  isGameCardErrored: false,
  isGameCardSubmitted: false,
  questionCount: 1,
  openCreateQuestion: false,
  openQuestionBank: false,
  publicPrivateGame: PublicPrivateType.PUBLIC,
  isGameImageUploadVisible: false,
  isGameURLUploadVisible: false,
  isCreatingTemplate: false,
  image: null,
  imageUrl: '',
};

export default function ViewGame({ 
  screenSize,
  fetchElement
}: ViewGameProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const route = useMatch('/games/:gameId');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [iconButtons, setIconButtons] = useState<number[]>([1]);
  const [saveQuestionError, setSaveQuestionError] = useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [draftGame, setDraftGame] = useState<TGameTemplateProps>(gameTemplate);
  const [phaseTime, setPhaseTime] = useState<TPhaseTime>({
    phaseOne: '',
    phaseTwo: '',
  });
  const questions = centralData.selectedGame?.questionTemplates;
  console.log(questions);
  const gameFormIsValid =
    draftGame.gameTemplate.title !== '' &&
    draftGame.gameTemplate.description !== '' &&
    draftGame.gameTemplate.phaseOneTime !== 0 &&
    draftGame.gameTemplate.phaseTwoTime !== 0;
  
  useEffect(() => {
    setIsLoading(false);
    let id = route?.params.gameId || '';
    let title = '';
    let description = '';
    let phaseOneTime = 0;
    let phaseTwoTime = 0;
    if (centralData.selectedGame) {
      id = centralData.selectedGame.id;
      title = centralData.selectedGame.title;
      description = centralData.selectedGame.description;
      phaseOneTime = centralData.selectedGame.phaseOneTime;
      phaseTwoTime = centralData.selectedGame.phaseTwoTime;
    }
    // if there isn't a selected game (user is linking to a game directly)
    if (!centralData.selectedGame){
      setIsLoading(true);
      fetchElement(GameQuestionType.GAME, id);
    }

    if (id && id !== '') {
      setDraftGame((prev) => ({
        ...prev,
        gameTemplate: {
          ...prev.gameTemplate,
          id,
          title,
          lowerCaseTitle: title.toLowerCase(),
          description,
          lowerCaseDescription: description.toLowerCase(),
          phaseOneTime,
          phaseTwoTime,
        },
      }));
    }
  }, [centralData.selectedGame, route ]); // eslint-disable-line 

  const handleLaunchGame = () => {
    console.log('Launch');
  };

  /** CREATE GAME HANDLERS START HERE */
  const handleGameTitle = (val: string) => {
    setDraftGame((prev) => ({
      ...prev,
      gameTemplate: {
        ...prev.gameTemplate,
        title: val,
        lowerCaseTitle: val.toLowerCase(),
      },
    }));
  };

  const handleGameDescription = (val: string) => {
    setDraftGame((prev) => ({
      ...prev,
      gameTemplate: {
        ...prev.gameTemplate,
        description: val,
        lowerCaseDescription: val.toLowerCase(),
      },
    }));
  };

  const handlePhaseTime = (time: TPhaseTime) => {
    setDraftGame((prev) => {
      const phaseOne = reverseTimesMap[time.phaseOne];
      const phaseTwo = reverseTimesMap[time.phaseTwo];
      const updatedGameTemplate = {
        ...prev,
        gameTemplate: {
          ...prev.gameTemplate,
          ...(time.phaseOne && { phaseOneTime: phaseOne }),
          ...(time.phaseTwo && { phaseTwoTime: phaseTwo }),
        },
      };
      return updatedGameTemplate;
    });
    setPhaseTime((prev) => ({
      ...prev,
      ...(time.phaseOne && { phaseOne: time.phaseOne }),
      ...(time.phaseTwo && { phaseTwo: time.phaseTwo }),
    }));
  };

  const handleOpenCreateQuestion = () => {
    setDraftGame((prev) => ({
      ...prev,
      // check if form is complete & if question bank is open, close it.
      ...(draftGame.openQuestionBank &&
        gameFormIsValid && { openQuestionBank: false }),
      // check game form is complete before displaying question form
      ...(gameFormIsValid && { openCreateQuestion: !prev.openCreateQuestion }),
      // if the card was in an error state, but not anymore set it to false
      ...(gameFormIsValid &&
        draftGame.isGameCardErrored && { isGameCardErrored: false }),
      // if the form is not valid, flag an error
      ...(!gameFormIsValid && { isGameCardErrored: true }),
    }));
  };

  const handleOpenQuestionBank = () => {
    setDraftGame((prev) => ({
      ...prev,
      ...(draftGame.openCreateQuestion &&
        gameFormIsValid && { openCreateQuestion: false }),
      ...(gameFormIsValid && { openQuestionBank: !prev.openQuestionBank }),
      ...(gameFormIsValid &&
        draftGame.isGameCardErrored && { isGameCardErrored: false }),
      ...(!gameFormIsValid && { isGameCardErrored: true }),
    }));
  };

  const handlePublicPrivateGameChange = (value: PublicPrivateType) => {
    setDraftGame((prev) => ({
      ...prev,
      publicPrivateGame: value,
    }));
  };

  const handleDiscardGame = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleGameImageUploadClick = () => {
    setDraftGame((prev) => ({
      ...prev,
      isGameImageUploadVisible: !prev.isGameImageUploadVisible,
    }));
  };

  const handleCloseGameCardModal = () => {
    setDraftGame((prev) => ({
      ...prev,
      isGameImageUploadVisible: false,
    }));
  };
  const handleGameImageSave = async (inputImage?: File, inputUrl?: string) => {
    if (inputImage) {
      setDraftGame((prev) => ({
        ...prev,
        image: inputImage,
        imageUrl: undefined,
        isGameImageUploadVisible: false,
        isGameURLUploadVisible: false,
      }));
    }

    if (inputUrl) {
      setDraftGame((prev) => ({
        ...prev,
        imageUrl: inputUrl,
        image: undefined,
        isGameImageUploadVisible: false,
        isGameURLUploadVisible: false,
      }));
    }
  };

  const handleGameImageChange = async (
    inputImage?: File,
    inputUrl?: string,
  ) => {
    if (inputImage) {
      setDraftGame((prev) => ({
        ...prev,
        image: inputImage,
        imageUrl: undefined,
      }));
    }

    if (inputUrl) {
      setDraftGame((prev) => ({
        ...prev,
        imageUrl: inputUrl,
        image: undefined,
      }));
    }
  };


  // game questions index handlers
  const handleQuestionIndexChange = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const handleAddMoreQuestions = () => {
    setDraftGame((prev) => ({
      ...prev,
      questionCount: prev.questionCount + 1,
      gameTemplate: {
        ...prev.gameTemplate,
      },
    }));
    setIconButtons((prev) => [...prev, prev.length + 1]);
  };

  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      { isLoading  ?
          <Box style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress
              style={{ color: `${theme.palette.primary.circularProgress}` }}
            />
          </Box>
        :
          <CreateGameBoxContainer>
            <TitleText screenSize={screenSize}>View Game</TitleText>
            <CreateGameGridContainer container wrap="nowrap">
              <CreateGameCardGridItem
                item
                sm={12}
                md={10}
                lg={4}
                screenSize={screenSize}
              >
                  <CreateGameCardBase
                    draftGame={draftGame}
                      screenSize={screenSize}
                      handleImageUploadClick={handleGameImageUploadClick}
                      handlePublicPrivateChange={handlePublicPrivateGameChange}
                      handlePhaseTime={handlePhaseTime}
                      onGameDescription={handleGameDescription}
                      onGameTitle={handleGameTitle}
                      isCardSubmitted={draftGame.isGameCardSubmitted}
                      isCardErrored={draftGame.isGameCardErrored}
                      phaseTime={phaseTime}
                      gameTitle={draftGame.gameTemplate.title}
                      gameDescription={draftGame.gameTemplate.description}
                      openCreateQuestion={draftGame.openCreateQuestion}
                      openQuestionBank={draftGame.openQuestionBank}

                    />
                </CreateGameCardGridItem>
            </CreateGameGridContainer>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <GameCreateButtonStack sx={{ 
                ...(screenSize === ScreenSize.SMALL && { flexDirection: 'column'})
              }}>
                <CentralButton
                  smallScreenOverride
                  buttonWidthOverride='100%'
                  buttonType={ButtonType.LAUNCHGAME}
                  isEnabled
                  onClick={handleLaunchGame}
                />
              </GameCreateButtonStack>
              <GameCreateButtonStack>
                <ManageQuestionsButtons 
                  questions={questions ?? []}
                  iconButtons={iconButtons}
                  isCreate={false}
                  selectedIndex={selectedQuestionIndex}
                  setSelectedIndex={handleQuestionIndexChange}
                />
              </GameCreateButtonStack>
            </Box>
            {questions && questions.map(
              (question, index) =>
                index === selectedQuestionIndex && (
                  <ViewQuestionCards screenSize={screenSize} question={question.questionTemplate}/>
                ),
            )}
        </CreateGameBoxContainer>
      }
    </CreateGameMainContainer>
  );
}
