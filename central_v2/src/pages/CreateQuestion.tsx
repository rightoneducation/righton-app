import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Switch,
  useTheme,
  styled,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useNavigate, useMatch } from 'react-router-dom';
import { debounce, set } from 'lodash';
import {
  PublicPrivateType,
  CentralQuestionTemplateInput,
  IncorrectCard,
  AnswerType,
  AnswerPrecision,
  CloudFrontDistributionUrl
} from '@righton/networking';
import useCreateQuestionLoader from '../loaders/useCreateQuestionLoader';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase';
import {
  CreateQuestionBackground,
  CreateQuestionGridContainer,
  CreateQuestionMainContainer,
  CreateQuestionBoxContainer,
} from '../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ScreenSize,
  BorderStyle,
  CreateQuestionHighlightCard,
  StorageKey,
  TemplateType,
  GameQuestionType,
  LibraryTabEnum,
} from '../lib/CentralModels';
import CentralButton from '../components/button/Button';
import CorrectAnswerCard from '../components/cards/createquestion/CorrectAnswerCard';
import { ButtonType } from '../components/button/ButtonModels';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import CCSSTabsModalBackground from '../components/ccsstabs/CCSSTabsModalBackground';
import IncorrectAnswerCardStack from '../components/cards/createquestion/stackedcards/IncorrectAnswerCardStack';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import DiscardModal from '../components/modal/DiscardModal';
import ModalBackground from '../components/modal/ModalBackground';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import {
  updateDQwithImage,
  updateDQwithImageURL,
  updateDQwithTitle,
  updateDQwithCCSS,
  updateDQwithQuestionClick,
  base64ToFile,
  fileToBase64,
} from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import {
  updateDQwithCorrectAnswer,
  updateDQwithCorrectAnswerSteps,
  updateDQwithCorrectAnswerClick,
  updateDQwithAnswerSettings,
} from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import {
  getNextHighlightCard,
  handleMoveAnswerToComplete,
  updateDQwithIncorrectAnswerClick,
  updateDQwithIncorrectAnswers,
  handleIncorrectCardClick,
} from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';
import CreatingTemplateModal from '../components/modal/SaveGameModal';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import { assembleQuestionTemplate } from '../lib/helperfunctions/createGame/CreateGameTemplateHelperFunctions';
import { AISwitch } from '../lib/styledcomponents/AISwitchStyledComponent';

type TitleTextProps = {
  screenSize: ScreenSize;
};

const TitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<TitleTextProps>(({ theme, screenSize }) => ({
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize:
    screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  color: `${theme.palette.primary.extraDarkBlue}`,
  paddingTop: `${theme.sizing.lgPadding}px`,
}));

const SubCardGridItem = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

interface CreateQuestionProps {
  screenSize: ScreenSize;
  fetchElement: (type: GameQuestionType, id: string) => void;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => void;
}

