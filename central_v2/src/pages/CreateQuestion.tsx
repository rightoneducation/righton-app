import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Typography,
  Box,
  useTheme,
  styled,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useMatch } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  PublicPrivateType,
  TemplateType,
  CentralQuestionTemplateInput,
  AnswerType,
  AnswerPrecision,
  CloudFrontDistributionUrl
} from '@righton/networking';
import useCreateQuestionLoader from '../loaders/useCreateQuestionLoader';
import CreateQuestionCardBase from '../components/cards/createquestion/CreateQuestionCardBase';
import {
  CreateQuestionBackground,
  CreateQuestionMainContainer,
  CreateQuestionBoxContainer,
} from '../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ScreenSize,
  StorageKey,
  GameQuestionType,
  LibraryTabEnum,
  ModalStateType,
  ModalObject,
  ConfirmStateType,
} from '../lib/CentralModels';
import CreateQuestionHeader from '../components/question/CreateQuestionHeader';
import CreateQuestionModalSwitch from '../components/modal/switches/CreateQuestionModalSwitch';
import CorrectAnswerCard from '../components/cards/createquestion/CorrectAnswerCard';
import IncorrectAnswerCard from '../components/cards/createquestion/IncorrectAnswerCard';
import CCSSTabs from '../components/ccsstabs/CCSSTabs';
import ImageUploadModal from '../components/modal/ImageUploadModal';
import DiscardModal from '../components/modal/DiscardModal';
import ModalBackground from '../components/modal/ModalBackground';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import {
  updateDQwithImage,
  updateDQwithImageURL,
} from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import {
  updateDQwithAnswerSettings,
} from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import CreatingTemplateModal from '../components/modal/SaveGameModal';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import { assembleQuestionTemplate } from '../lib/helperfunctions/createGame/CreateGameTemplateHelperFunctions';
import { handleCheckQuestionBaseComplete, handleCheckQuestionCorrectCardComplete, handleCheckQuestionIncorrectCardsComplete } from '../lib/helperfunctions/createGame/CreateQuestionsListHelpers';
import { AISwitch } from '../lib/styledcomponents/AISwitchStyledComponent';
import { DraftAssetHandler } from '../lib/services/DraftAssetHandler';

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

type AIErrorArray = [boolean, boolean, boolean];

type BodyContainerProps = {
  screenSize: ScreenSize;
};

