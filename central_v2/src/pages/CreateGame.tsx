import React, { useCallback, useState } from 'react';
import {
  Box,
  useTheme,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { debounce } from 'lodash';
import {
  CentralQuestionTemplateInput,
  IncorrectCard,
  PublicPrivateType,
  IGameTemplate
} from '@righton/networking';
import { useNavigate } from 'react-router-dom';
import {
  CreateGameMainContainer,
  CreateGameBackground,
  CreateGameSaveDiscardGridItem,
  CreateGameCardGridItem,
  AddMoreIconButton,
  TitleText,
  CreateGameGridContainer,
  QuestionCountButton,
  CreateGameBoxContainer,
  CreateGameSaveDiscardBoxContainer,
  GameCreateButtonStack
} from '../lib/styledcomponents/CreateGameStyledComponent';
import {
  CreateQuestionHighlightCard,
  ScreenSize,
  StorageKey,
  TemplateType,
} from '../lib/CentralModels';
import ModalBackground from '../components/modal/ModalBackground';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import CreatingTemplateModal from '../components/modal/CreatingTemplateModal';
import CentralButton from '../components/button/Button';
import CreateGameComponent from '../components/game/CreateGameComponent';
import QuestionElements from '../components/game/QuestionGridItems';
import {
  buttonContentMap,
  ButtonType,
} from '../components/button/ButtonModels';
import { updateDQwithCorrectAnswerClick } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import {
  handleMoveAnswerToComplete,
  updateDQwithIncorrectAnswerClick,
  updateDQwithIncorrectAnswers,
} from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import {
  updateDQwithCCSS,
  updateDQwithImage,
  updateDQwithImageURL,
  updateDQwithQuestionClick,
  updateDQwithTitle,
} from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import useCreateQuestionLoader from '../loaders/useCreateQuestionLoader';
import CreateGameCardBase from '../components/cards/creategamecard/CreateGameCardBase';
import VerticalMoreImg from '../images/buttonIconVerticalMore.svg'
import { CreateQuestionGridContainer } from '../lib/styledcomponents/CreateQuestionStyledComponents';

interface CreateGameProps {
  screenSize: ScreenSize;
}

const verticalEllipsis = <img src={VerticalMoreImg} alt="more-elipsis" />;
export default function CreateGame({ screenSize }: CreateGameProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const currentScreenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isImageUploadVisible, setIsImageUploadVisible] =
    useState<boolean>(false);
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] =
    useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [highlightCard, setHighlightCard] =
    useState<CreateQuestionHighlightCard>(
      CreateQuestionHighlightCard.QUESTIONCARD,
    );
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const localData = useCreateQuestionLoader();

  const [incompleteIncorrectAnswers, setIncompleteIncorrectAnswers] = useState<
    IncorrectCard[]
  >(
    localData.incompleteCards ?? [
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
  );
  const [completeIncorrectAnswers, setCompleteIncorrectAnswers] = useState<
    IncorrectCard[]
  >(localData.completeCards ?? []);

  const [draftQuestion, setDraftQuestion] =
    useState<CentralQuestionTemplateInput>(() => {
      return (
        localData.draftQuestion ?? {
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
            ...incompleteIncorrectAnswers,
            ...completeIncorrectAnswers,
          ],
        }
      );
    });
  const [isCardSubmitted, setIsCardSubmitted] = useState<boolean>(false);
  const [isGameCardSubmitted, setIsGameCardSubmitted] = useState<boolean>(false);
  const [isCardErrored, setIsCardErrored] = useState<boolean>(false);
  const [isGameCardErrored, setIsGameCardErrored] = useState<boolean>(false);
  const [isAIError, setIsAIError] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [createQuestion, setCreateQuestion] = useState<boolean>(false);
  const [openQuestionBank, setOpenQuestionBank] = useState<boolean>(false);
  // QuestionCardBase handler functions
  const handleImageChange = async (inputImage?: File, inputUrl?: string) => {
    if (inputImage) {
      const newDraftQuestion = updateDQwithImage(
        draftQuestion,
        undefined,
        inputImage,
      );
      setDraftQuestion(newDraftQuestion);
    } else if (inputUrl) {
      const newDraftQuestion = updateDQwithImageURL(draftQuestion, inputUrl);
      setDraftQuestion(newDraftQuestion);
    }
  };

  const handleImageSave = async (inputImage?: File, inputUrl?: string) => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    if (inputImage) {
      const { isFirstEdit } = draftQuestion.questionCard;
      const newDraftQuestion = updateDQwithImage(
        draftQuestion,
        undefined,
        inputImage,
      );
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
    }
    if (inputUrl) {
      const { isFirstEdit } = draftQuestion.questionCard;
      const newDraftQuestion = updateDQwithImageURL(draftQuestion, inputUrl);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
    }
  };

  const handleDebouncedTitleChange = useCallback(// eslint-disable-line
    debounce(
      (title: string, draftQuestionInput: CentralQuestionTemplateInput) => {
        const { isFirstEdit } = draftQuestionInput.questionCard;
        const newDraftQuestion = updateDQwithTitle(draftQuestionInput, title);
        window.localStorage.setItem(
          StorageKey,
          JSON.stringify(newDraftQuestion),
        );
        setDraftQuestion(newDraftQuestion);
        console.log(newDraftQuestion);
        if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
          setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
      },
      1000,
    ),
    [],
  );

  const handleCCSSSubmit = (ccssString: string) => {
    setIsCCSSVisible(false);
    const { isFirstEdit } = draftQuestion.questionCard;
    const newDraftQuestion = updateDQwithCCSS(draftQuestion, ccssString);
    window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
    setDraftQuestion(newDraftQuestion);
    if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
  };

  const handleCCSSClick = () => {
    setIsCCSSVisible((prev) => !prev);
  };

  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  };

  const handlePublicPrivateChange = (value: PublicPrivateType) => {
    setPublicPrivate((prev) => value);
  };

  const handleCloseModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    setIsCreatingTemplate(false);
    setIsCCSSVisible(false);
  };

  const handleClick = (cardType: CreateQuestionHighlightCard) => {
    switch (cardType) {
      case CreateQuestionHighlightCard.CORRECTANSWER:
        if (draftQuestion.correctCard.isCardComplete) {
          const newDraftQuestion =
            updateDQwithCorrectAnswerClick(draftQuestion);
          window.localStorage.setItem(
            StorageKey,
            JSON.stringify(newDraftQuestion),
          );
          setDraftQuestion(newDraftQuestion);
        }
        break;
      case CreateQuestionHighlightCard.INCORRECTANSWER1:
      case CreateQuestionHighlightCard.INCORRECTANSWER2:
      case CreateQuestionHighlightCard.INCORRECTANSWER3: {
        // then we can update the draftQuestion for the api call and the localStorage for retreival, respectively
        const newDraftQuestion = updateDQwithIncorrectAnswerClick(
          draftQuestion,
          cardType,
        );
        window.localStorage.setItem(
          StorageKey,
          JSON.stringify(newDraftQuestion),
        );
        setDraftQuestion(newDraftQuestion);
        break;
      }
      case CreateQuestionHighlightCard.QUESTIONCARD:
      default:
        if (draftQuestion.questionCard.isCardComplete) {
          const newDraftQuestion = updateDQwithQuestionClick(draftQuestion);
          window.localStorage.setItem(
            StorageKey,
            JSON.stringify(newDraftQuestion),
          );
          setDraftQuestion(newDraftQuestion);
        }
        break;
    }
  };

  const handleBackToExplore = () => {
    setIsCCSSVisible(false);
  };

  const handleSaveQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      if (
        draftQuestion.questionCard.isCardComplete &&
        draftQuestion.correctCard.isCardComplete &&
        draftQuestion.incorrectCards.every((card: any) => card.isCardComplete)
      ) {
        if (
          draftQuestion.questionCard.image ||
          draftQuestion.questionCard.imageUrl
        ) {
          setIsCreatingTemplate(true);
          let result = null;
          let url = null;
          if (draftQuestion.questionCard.image) {
            const img = await apiClients.questionTemplate.storeImageInS3(
              draftQuestion.questionCard.image,
            );
            // have to do a nested await here because aws-storage returns a nested promise object
            result = await img.result;
            if (result && result.path && result.path.length > 0)
              url = result.path;
          } else if (draftQuestion.questionCard.imageUrl) {
            url = await apiClients.questionTemplate.storeImageUrlInS3(
              draftQuestion.questionCard.imageUrl,
            );
          }
          window.localStorage.setItem(StorageKey, '');
          console.log(draftQuestion.questionCard.imageUrl);
          if (url) {
            apiClients.questionTemplate.createQuestionTemplate(
              publicPrivate,
              url,
              draftQuestion,
            );
          }
          setIsCreatingTemplate(false);
          navigate('/questions');
        }
      } else {
        setIsCardErrored(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDiscard = () => {
    window.localStorage.setItem(StorageKey, '');
    navigate('/questions');
  };

  const handleSaveGame = async () => {
    // for now a boolean. Should become API call later
    setIsGameCardSubmitted(true);
    // setIsGameCardErrored -> turns placeholder text red
    // also well make error box appear in create game card
  }

  const handleGameImageUploadClick = () => {

  };

  const handleCreateQuestion = () => {
    if(openQuestionBank) {
      setOpenQuestionBank(false)
    }
    setCreateQuestion((prev) => !prev)
  }

  const handleOpenQuestionBank = () => {
if(createQuestion) {
  setCreateQuestion(false)
}
setOpenQuestionBank((prev) => !prev);
  }

  return (
    <CreateGameMainContainer sx={{ overflowY: 'auto'}}>
      <CreateGameBackground />
      <ModalBackground
        isModalOpen={isImageUploadVisible || isImageURLVisible || isCreatingTemplate || isCCSSVisible}
        handleCloseModal={handleCloseModal}
      />
      <CreatingTemplateModal
        isModalOpen={isCreatingTemplate}
        templateType={TemplateType.GAME}
      />
      <CreateGameBoxContainer>
     <CreateGameComponent
     screenSize={screenSize}
     handleSaveGame={handleSaveGame}
     handleDiscard={handleDiscard}
     handlePublicPrivateChange={handlePublicPrivateChange}
     handleImageUploadClick={handleGameImageUploadClick}
     onCreateQuestion={handleCreateQuestion}
     onOpenQuestionBank={handleOpenQuestionBank}
     isCardSubmitted={isGameCardSubmitted}
     questionCount={questionCount}
     isCardErrored={isCardErrored}
     highlightCard={highlightCard} />

{/* Create Question Form  */}
{createQuestion && (
      <QuestionElements
      screenSize={screenSize}
      draftQuestion={draftQuestion}
      onSetDraftQuestion={setDraftQuestion}
      onSetHighlightCard={setHighlightCard}
      handleDiscardQuestion={handleDiscard}
      handleSaveQuestion={handleSaveQuestion}
      isCardSubmitted={isCardSubmitted}
      isCardErrored={isCardErrored}
      highlightCard={highlightCard}
       />
)}

{/* Question Bank goes here */}
      </CreateGameBoxContainer>




    </CreateGameMainContainer>
  );
}