export default function CreateQuestion({
  screenSize,
  fetchElement,
  fetchElements,
}: CreateQuestionProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const route = useMatch('/clone/question/:type/:questionId');
  const editRoute = useMatch('/edit/question/:type/:questionId');
  const isClone =
    route?.params.questionId !== null &&
    route?.params.questionId !== undefined &&
    route?.params.questionId.length > 0;
  const isEdit =
    editRoute?.params.questionId !== null &&
    editRoute?.params.questionId !== undefined &&
    editRoute?.params.questionId.length > 0;
  const isDraft = 
    route?.params.type === 'Draft' ||
    editRoute?.params.type === 'Draft' ||
    (isClone && route?.params.type === 'Draft') ||
    (isEdit && editRoute?.params.type === 'Draft');
  const isPublic = 
    route?.params.type === 'Public' ||
    editRoute?.params.type === 'Public' ||
    (isClone && route?.params.type === 'Public') ||
    (isEdit && editRoute?.params.type === 'Public');
  const isEditDraft = 
    editRoute?.params.type === 'Draft';
  const [isCloneImageChanged, setIsCloneImageChanged] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageUploadVisible, setIsImageUploadVisible] =
    useState<boolean>(false);
  const [questionType, setQuestionType] = React.useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] =
    useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState<boolean>(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);
  const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [highlightCard, setHighlightCard] =
    useState<CreateQuestionHighlightCard>(
      CreateQuestionHighlightCard.QUESTIONCARD,
    );
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(
    (!isEdit || isPublic) ? PublicPrivateType.PUBLIC : PublicPrivateType.PRIVATE,
  );
  const [isMultipleChoice, setIsMultipleChoice] = useState<boolean>(true);
  const [originalImageURl, setOriginalImageURL] = useState<string>('');
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
            answerSettings: {
              answerType: AnswerType.NUMBER,
              answerPrecision: AnswerPrecision.WHOLE,
            },
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
  const [isCardErrored, setIsCardErrored] = useState<boolean>(false);
  const [isCorrectCardErrored, setIsCorrectCardErrored] = useState<boolean>(false);
  const [isDraftCardErrored, setIsDraftCardErrored] = useState<boolean>(false);
  const [isAIError, setIsAIError] = useState<boolean>(false);

  let label = 'Create';
  let selectedQuestionId = '';
  switch (true) {
    case isEdit:
      label = 'Edit';
      selectedQuestionId = editRoute?.params.questionId || '';
      break;
    case isClone:
      label = 'Clone';
      selectedQuestionId = route?.params.questionId || '';
      break;
    default:
      label = 'Create';
      break;
  }

  // QuestionCardBase handler functions
  const handleImageChange = async (inputImage?: File, inputUrl?: string) => {
    setIsCloneImageChanged(true);
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

  const handleAnswerType = () => {
    setIsMultipleChoice(!isMultipleChoice);
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

  // debounced question changes when writing to localStorage
  const handleDebouncedQuestionChange = useCallback( // eslint-disable-line
    debounce((draftQuestionInput: CentralQuestionTemplateInput) => {
      window.localStorage.setItem(
        StorageKey,
        JSON.stringify(draftQuestionInput),
      );
    }, 1000),
    [],
  );

  const handleTitleChange = (title: string) => {
    const { isFirstEdit } = draftQuestion.questionCard;
    const newDraftQuestion = updateDQwithTitle(draftQuestion, title);
    setDraftQuestion(newDraftQuestion);
    handleDebouncedQuestionChange(newDraftQuestion);
    if (isDraftCardErrored) setIsDraftCardErrored(false);
    if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
      setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
  };

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

  const handleCorrectAnswerChange = (
    correctAnswer: string,
    draftQuestionInput: CentralQuestionTemplateInput,
  ) => {
    const { isFirstEdit } = draftQuestionInput.correctCard;
    const newDraftQuestion = updateDQwithCorrectAnswer(
      draftQuestionInput,
      correctAnswer,
    );
    setDraftQuestion(newDraftQuestion);
    handleDebouncedQuestionChange(newDraftQuestion);
    if (newDraftQuestion.correctCard.isCardComplete){
      setIsCorrectCardErrored(false);
      if (isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
    } 
  };

  const handleCorrectAnswerStepsChange = (
    steps: string[],
    draftQuestionInput: CentralQuestionTemplateInput,
  ) => {
    const { isFirstEdit } = draftQuestionInput.correctCard;
    const newDraftQuestion = updateDQwithCorrectAnswerSteps(
      draftQuestionInput,
      steps,
    );
    setDraftQuestion(newDraftQuestion);
    handleDebouncedQuestionChange(newDraftQuestion);
    if (newDraftQuestion.correctCard.isCardComplete){
      setIsCorrectCardErrored(false);
      if (isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
    } 
  };

  const handleAnswerSettingsChange = (
    draftQuestionInput: CentralQuestionTemplateInput,
    answerType: AnswerType,
    answerPrecision?: AnswerPrecision,
  ) => {
    const { isFirstEdit } = draftQuestionInput.correctCard;
    const newDraftQuestion = updateDQwithAnswerSettings(
      draftQuestionInput,
      answerType,
      answerPrecision,
    );
    window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
    setDraftQuestion(newDraftQuestion);
    if (newDraftQuestion.correctCard.isCardComplete) {
      setIsCorrectCardErrored(false);
      if (isFirstEdit)
        setHighlightCard((prev) => CreateQuestionHighlightCard.INCORRECTANSWER1);
    }
  };
  
  // incorrect answer card functions
  const handleNextCardButtonClick = (cardData: IncorrectCard) => {
    if (isAIError) setIsAIError(false);
    const updatedAnswers = incompleteIncorrectAnswers.map((answer) => {
      if (answer.id === cardData.id) {
        return cardData;
      }
      return answer;
    });
    const { newIncompleteAnswers, newCompleteAnswers } =
      handleMoveAnswerToComplete(updatedAnswers, completeIncorrectAnswers);
    setIncompleteIncorrectAnswers(newIncompleteAnswers);
    setCompleteIncorrectAnswers(newCompleteAnswers);
  };

  const handleIncorrectCardStackUpdate = (
    cardData: IncorrectCard,
    draftQuestionInput: CentralQuestionTemplateInput,
    completeAnswers: IncorrectCard[],
    incompleteAnswers: IncorrectCard[],
    isAIEnabledCard?: boolean,
  ) => {
    const nextCard = getNextHighlightCard(
      cardData.id as CreateQuestionHighlightCard,
    );
    const isUpdateInIncompleteCards = incompleteAnswers.find(
      (answer) => answer.id === cardData.id,
    );
    let newDraftQuestion = null;
    const isCardComplete =
      cardData.answer.length > 0 && cardData.explanation.length > 0;
    // we need to break this up so we don't change the stateful arrays when a card is not being passed across them.
    // everytime we update those arrays, we're going to trigger an animation, so we have to only manipulate them when we want that
    // so in this case, if the card that is being edited is already complete, we are only going to update the draftQuestion object and leave the arrays alone
    if (isUpdateInIncompleteCards) {
      setIsAIError(false);
      const updatedAnswers = incompleteAnswers.map((answer) => {
        if (answer.id === cardData.id) {
          return cardData;
        }
        return answer;
      });
      if (isCardComplete && !isAIEnabledCard) {
        // adjust incomplete and complete arrays, moving completed card over
        const { newIncompleteAnswers, newCompleteAnswers } =
          handleMoveAnswerToComplete(updatedAnswers, completeAnswers);
        // adjust local state for the cards so that they animate properly through the stack
        setIncompleteIncorrectAnswers(newIncompleteAnswers);
        setCompleteIncorrectAnswers(newCompleteAnswers);
        newDraftQuestion = updateDQwithIncorrectAnswers(
          draftQuestionInput,
          newIncompleteAnswers,
          newCompleteAnswers,
        );

        if (cardData.isFirstEdit)
          setHighlightCard((prev) => nextCard as CreateQuestionHighlightCard);
      } else {
        newDraftQuestion = updateDQwithIncorrectAnswers(
          draftQuestionInput,
          updatedAnswers,
          completeAnswers,
        );
      }
    } else {
      const newCompleteAnswers = completeAnswers.map((answer) => {
        if (answer.id === cardData.id) {
          return cardData;
        }
        return answer;
      });
      setCompleteIncorrectAnswers(newCompleteAnswers);
      newDraftQuestion = updateDQwithIncorrectAnswers(
        draftQuestionInput,
        incompleteAnswers,
        newCompleteAnswers,
      );
    }

    // adjust draftQuestion and localstorage for use in API call and retrieval, respectively
    if (newDraftQuestion) {
      setDraftQuestion(newDraftQuestion);
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
    }
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

  const handleDiscardClick = (value: boolean) => {
    if (value) {
      setIsDiscardModalOpen(false);
      window.localStorage.setItem(StorageKey, '');
      navigate('/');
      return;
    }
    setIsDiscardModalOpen(false);
  };

  const handleCheckCardsCompleteOnSave = () => {
    if (
      draftQuestion.questionCard.ccss.length > 0 &&
      draftQuestion.questionCard.ccss !== 'CCSS' &&
      draftQuestion.questionCard.title.length > 0 &&
      ((draftQuestion.questionCard.imageUrl &&
        draftQuestion.questionCard.imageUrl?.length > 0) ||
        draftQuestion.questionCard.image) &&
      draftQuestion.correctCard.answer.length > 0 &&
      draftQuestion.correctCard.answerSteps.length > 0 &&
      draftQuestion.correctCard.answerSteps.every((step) => step.length > 0) &&
      draftQuestion.incorrectCards.length > 0 &&
      draftQuestion.incorrectCards.every(
        (card) => card.answer.length > 0 && card.explanation.length > 0,
      )
    )
      return true;
    return false;
  };
  const handleSaveEditedQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      const isQuestionTemplateComplete = handleCheckCardsCompleteOnSave();
      if (isQuestionTemplateComplete) {
        if (
          draftQuestion.questionCard.image ||
          draftQuestion.questionCard.imageUrl
        ) {
          setIsUpdatingTemplate(true);
          let result = null;
          let url = null;
          // if the question is a clone/edit and the image hasn't been changed, we can use the original imageUrl
          if (
            (!isClone && !isEdit) ||
            draftQuestion.questionCard.imageUrl !== originalImageURl
          ) {
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
          } else {
            url = draftQuestion.questionCard.imageUrl;
          }
          window.localStorage.setItem(StorageKey, '');
          if (url) {
            if (isMultipleChoice)
              draftQuestion.correctCard.answerSettings.answerType =
                AnswerType.MULTICHOICE;
            const qtResult = await apiClients.questionTemplate.updateQuestionTemplate(
              publicPrivate,
              url,
              centralData.userProfile?.id || '',
              draftQuestion,
              selectedQuestionId,
            );
            if (qtResult && selectedQuestionId && isDraft){
              // if the user is saving out their draft, create a public/private question template
              // and delete the draft question template
              await apiClients.questionTemplate.deleteQuestionTemplate(
                PublicPrivateType.DRAFT,
                selectedQuestionId
              );
            }
          }
          setIsUpdatingTemplate(false);
          fetchElements();
          centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
          navigate('/questions');
        }
      } else {
        setIsCardErrored(true);
        if (!draftQuestion.correctCard.isCardComplete) {
          setIsCorrectCardErrored(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      const isQuestionTemplateComplete = handleCheckCardsCompleteOnSave();
      if (isQuestionTemplateComplete) {
        if (
          draftQuestion.questionCard.image ||
          draftQuestion.questionCard.imageUrl
        ) {
          setIsCreatingTemplate(true);
          let result = null;
          let url = null;
          // if the question is a clone and the image hasn't been changed, we can use the original imageUrl
          if (
            !isClone ||
            draftQuestion.questionCard.imageUrl !== originalImageURl
          ) {
            if (draftQuestion.questionCard.image) {
              const img = await apiClients.questionTemplate.storeImageInS3(
                draftQuestion.questionCard.image,
              );
              // have to do a nested await here because aws-storage returns a nested promise object
              result = await img.result;
              if (result && result.path && result.path.length > 0)
                url = result.path;
            } else if (draftQuestion.questionCard.imageUrl) {
              // check if imageUrl is valid http(s) or if we need to add cloudfrontdistributionurl
              if (
                draftQuestion.questionCard.imageUrl.startsWith('https://') ||
                draftQuestion.questionCard.imageUrl.startsWith('http://')
              ) {
                url = draftQuestion.questionCard.imageUrl;
              } else {
                // if it doesn't start with https or http, we need to add the CloudFrontDistributionUrl
                draftQuestion.questionCard.imageUrl = `${CloudFrontDistributionUrl}${draftQuestion.questionCard.imageUrl}`;
              }
              url = await apiClients.questionTemplate.storeImageUrlInS3(
                draftQuestion.questionCard.imageUrl,
              );
            }
          } else {
            url = draftQuestion.questionCard.imageUrl;
          }
          window.localStorage.setItem(StorageKey, '');
          if (url) {
            if (isMultipleChoice)
              draftQuestion.correctCard.answerSettings.answerType =
                AnswerType.MULTICHOICE;
              await apiClients.questionTemplate.createQuestionTemplate(
              publicPrivate,
              url,
              centralData.userProfile?.id || '',
              draftQuestion,
            );
          }
          // update user stats
          const existingNumQuestions =
            centralData.userProfile?.questionsMade || 0;
          const newNumQuestions = existingNumQuestions + 1;
          await apiClients.user.updateUser({
            id: centralData.userProfile?.id || '',
            questionsMade: newNumQuestions,
          });

          setIsCreatingTemplate(false);
          fetchElements();
          centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
          navigate('/questions');
        }
      } else {
        setIsCardErrored(true);
        if (!draftQuestion.correctCard.isCardComplete) {
          setIsCorrectCardErrored(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateFromDraftQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      const isQuestionTemplateComplete = handleCheckCardsCompleteOnSave();
      if (isQuestionTemplateComplete) {
        if (
          draftQuestion.questionCard.image ||
          draftQuestion.questionCard.imageUrl
        ) {
          setIsCreatingTemplate(true);
          let result = null;
          let url = null;
          // new image always needs to be created
          if (draftQuestion.questionCard.image) {
            const img = await apiClients.questionTemplate.storeImageInS3(
              draftQuestion.questionCard.image,
            );
            // have to do a nested await here because aws-storage returns a nested promise object
            result = await img.result;
            if (result && result.path && result.path.length > 0)
              url = result.path;
          } else if (draftQuestion.questionCard.imageUrl) {
            // check if imageUrl is valid http(s) or if we need to add cloudfrontdistributionurl
            if (
              draftQuestion.questionCard.imageUrl.startsWith('https://') ||
              draftQuestion.questionCard.imageUrl.startsWith('http://')
            ) {
              url = draftQuestion.questionCard.imageUrl;
            } else {
              // if it doesn't start with https or http, we need to add the CloudFrontDistributionUrl
              draftQuestion.questionCard.imageUrl = `${CloudFrontDistributionUrl}${draftQuestion.questionCard.imageUrl}`;
            }
            url = await apiClients.questionTemplate.storeImageUrlInS3(
              draftQuestion.questionCard.imageUrl,
            );
          }
          window.localStorage.setItem(StorageKey, '');
          if (url) {
            if (isMultipleChoice)
              draftQuestion.correctCard.answerSettings.answerType =
                AnswerType.MULTICHOICE;
            const qtResult = await apiClients.questionTemplate.createQuestionTemplate(
              publicPrivate,
              url,
              centralData.userProfile?.id || '',
              draftQuestion,
            );
            if (qtResult && selectedQuestionId){
              // if the user is saving out their draft, create a public/private question template
              // and delete the draft question template
              await apiClients.questionTemplate.deleteQuestionTemplate(
                PublicPrivateType.DRAFT,
                selectedQuestionId
              );
            }
          }
          // update user stats
          const existingNumQuestions =
            centralData.userProfile?.questionsMade || 0;
          const newNumQuestions = existingNumQuestions + 1;
          await apiClients.user.updateUser({
            id: centralData.userProfile?.id || '',
            questionsMade: newNumQuestions,
          });

          setIsCreatingTemplate(false);
          fetchElements();
          navigate('/questions');
        }
      } else {
        setIsCardErrored(true);
        if (!draftQuestion.correctCard.isCardComplete) {
          setIsCorrectCardErrored(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSave = async () => {
    // case 1, saving a draft into a public/private question template
    if (isDraft) {
      handleCreateFromDraftQuestion();
      return;
    }
    // case 2, saving a public/private question template that already exists
    if (isEdit) {
      const originalType = (
        isPublic ? PublicPrivateType.PUBLIC : PublicPrivateType.PRIVATE
      );
      if (publicPrivate === originalType){
        handleSaveEditedQuestion();
        return;
      }
      try {
        handleSaveQuestion();
        await apiClients.questionTemplate.deleteQuestionTemplate(
          originalType,
          selectedQuestionId,
        );
        fetchElements(LibraryTabEnum.PUBLIC, '', null , true);
        fetchElements(LibraryTabEnum.PRIVATE, '', null , true);
      return;
      } catch (err) {
        console.log(err);
      }
    }
    // case 3, creating a new public/private question template
    handleSaveQuestion();
  };

  const handleSaveDraftQuestion = async () => {
    try {
      if (draftQuestion.questionCard.title && draftQuestion.questionCard.title.length > 0) {
        setIsCardSubmitted(true);
        setIsCreatingTemplate(true);
        let result = null;
        let url = ''; 
        if (
          draftQuestion.questionCard.imageUrl !== originalImageURl
        ) {
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
        } else {
          url = draftQuestion.questionCard.imageUrl;
        }
        window.localStorage.setItem(StorageKey, '');
        await apiClients.questionTemplate.createQuestionTemplate(
          PublicPrivateType.DRAFT,
          url,
          centralData.userProfile?.id || '',
          draftQuestion,
        );
        setIsCreatingTemplate(false);
        fetchElements();
        navigate('/questions');
      } else {
        setIsDraftCardErrored(true);
      }
    } catch (e) {
      console.log(e);
    }
  };


  const handleSaveEditedDraftQuestion = async () => {
    console.log(draftQuestion);
    try {
      if (draftQuestion.questionCard.title && draftQuestion.questionCard.title.length > 0) {
        setIsCardSubmitted(true);
        setIsUpdatingTemplate(true);
        let result = null;
        let url = ''; 
        if (
          draftQuestion.questionCard.imageUrl !== originalImageURl
        ) {
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
        } else {
          url = draftQuestion.questionCard.imageUrl;
        }
        window.localStorage.setItem(StorageKey, '');
        await apiClients.questionTemplate.updateQuestionTemplate(
            PublicPrivateType.DRAFT,
            url,
            centralData.userProfile?.id || '',
            draftQuestion,
            selectedQuestionId,
          );
        setIsUpdatingTemplate(false);
        fetchElements();
        navigate('/questions');
      } else {
        setIsDraftCardErrored(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveDraft = () => {
    // case 1, saving a draft that already exists
    if (isEditDraft) {
      handleSaveEditedDraftQuestion();
      return;
    }
    // case 2, creating a new draft question template
    handleSaveDraftQuestion();
  };

  const handleDiscardQuestion = () => {
    setIsDiscardModalOpen(true);
  };

  const handleAIError = () => {
    setIsAIError(true);
  };

  const handleAIIsEnabled = () => {
    setIsAIEnabled((prev) => !prev);
    setIsAIError(false);
  };

  const handleCloseQuestionModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    setIsCCSSVisible(false);
    setIsDiscardModalOpen(false);
    setIsCreatingTemplate(false);
  };

  useEffect(() => {
    setIsLoading(false);
    const selected = centralData?.selectedQuestion?.question;
    const title = selected?.title;
    if (selected && (isClone || isEdit)) {
      // regex to detect (clone of) in title
      const regex = /\(Clone of\)/i;
      if (title && !regex.test(title) && isClone)
        selected.title = `(Clone of) ${title}`;
      const draft = assembleQuestionTemplate(selected);
      setDraftQuestion((prev) => ({
        ...prev,
        ...draft,
      }));
      setOriginalImageURL(selected.imageUrl ?? '');
      setCompleteIncorrectAnswers(
        draft.incorrectCards.filter((card) => card.isCardComplete),
      );
      setIncompleteIncorrectAnswers(
        draft.incorrectCards.filter((card) => !card.isCardComplete),
      );
    }
    if (
      !centralData.selectedQuestion?.question &&
      selectedQuestionId &&
      (isClone || isEdit)
    ) {
      setIsLoading(true);
      fetchElement(GameQuestionType.QUESTION, selectedQuestionId);
    }
  }, [centralData.selectedQuestion, route, selectedQuestionId]); // eslint-disable-line

  
  return (
    <CreateQuestionMainContainer>
      <CreateQuestionBackground />
      <ModalBackground
        isModalOpen={
          isCCSSVisible ||
          isDiscardModalOpen ||
          isImageUploadVisible ||
          isCreatingTemplate || 
          isUpdatingTemplate
        }
        handleCloseModal={handleCloseQuestionModal}
      />
      <CCSSTabs
        screenSize={screenSize}
        isTabsOpen={isCCSSVisible}
        handleCCSSSubmit={handleCCSSSubmit}
      />
      <DiscardModal
        isModalOpen={isDiscardModalOpen}
        screenSize={screenSize}
        handleDiscardClick={handleDiscardClick}
      />
      <ImageUploadModal
        draftQuestion={draftQuestion}
        isClone={isClone}
        isCloneImageChanged={isCloneImageChanged}
        screenSize={screenSize}
        isModalOpen={isImageUploadVisible}
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseModal}
      />
      <CreatingTemplateModal
        isModalOpen={isCreatingTemplate || isUpdatingTemplate}
        templateType={TemplateType.QUESTION}
      />
      <CreateQuestionBoxContainer>
        <TitleText screenSize={ScreenSize.LARGE}>{label} Question</TitleText>
        {isLoading ? (
          <CircularProgress
            style={{ color: `${theme.palette.primary.circularProgress}` }}
          />
        ) : (
          <>
            {screenSize === ScreenSize.MEDIUM && (
              <Box
                style={{
                  width: 'fit-content',
                  display: 'flex',

                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: `${theme.sizing.xSmPadding}px`,
                  paddingBottom: '16px',
                }}
              >
                <CentralButton
                  buttonType={ButtonType.SAVE}
                  isEnabled
                  smallScreenOverride
                  onClick={handleSave}
                />
                {!isClone && (!isEdit || isDraft) &&  (
                  <CentralButton
                    buttonType={ButtonType.SAVEDRAFT}
                    isEnabled
                    smallScreenOverride
                    onClick={handleSaveDraft}
                  />
                )}
                <CentralButton
                  buttonType={ButtonType.DISCARDBLUE}
                  isEnabled
                  smallScreenOverride
                  onClick={handleDiscardQuestion}
                />
              </Box>
            )}
            {screenSize === ScreenSize.SMALL && (
              <Box
                style={{
                  width: '100%',
                  maxWidth: '672px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: `${theme.sizing.xSmPadding}px`,
                  paddingBottom: '16px',
                }}
              >
                <CentralButton
                  buttonType={ButtonType.SAVE}
                  buttonWidthOverride="275px"
                  isEnabled
                  smallScreenOverride
                  onClick={handleSave}
                />
                {!isClone && (!isEdit || isDraft) &&  (
                  <CentralButton
                    buttonType={ButtonType.SAVEDRAFT}
                    buttonWidthOverride="275px"
                    isEnabled
                    smallScreenOverride
                    onClick={handleSaveDraft}
                  />
                )}
                <CentralButton
                  buttonType={ButtonType.DISCARDBLUE}
                  buttonWidthOverride="275px"
                  isEnabled
                  smallScreenOverride
                  onClick={handleDiscardQuestion}
                />
              </Box>
            )}
            <CreateQuestionGridContainer container wrap="nowrap">
              <Grid
                sm
                md={1}
                lg={4}
                item
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  paddingTop: '16px',
                  gap: '20px',
                }}
              >
                {screenSize !== ScreenSize.SMALL &&
                  screenSize !== ScreenSize.MEDIUM && (
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-Start',
                        alignItems: 'center',
                        gap: `${theme.sizing.xSmPadding}px`,
                        paddingRight: '30px',
                      }}
                    >
                      <CentralButton
                        buttonType={ButtonType.SAVE}
                        isEnabled
                        onClick={handleSave}
                      />
                      {!isClone && (!isEdit || isDraft) && (
                        <CentralButton
                          buttonType={ButtonType.SAVEDRAFT}
                          isEnabled
                          smallScreenOverride
                          onClick={handleSaveDraft}
                        />
                      )}
                      <CentralButton
                        buttonType={ButtonType.DISCARDBLUE}
                        isEnabled
                        onClick={handleDiscardQuestion}
                      />
                    </Box>
                  )}
              </Grid>
              <Grid
                sm={12}
                md={10}
                lg={4}
                item
                style={{
                  width: '100%',
                  maxWidth: '672px',
                  minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${theme.sizing.xLgPadding}px`,
                }}
              >
                <Box
                  onClickCapture={() =>
                    handleClick(CreateQuestionHighlightCard.QUESTIONCARD)
                  }
                  style={{ width: '100%' }}
                >
                  <CreateQuestionCardBase
                    screenSize={screenSize}
                    isClone={isClone}
                    isEdit={isEdit}
                    isCloneImageChanged={isCloneImageChanged}
                    label={label}
                    draftQuestion={draftQuestion}
                    handleTitleChange={handleTitleChange}
                    handleCCSSClick={handleCCSSClick}
                    isHighlight={
                      highlightCard === CreateQuestionHighlightCard.QUESTIONCARD
                    }
                    handleImageUploadClick={handleImageUploadClick}
                    handlePublicPrivateChange={handlePublicPrivateChange}
                    isCardSubmitted={isCardSubmitted}
                    isDraftCardErrored={isDraftCardErrored}
                    isCardErrored={isCardErrored}
                    isAIError={isAIError}
                    isPublic={publicPrivate === PublicPrivateType.PUBLIC}
                    isMultipleChoice={isMultipleChoice}
                    handleAnswerType={handleAnswerType}
                  />
                </Box>
                <Grid container spacing={`${theme.sizing.smPadding}px`}>
                  <SubCardGridItem item sm={12} md={6}>
                    <Box
                      onClickCapture={() =>
                        handleClick(CreateQuestionHighlightCard.CORRECTANSWER)
                      }
                      style={{ width: '100%' }}
                    >
                      <CorrectAnswerCard
                        screenSize={screenSize}
                        isClone={isClone}
                        draftQuestion={draftQuestion}
                        isHighlight={
                          highlightCard ===
                          CreateQuestionHighlightCard.CORRECTANSWER
                        }
                        handleCorrectAnswerChange={handleCorrectAnswerChange}
                        handleCorrectAnswerStepsChange={
                          handleCorrectAnswerStepsChange
                        }
                        handleAnswerSettingsChange={handleAnswerSettingsChange}
                        isCardSubmitted={isCardSubmitted}
                        isCardErrored={isCorrectCardErrored}
                        isAIError={isAIError}
                      />
                    </Box>
                  </SubCardGridItem>
                  <SubCardGridItem item sm={12} md={6}>
                    <Box
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        style={{ textAlign: 'right', fontWeight: 500 }}
                      >
                        Try our AI-Powered Wrong Answer Explanation Generator
                      </Typography>
                      <AISwitch
                        checked={isAIEnabled}
                        onChange={(prev) => handleAIIsEnabled()}
                      />
                    </Box>
                    <IncorrectAnswerCardStack
                      draftQuestion={draftQuestion}
                      isClone={isClone}
                      completeIncorrectAnswers={completeIncorrectAnswers}
                      incompleteIncorrectAnswers={incompleteIncorrectAnswers}
                      highlightCard={highlightCard}
                      handleNextCardButtonClick={handleNextCardButtonClick}
                      handleIncorrectCardStackUpdate={
                        handleIncorrectCardStackUpdate
                      }
                      handleCardClick={handleClick}
                      handleAIError={handleAIError}
                      isCardSubmitted={isCardSubmitted}
                      isAIEnabled={isAIEnabled}
                      isAIError={isAIError}
                    />
                  </SubCardGridItem>
                </Grid>
              </Grid>
              <Grid sm md={1} lg={4} item />
            </CreateQuestionGridContainer>
          </>
        )}
      </CreateQuestionBoxContainer>
    </CreateQuestionMainContainer>
  );
}