const BodyContainer = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'screenSize',
})<BodyContainerProps>(({ screenSize: size }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: size !== ScreenSize.LARGE ? 'column' : 'row',
  gap: size !== ScreenSize.LARGE ? '20px' : '16px',
}));

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
  const draftAssetHandler = new DraftAssetHandler();
  const route = useMatch('/clone/question/:type/:questionId');
  const editRoute = useMatch('/edit/question/:type/:questionId');
  const createRoute = useMatch('/create/question');
  const isCreate = createRoute !== null;
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
  const [initPublicPrivate, setInitPublicPrivate] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] =
    useState<boolean>(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState<boolean>(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);
  const [modalObject, setModalObject] = useState<ModalObject>({
    modalState: ModalStateType.NULL,
    confirmState: ConfirmStateType.NULL,
  });
  const [isCCSSVisibleModal, setIsCCSSVisibleModal] = useState<boolean>(false);
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(
    (!isEdit || isPublic) ? PublicPrivateType.PUBLIC : PublicPrivateType.PRIVATE,
  );
  const [originalImageURl, setOriginalImageURL] = useState<string>('');
  const localData = useCreateQuestionLoader();

  const [isAISwitchEnabled, setIsAISwitchEnabled] = useState(false);
  const [isAIError, setIsAIError] = useState<AIErrorArray>([false, false, false]);

  const handleSwitchChange = (value: boolean) => {
    setIsAISwitchEnabled(value);
    setIsAIError([false, false, false]);
  }

  
  const [draftQuestion, setDraftQuestion] =
    useState<CentralQuestionTemplateInput>(() => {
      return (
        localData.draftQuestion ?? {
          publicPrivateType: PublicPrivateType.PUBLIC,
          questionCard: {
            title: '',
            ccss: 'CCSS',
            isFirstEdit: true,
            isCardComplete: false,
          },
          correctCard: {
            answer: '',
            answerSteps: ['', ''],
            isMultipleChoice: true,
            answerSettings: {
              answerType: AnswerType.MULTICHOICE,
              answerPrecision: AnswerPrecision.WHOLE,
            },
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
        }
      );
    });
  const [isCardSubmitted, setIsCardSubmitted] = useState<boolean>(false);
  const [isDraftCardErrored, setIsDraftCardErrored] = useState<boolean>(false);
  const [isBaseCardErrored, setIsBaseCardErrored] = useState(!handleCheckQuestionBaseComplete(draftQuestion));
  const [isCorrectCardErrored, setIsCorrectCardErrored] = useState(!handleCheckQuestionCorrectCardComplete(draftQuestion));
  const [isIncorrectCardErrored, setIsIncorrectCardErrored] = useState(!handleCheckQuestionIncorrectCardsComplete(draftQuestion));
  const handleDebouncedCheckQuestionBaseComplete = useMemo(
    () => debounce((debounceQuestion: CentralQuestionTemplateInput) => {
      setIsBaseCardErrored(!handleCheckQuestionBaseComplete(debounceQuestion));
    }, 1000),
    []
  );
  const handleDebouncedCheckQuestionCorrectCardComplete = useMemo(
    () => debounce((debounceQuestion: CentralQuestionTemplateInput) => {
      setIsCorrectCardErrored(!handleCheckQuestionCorrectCardComplete(debounceQuestion));
    }, 1000),
    []
  );
  const handleDebouncedCheckQuestionIncorrectCardsComplete = useMemo(
    () => debounce((debounceQuestion: CentralQuestionTemplateInput) => {
      setIsIncorrectCardErrored(!handleCheckQuestionIncorrectCardsComplete(debounceQuestion));
    }, 1000),
    []
  );


  const handleDebouncedCheckAIFieldsComplete = useMemo(
    () =>
      debounce(
        (debounceQuestion: CentralQuestionTemplateInput, currentErrors: AIErrorArray) => {
          const hasRequiredFields =
            Boolean(debounceQuestion.questionCard.title) &&
            Boolean(debounceQuestion.correctCard.answer);

          if (!hasRequiredFields) return;

          const nextErrors = currentErrors.map((hasError, index) => {
            if (!hasError) return hasError;
            const card = debounceQuestion.incorrectCards[index];
            return card?.answer ? false : hasError;
          }) as AIErrorArray;

          const hasChanged = nextErrors.some(
            (value, index) => value !== currentErrors[index],
          );

          if (hasChanged) {
            setIsAIError(nextErrors);
          }
        },
        1000,
      ),
    [],
  );

  let label = 'Your';
  let selectedQuestionId = '';
  switch (true) {
    case isEdit:
      label = 'Edit';
      selectedQuestionId = editRoute?.params.questionId || '';
      break;
    case isClone:
      label = 'Edit';
      selectedQuestionId = route?.params.questionId || '';
      break;
    case isCreate:
      label = 'Create';
      break;
    default:
      label = 'Your';
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
    setDraftQuestion((prev) => {
      const newDraftQuestion = {
        ...prev,
        correctCard: { 
          ...prev.correctCard, 
          isMultipleChoice: !prev.correctCard.isMultipleChoice,
          answerSettings: {
            ...prev.correctCard.answerSettings,
            answerType: !prev.correctCard.isMultipleChoice ? AnswerType.MULTICHOICE : prev.correctCard.answerSettings.answerType,
          },
        },
      };
      handleDebouncedCheckQuestionBaseComplete(newDraftQuestion);
      return newDraftQuestion;
    });
  }
  const handleImageSave = async (inputImage?: File, inputUrl?: string) => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    if (inputImage) {
      const { isFirstEdit } = draftQuestion.questionCard;
      let newDraftQuestion = updateDQwithImage(
        draftQuestion,
        undefined,
        inputImage,
      );
      // Update isCardComplete based on the new state
      newDraftQuestion = {
        ...newDraftQuestion,
        questionCard: {
          ...newDraftQuestion.questionCard,
          isCardComplete: handleCheckQuestionBaseComplete(newDraftQuestion),
        },
      };
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      handleDebouncedCheckQuestionBaseComplete(newDraftQuestion);
    }
    if (inputUrl) {
      const { isFirstEdit } = draftQuestion.questionCard;
      let newDraftQuestion = updateDQwithImageURL(draftQuestion, inputUrl);
      // Update isCardComplete based on the new state
      newDraftQuestion = {
        ...newDraftQuestion,
        questionCard: {
          ...newDraftQuestion.questionCard,
          isCardComplete: handleCheckQuestionBaseComplete(newDraftQuestion),
        },
      };
      window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
      setDraftQuestion(newDraftQuestion);
      handleDebouncedCheckQuestionBaseComplete(newDraftQuestion);
    }
  };

  const handleTitleChange = (title: string) => {
    setDraftQuestion((prev) => {
      const newDraftQuestion = {
        ...prev,
        questionCard: { 
          ...prev.questionCard, 
          title,
          isCardComplete: handleCheckQuestionBaseComplete({
            ...prev,
            questionCard: { ...prev.questionCard, title },
          }),
        },
      };
      if (isAIError.some(Boolean))
        handleDebouncedCheckAIFieldsComplete(newDraftQuestion, isAIError);
      handleDebouncedCheckQuestionBaseComplete(newDraftQuestion);
      return newDraftQuestion;
    });
  }

  const handleCCSSSubmit = (ccss: string) => {
    setDraftQuestion((prev) => {
      const newDraftQuestion = {
        ...prev,
        questionCard: { 
          ...prev.questionCard, 
          ccss,
          isCardComplete: handleCheckQuestionBaseComplete({
            ...prev,
            questionCard: { ...prev.questionCard, ccss },
          }),
        },
      };
      handleDebouncedCheckQuestionBaseComplete(newDraftQuestion);
      return newDraftQuestion;
    });
    setIsCCSSVisibleModal(false);
  }

  const handleCCSSClick = () => {
    setIsCCSSVisibleModal((prev) => !prev);
  };

  const handleImageUploadClick = () => {
    setIsImageUploadVisible(true);
  };

  const handlePublicPrivateChange = (value: PublicPrivateType) => {
    setPublicPrivate(value);
    setDraftQuestion((prev) => {
      const newDraftQuestion = {
        ...prev,
        publicPrivateType: value,
      };
      handleDebouncedCheckQuestionBaseComplete(newDraftQuestion);
      return newDraftQuestion;
    });
  };

  const handleCloseModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    setIsCreatingTemplate(false);
    setIsCCSSVisibleModal(false);
  };

  const handleCorrectAnswerChange = (correctAnswer: string) => {
    setDraftQuestion((prev) => {
      const newDraftQuestion = {
        ...prev,
        correctCard: { 
          ...prev.correctCard, 
          answer: correctAnswer,
          isCardComplete: handleCheckQuestionCorrectCardComplete({
            ...prev,
            correctCard: { ...prev.correctCard, answer: correctAnswer },
          }),
        },
      };
      if (isAIError.some(Boolean))
        handleDebouncedCheckAIFieldsComplete(newDraftQuestion, isAIError);
      handleDebouncedCheckQuestionCorrectCardComplete(newDraftQuestion);
      return newDraftQuestion;
    });
  }

  const handleCorrectAnswerStepsChange = (correctAnswerSteps: string[]) => {
    setDraftQuestion((prev) => {
      const newDraftQuestion = {
        ...prev,
        correctCard: { 
          ...prev.correctCard, 
          answerSteps: correctAnswerSteps,
          isCardComplete: handleCheckQuestionCorrectCardComplete({
            ...prev,
            correctCard: { ...prev.correctCard, answerSteps: correctAnswerSteps },
          }),
        },
      };
      handleDebouncedCheckQuestionCorrectCardComplete(newDraftQuestion);
      return newDraftQuestion;
    });
  }

  const handleIncorrectAnswerChange = (incorrectAnswer: string, index: number) => {
    setDraftQuestion((prev) => {
      const updatedCards = prev.incorrectCards.map((card, i) => {
        if (i === index) {
          const updatedCard = { ...card, answer: incorrectAnswer };
          // Check if this specific card is complete
          const isComplete = updatedCard.answer.trim().length > 0 && updatedCard.explanation.trim().length > 0;
          return { ...updatedCard, isCardComplete: isComplete };
        }
        return card;
      });
      const newDraftQuestion = {
        ...prev,
        incorrectCards: updatedCards,
      };
      if (isAIError.some(Boolean))
        handleDebouncedCheckAIFieldsComplete(newDraftQuestion, isAIError);
      handleDebouncedCheckQuestionIncorrectCardsComplete(newDraftQuestion);
      return newDraftQuestion;
    });
  }

  const handleIncorrectExplanationChange = (incorrectExplanation: string, index: number) => {
    if (incorrectExplanation === 'ERROR') {
      const nextErrors = [...isAIError] as AIErrorArray;
      nextErrors[index as 0 | 1 | 2] = true;
      setIsAIError(nextErrors);
      return;
    }
    setDraftQuestion((prev) => {
      const updatedCards = prev.incorrectCards.map((card, i) => {
        if (i === index) {
          const updatedCard = { ...card, explanation: incorrectExplanation };
          // Check if this specific card is complete
          const isComplete = updatedCard.answer.trim().length > 0 && updatedCard.explanation.trim().length > 0;
          return { ...updatedCard, isCardComplete: isComplete };
        }
        return card;
      });
      const newDraftQuestion = {
        ...prev,
        incorrectCards: updatedCards,
      };
      handleDebouncedCheckQuestionIncorrectCardsComplete(newDraftQuestion);
      return newDraftQuestion;
    });
  }

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
    }
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

  const handleSaveEditedQuestion = async () => {
    setModalObject({
      modalState: ModalStateType.SAVING,
      confirmState: ConfirmStateType.UPDATED,
    });
    try {
      setIsCardSubmitted(true);
      const isQuestionTemplateComplete = handleCheckQuestionBaseComplete(draftQuestion) && handleCheckQuestionCorrectCardComplete(draftQuestion) && handleCheckQuestionIncorrectCardsComplete(draftQuestion);
      if (isQuestionTemplateComplete) {
        let result = null;
        let url = null;
        if (
          draftQuestion.questionCard.image ||
          draftQuestion.questionCard.imageUrl
        ) {
          setIsUpdatingTemplate(true);
          
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
        }
          window.localStorage.setItem(StorageKey, '');
          
          // TODO: add support for other answer types
          if (draftQuestion.correctCard.isMultipleChoice)
            draftQuestion.correctCard.answerSettings.answerType =
              AnswerType.MULTICHOICE;
          else 
            draftQuestion.correctCard.answerSettings.answerType =
              AnswerType.STRING;
          const qtResult = await apiClients.questionTemplate.updateQuestionTemplate(
            publicPrivate as TemplateType,
            url || '',
            centralData.userProfile?.id || '',
            draftQuestion,
            selectedQuestionId,
          );
          if (qtResult?.publicPrivateType !== initPublicPrivate) {
            await apiClients.questionTemplate.deleteQuestionTemplate(
              initPublicPrivate as TemplateType,
              selectedQuestionId
            );
          }
          setModalObject({
            modalState: ModalStateType.CONFIRM,
            confirmState: ConfirmStateType.UPDATED,
          });
      } else {
        if (!draftQuestion.correctCard.isCardComplete) {
          setIsCorrectCardErrored(true);
        }
        if (!draftQuestion.incorrectCards.every((card) => card.isCardComplete)) {
          setIsIncorrectCardErrored(true);
        }
        if (!draftQuestion.questionCard.isCardComplete) {
          setIsBaseCardErrored(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      const isQuestionTemplateComplete = handleCheckQuestionBaseComplete(draftQuestion) && handleCheckQuestionCorrectCardComplete(draftQuestion) && handleCheckQuestionIncorrectCardsComplete(draftQuestion);
      if (isQuestionTemplateComplete) {
        let result = null;
        let url = null;
        if (
          draftQuestion.questionCard.image ||
          draftQuestion.questionCard.imageUrl
        ) {
          setIsCreatingTemplate(true);
        
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
              let imageUrlToStore = draftQuestion.questionCard.imageUrl;
              if (
                !imageUrlToStore.startsWith('https://') &&
                !imageUrlToStore.startsWith('http://')
              ) {
                // if it doesn't start with https or http, we need to add the CloudFrontDistributionUrl
                imageUrlToStore = `${CloudFrontDistributionUrl}${imageUrlToStore}`;
              }
              url = await apiClients.questionTemplate.storeImageUrlInS3(
                imageUrlToStore,
              );
            }
          } else {
            url = draftQuestion.questionCard.imageUrl;
          }
        }
          window.localStorage.setItem(StorageKey, '');
          if (draftQuestion.correctCard.isMultipleChoice)
            draftQuestion.correctCard.answerSettings.answerType =
              AnswerType.MULTICHOICE;
          const response = await apiClients.questionTemplate.createQuestionTemplate(
            publicPrivate as TemplateType,
            url || '',
            centralData.userProfile?.id || '',
            draftQuestion,
          );
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
      } else {
        if (!draftQuestion.questionCard.isCardComplete) {
          setIsBaseCardErrored(true);
        }
        if (!draftQuestion.correctCard.isCardComplete) {
          setIsCorrectCardErrored(true);
        }
        if (!draftQuestion.incorrectCards.every((card) => card.isCardComplete)) {
          setIsIncorrectCardErrored(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateFromDraftQuestion = async () => {
    try {
      setIsCardSubmitted(true);
      const isQuestionTemplateComplete = handleCheckQuestionBaseComplete(draftQuestion) && handleCheckQuestionCorrectCardComplete(draftQuestion) && handleCheckQuestionIncorrectCardsComplete(draftQuestion);
      if (isQuestionTemplateComplete) {
        setIsCreatingTemplate(true);
        await draftAssetHandler.publishDraftQuestion(centralData, draftQuestion, apiClients, originalImageURl, selectedQuestionId)
        setIsCreatingTemplate(false);
        fetchElements();
      } else {
        if (!draftQuestion.questionCard.isCardComplete) {
          setIsBaseCardErrored(true);
        }
        if (!draftQuestion.correctCard.isCardComplete) {
          setIsCorrectCardErrored(true);
        }
        if (!draftQuestion.incorrectCards.every((card) => card.isCardComplete)) {
          setIsIncorrectCardErrored(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSave = async () => {
    // case 1, saving a draft into a public/private question template
    if (isDraft) {
      await handleCreateFromDraftQuestion();
      return;
    }
    // case 2, saving a public/private question template that already exists
    if (isEdit) {
      const originalType = (
        isPublic ? PublicPrivateType.PUBLIC : PublicPrivateType.PRIVATE
      );
      if (publicPrivate === originalType){
        await handleSaveEditedQuestion();
        return;
      }
      try {
        await handleSaveQuestion();
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
    await handleSaveQuestion();
  };

  const handleSaveDraftQuestion = async () => {
    try {
      setModalObject({
        modalState: ModalStateType.SAVING,
        confirmState: ConfirmStateType.DRAFT,
      });
      if (draftQuestion.questionCard.title && draftQuestion.questionCard.title.length > 0) {
        setIsCardSubmitted(true);
        setIsCreatingTemplate(true);
        await draftAssetHandler.createDraftQuestion(centralData, draftQuestion, apiClients, originalImageURl);
        if (initPublicPrivate !== PublicPrivateType.DRAFT && selectedQuestionId) {
          await apiClients.questionTemplate.deleteQuestionTemplate(
            initPublicPrivate as TemplateType,
            selectedQuestionId
          );
        }
        setIsCreatingTemplate(false);
        setModalObject({
          modalState: ModalStateType.CONFIRM,
          confirmState: ConfirmStateType.DRAFT,
        });
      } else {
        setIsDraftCardErrored(true);
        setModalObject({
          modalState: ModalStateType.NULL,
          confirmState: ConfirmStateType.NULL,
        });
      }
    } catch (e) {
      console.log(e);
      setModalObject({
        modalState: ModalStateType.NULL,
        confirmState: ConfirmStateType.NULL,
      });
    }
  };

  const handleSaveEditedDraftQuestion = async () => {
    try {
      setModalObject({
        modalState: ModalStateType.SAVING,
        confirmState: ConfirmStateType.DRAFT,
      });
      if (draftQuestion.questionCard.title && draftQuestion.questionCard.title.length > 0) {
        setIsCardSubmitted(true);
        setIsUpdatingTemplate(true);
        await draftAssetHandler.updateDraftQuestion(centralData, draftQuestion, apiClients, originalImageURl, selectedQuestionId);
        setIsUpdatingTemplate(false);
        setModalObject({
          modalState: ModalStateType.CONFIRM,
          confirmState: ConfirmStateType.DRAFT,
        });
        fetchElements();
      } else {
        setIsDraftCardErrored(true);
        setModalObject({
          modalState: ModalStateType.NULL,
          confirmState: ConfirmStateType.NULL,
        });
      }
    } catch (e) {
      console.log(e);
      setModalObject({
        modalState: ModalStateType.NULL,
        confirmState: ConfirmStateType.NULL,
      });
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

  const handleSaveEditedQuestionSwitch = async () => {
    if (isDraft) {
      await handleSaveEditedDraftQuestion();
    } else {
      await handleSaveEditedQuestion();
    }
  }

  const handleDiscardQuestion = () => {
    setIsDiscardModalOpen(true);
  };

  const handleCloseQuestionModal = () => {
    setIsImageUploadVisible(false);
    setIsImageURLVisible(false);
    setIsCCSSVisibleModal(false);
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
  };

  const handleCloseSaveQuestionModal = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
  };

  const handleCloseDiscardModal = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
  };

  const handlePublishQuestion = async () => {
    setModalObject({
      modalState: ModalStateType.PUBLISHING,
      confirmState: ConfirmStateType.PUBLISHED,
    });
    setIsCardSubmitted(false);
    await handleSave();
    setModalObject({
      modalState: ModalStateType.CONFIRM,
      confirmState: ConfirmStateType.PUBLISHED,
    });
  };

  const handleContinue = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
    if (modalObject.confirmState === ConfirmStateType.DRAFT) {
      navigate(`/library/questions/${PublicPrivateType.DRAFT}`);
    } else {
      navigate(`/library/questions/${draftQuestion.publicPrivateType}`);
    }
  };

  const handleBackQuestion = () => {
    setModalObject({
      modalState: ModalStateType.DISCARD,
      confirmState: ConfirmStateType.NULL,
    });
  };

  // This pops the modal that allows the user to select publish, save as draft, or back
  const handleSaveQuestionClick = () => {
    setIsCardSubmitted(true);
    setIsBaseCardErrored(!handleCheckQuestionBaseComplete(draftQuestion));
    setIsCorrectCardErrored(!handleCheckQuestionCorrectCardComplete(draftQuestion));
    setIsIncorrectCardErrored(!handleCheckQuestionIncorrectCardsComplete(draftQuestion));
    setModalObject({
      modalState: ModalStateType.PUBLISH,
      confirmState: ConfirmStateType.PUBLISHED,
    });
  };

  const handleDiscard = () => {
    setModalObject({
      modalState: ModalStateType.NULL,
      confirmState: ConfirmStateType.NULL,
    });
    window.localStorage.setItem(StorageKey, '');
    navigate(`/library/questions/${centralData.selectedQuestion?.question?.publicPrivateType}`);
  };

  // Stable references for props to prevent unnecessary re-renders
  const isPublicQuestion = publicPrivate === PublicPrivateType.PUBLIC;

  useEffect(() => {
    setIsLoading(false);
    const selected = centralData?.selectedQuestion?.question;
    const title = selected?.title;
    if (selected && (isClone || isEdit)) {
      // regex to detect [DUPLICATE] in title
      const regex = /\[DUPLICATE\]/i;
      if (title && !regex.test(title) && isClone)
        selected.title = `${title} [DUPLICATE]`;
      const draft = assembleQuestionTemplate(selected, isDraft);
      setInitPublicPrivate(draft.publicPrivateType);
      setDraftQuestion((prev) => ({
        ...prev,
        ...draft,
      }));
      setOriginalImageURL(selected.imageUrl ?? '');
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
          isCCSSVisibleModal ||
          isImageUploadVisible ||
          modalObject.modalState !== ModalStateType.NULL
        }
        handleCloseModal={handleCloseQuestionModal}
      />
      <CCSSTabs
        screenSize={screenSize}
        isTabsOpen={isCCSSVisibleModal}
        handleCCSSSubmit={handleCCSSSubmit}
      />
      <ImageUploadModal
        draftQuestion={draftQuestion}
        isClone={isClone}
        isCloneImageChanged={isCloneImageChanged}
        isEdit={isEdit}
        screenSize={screenSize}
        isModalOpen={isImageUploadVisible}
        handleImageChange={handleImageChange}
        handleImageSave={handleImageSave}
        handleCloseModal={handleCloseModal}
      />
      <CreateQuestionModalSwitch
        modalObject={modalObject}
        screenSize={screenSize}
        title={draftQuestion.questionCard.title ?? ''}
        handleDiscard={handleDiscard}
        handleCloseDiscardModal={handleCloseDiscardModal}
        handlePublishQuestion={handlePublishQuestion}
        handleSaveEditedQuestion={handleSaveEditedQuestionSwitch}
        handleCloseSaveQuestionModal={handleCloseSaveQuestionModal}
        handleContinue={handleContinue}
        handleSaveDraft={handleSaveDraft}
        isCardErrored={(isBaseCardErrored || isCorrectCardErrored || isIncorrectCardErrored)}
        isDraft={isDraft}
      />
      <CreateQuestionBoxContainer screenSize={screenSize}>
        <CreateQuestionHeader 
          handleSaveQuestion={handleSaveQuestionClick} 
          handleBackClick={handleBackQuestion} 
          label={label} 
          screenSize={screenSize} 
        />

        {isLoading ? (
          <CircularProgress
            style={{ color: `${theme.palette.primary.circularProgress}` }}
          />
        ) : (

            <BodyContainer screenSize={screenSize}>
              <Box
                style={{
                  width: '100%',
                  maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '445px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${theme.sizing.mdPadding}px`,
                }}
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
                  handleImageUploadClick={handleImageUploadClick}
                  handlePublicPrivateChange={handlePublicPrivateChange}
                  isCardSubmitted={isCardSubmitted}
                  isDraftCardErrored={isDraftCardErrored}
                  isCardErrored={isBaseCardErrored}
                  isAIError={isAIError.some(Boolean)}
                  isPublic={isPublicQuestion}
                  isMultipleChoice={draftQuestion.correctCard.isMultipleChoice}
                  handleAnswerType={handleAnswerType}
                  handleAnswerSettingsChange={handleAnswerSettingsChange}
                />
              </Box>
              <Box
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${theme.sizing.mdPadding}px`,
                  }}
                >
                  <CorrectAnswerCard
                    screenSize={screenSize}
                    isClone={false}
                    draftQuestion={draftQuestion}
                    handleCorrectAnswerChange={handleCorrectAnswerChange}
                    handleCorrectAnswerStepsChange={handleCorrectAnswerStepsChange}
                    handleAnswerSettingsChange={handleAnswerSettingsChange}
                    isCardSubmitted={isCardSubmitted}
                    isCardErrored={isCorrectCardErrored}
                    isAIError={isAIError.some(Boolean)}
                  />
                  <Box
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: `${theme.sizing.xSmPadding}px`,
                    }}
                  >
                     <Box
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: `${theme.sizing.smPadding}px`,
                        }}
                      >
                        <Typography
                          sx={{
                            maxWidth: '550px',
                            fontFamily: 'Rubik',
                            fontSize: '16px',
                            fontWeight: '400',
                            textAlign: 'right'
                          }}
                        >
                          Use our <i>Wrong Answer Explanation Generator</i> to generate incorrect answer explanations.
                        </Typography>
                        <AISwitch
                          value={isAISwitchEnabled}
                          onChange={(e: any) => handleSwitchChange(e.target.checked)}
                        />
                      </Box>
                    {draftQuestion.incorrectCards.map((card, index) => (
                      <IncorrectAnswerCard
                        key={card.id ?? `incorrect-${index}`}
                        screenSize={screenSize}
                        isClone={false}
                        cardIndex={index}
                        draftQuestion={draftQuestion}
                        handleIncorrectAnswerChange={handleIncorrectAnswerChange}
                        handleIncorrectExplanationChange={handleIncorrectExplanationChange}
                        isCardSubmitted={isCardSubmitted}
                        isCardErrored={isIncorrectCardErrored}
                        isAIError={isAIError[index as 0 | 1 | 2]}
                        isAISwitchEnabled={isAISwitchEnabled}
                      />
                    ))}
                  </Box>
                </Box>
            </BodyContainer>
        )}
      </CreateQuestionBoxContainer>
    </CreateQuestionMainContainer>
  );
}