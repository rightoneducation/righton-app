import { useState, useCallback } from 'react';
import { 
    PublicPrivateType,
    CentralQuestionTemplateInput,
    IncorrectCard,
} from '@righton/networking';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useTSAPIClientsContext } from './context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import useCreateQuestionLoader from '../loaders/CreateQuestionLoader';
import {
    CreateQuestionHighlightCard,
    ScreenSize,
    StorageKey,
    TemplateType,
  } from '../lib/CentralModels';
  import {
    updateDQwithCCSS,
    updateDQwithImage,
    updateDQwithImageURL,
    updateDQwithQuestionClick,
    updateDQwithTitle,
  } from '../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';
import { updateDQwithCorrectAnswer, updateDQwithCorrectAnswerClick, updateDQwithCorrectAnswerSteps } from '../lib/helperfunctions/createquestion/CorrectAnswerCardHelperFunctions';
import { getNextHighlightCard, handleMoveAnswerToComplete, updateDQwithIncorrectAnswerClick, updateDQwithIncorrectAnswers } from '../lib/helperfunctions/createquestion/IncorrectAnswerCardHelperFunctions';

const useCreateQuestion = () => {
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const navigate = useNavigate();
    const [isQuestionCardSubmitted, setIsQuestionCardSubmitted] = useState<boolean>(false);
    const [isQuestionCardErrored, setIsQuestionCardErrored] = useState<boolean>(false);
      const [isClicked, setIsClicked] = useState<boolean>(false);
      
      const [isAIEnabled, setIsAIEnabled] = useState<boolean>(false);
    
      const [isAIError, setIsAIError] = useState<boolean>(false);
    
     const [publicPrivateQuestion, setPublicPrivateQuestion] = useState<PublicPrivateType>(
        PublicPrivateType.PUBLIC,
      );
    const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);
    const [isImageUploadVisible, setIsImageUploadVisible] =
        useState<boolean>(false);
     const [isImageURLVisible, setIsImageURLVisible] = useState<boolean>(false);
        const [highlightCard, setHighlightCard] =
            useState<CreateQuestionHighlightCard>(
              CreateQuestionHighlightCard.QUESTIONCARD,
            );

              const [isImagePreviewVisible, setIsImagePreviewVisible] =
                useState<boolean>(false);
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
     const [isCCSSVisible, setIsCCSSVisible] = useState<boolean>(false);

      const handlePublicPrivateQuestionChange = (value: PublicPrivateType) => {
        setPublicPrivateQuestion((prev) => value);
      };

       const handleSaveQuestion = async () => {
          try {
            setIsQuestionCardSubmitted(true);
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
                    publicPrivateQuestion,
                    url,
                    draftQuestion,
                  );
                }
                setIsCreatingTemplate(false);
                navigate('/questions');
              }
            } else {
                setIsQuestionCardErrored(true);
            }
          } catch (e) {
            console.log(e);
          }
        };

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

            const handleDebouncedCorrectAnswerChange = useCallback(// eslint-disable-line
              debounce(
                (
                  correctAnswer: string,
                  draftQuestionInput: CentralQuestionTemplateInput,
                ) => {
                  const { isFirstEdit } = draftQuestionInput.correctCard;
                  const newDraftQuestion = updateDQwithCorrectAnswer(
                    draftQuestionInput,
                    correctAnswer,
                  );
                  console.log(newDraftQuestion);
                  window.localStorage.setItem(
                    StorageKey,
                    JSON.stringify(newDraftQuestion),
                  );
                  setDraftQuestion(newDraftQuestion);
                  if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
                    setHighlightCard(
                      (prev) => CreateQuestionHighlightCard.INCORRECTANSWER1,
                    );
                },
                1000,
              ),
              [],
            );
          
            const handleDebouncedCorrectAnswerStepsChange = useCallback( // eslint-disable-line
              debounce(
                (steps: string[], draftQuestionInput: CentralQuestionTemplateInput) => {
                  const { isFirstEdit } = draftQuestionInput.correctCard;
                  const newDraftQuestion = updateDQwithCorrectAnswerSteps(
                    draftQuestionInput,
                    steps,
                  );
                  window.localStorage.setItem(
                    StorageKey,
                    JSON.stringify(newDraftQuestion),
                  );
                setDraftQuestion(newDraftQuestion);
                  if (newDraftQuestion.correctCard.isCardComplete && isFirstEdit)
                    setHighlightCard(
                      (prev) => CreateQuestionHighlightCard.INCORRECTANSWER1,
                    );
                },
                1000,
              ),
              [],
            );

          const handleCloseQuestionModal = () => {
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

      const handleCCSSSubmit = (ccssString: string) => {
        setIsCCSSVisible(false);
        const { isFirstEdit } = draftQuestion.questionCard;
        const newDraftQuestion = updateDQwithCCSS(draftQuestion, ccssString);
        window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
        setDraftQuestion(newDraftQuestion);
        if (newDraftQuestion.questionCard.isCardComplete && isFirstEdit)
          setHighlightCard((prev) => CreateQuestionHighlightCard.CORRECTANSWER);
      };

            // incorrect answer card functions
            const handleNextCardButtonClick = (cardData: IncorrectCard) => {
              if (isAIError)
                setIsAIError(false);
              const updatedAnswers = incompleteIncorrectAnswers.map((answer) => {
                if (answer.id === cardData.id) {
                  return cardData;
                }
                return answer;
              });
              const { newIncompleteAnswers, newCompleteAnswers } = handleMoveAnswerToComplete(updatedAnswers, completeIncorrectAnswers);
              setIncompleteIncorrectAnswers(newIncompleteAnswers);
              setCompleteIncorrectAnswers(newCompleteAnswers);
            };
          
            const handleIncorrectCardStackUpdate = (cardData: IncorrectCard, draftQuestionInput: CentralQuestionTemplateInput, completeAnswers: IncorrectCard[], incompleteAnswers: IncorrectCard[], isAIEnabledCard?: boolean) => {
                const nextCard = getNextHighlightCard(cardData.id as CreateQuestionHighlightCard);
                const isUpdateInIncompleteCards = incompleteAnswers.find(answer => answer.id === cardData.id);
                let newDraftQuestion = null;
                const isCardComplete = cardData.answer.length >0 && cardData.explanation.length > 0;
                // we need to break this up so we don't change the stateful arrays when a card is not being passed across them. 
                // everytime we update those arrays, we're going to trigger an animation, so we have to only manipulate them when we want that
                // so in this case, if the card that is being edited is already complete, we are only going to update the draftQuestion object and leave the arrays alone
                if (isUpdateInIncompleteCards){
                  setIsAIError(false);
                  const updatedAnswers = incompleteAnswers.map((answer) => {
                    if (answer.id === cardData.id) {
                      return cardData;
                    }
                    return answer;
                  });
                  if (isCardComplete && !isAIEnabledCard){
                    // adjust incomplete and complete arrays, moving completed card over
                    const { newIncompleteAnswers, newCompleteAnswers } = handleMoveAnswerToComplete(updatedAnswers, completeAnswers);
                    // adjust local state for the cards so that they animate properly through the stack
                    setIncompleteIncorrectAnswers(newIncompleteAnswers);
                    setCompleteIncorrectAnswers(newCompleteAnswers);
                    newDraftQuestion = updateDQwithIncorrectAnswers(draftQuestionInput, newIncompleteAnswers, newCompleteAnswers);
          
                    if (cardData.isFirstEdit)
                      setHighlightCard((prev) => nextCard as CreateQuestionHighlightCard);
                  } else {
                    newDraftQuestion = updateDQwithIncorrectAnswers(draftQuestionInput, updatedAnswers, completeAnswers);
                  }
                } else {
                  const newCompleteAnswers = completeAnswers.map((answer) => {
                    if (answer.id === cardData.id) {
                      return cardData;
                    }
                    return answer;
                  })
                  newDraftQuestion = updateDQwithIncorrectAnswers(draftQuestionInput, incompleteAnswers, newCompleteAnswers);
                }
              
                // adjust draftQuestion and localstorage for use in API call and retrieval, respectively
                if (newDraftQuestion){
                  setDraftQuestion(newDraftQuestion);
                  window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
                }
             
            }
      
    
      const handleCCSSClick = () => {
        setIsCCSSVisible((prev) => !prev);
      };

      const handleAIError = () => {
        setIsAIError(true);
      }
    
      const handleAIIsEnabled = () => {
        setIsAIEnabled((prev) => !prev);
        setIsAIError(false);
      }
    
      const handleQuestionImageUploadClick = () => {
        setIsImageUploadVisible(true);
      }

      return {
        // handlers
        handleQuestionImageUploadClick,
        handleNextCardButtonClick,
        handleIncorrectCardStackUpdate,
        handleAIError,
        handleAIIsEnabled,
        handleImageChange,
        handleImageSave,
        handlePublicPrivateQuestionChange,
        handleSaveQuestion,
        handleClick,
        handleCloseQuestionModal,
        handleCCSSClick,
        handleCCSSSubmit,
        setDraftQuestion,
        setHighlightCard,
        handleDebouncedCorrectAnswerChange,
        handleDebouncedCorrectAnswerStepsChange,
        handleDebouncedTitleChange,

        // state
        completeIncorrectAnswers,
        incompleteIncorrectAnswers,
        publicPrivateQuestion,
        isQuestionCardSubmitted,
        isQuestionCardErrored,
        isCreatingTemplate,
        isImageUploadVisible,
        isImageURLVisible,
        draftQuestion,
        isCCSSVisible,
        highlightCard,
        isClicked,
        isAIEnabled,
        isAIError,

      }
}
export default useCreateQuestion;