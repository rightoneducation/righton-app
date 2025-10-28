import React, {useState, useMemo} from 'react';
import { debounce } from 'lodash';
import { Paper, Modal, Slide, styled, useTheme, Box, Typography } from '@mui/material';
import { AnswerPrecision, AnswerType, CentralQuestionTemplateInput, IQuestionTemplate, PublicPrivateType } from '@righton/networking';
import { ScreenSize, StorageKey, TemplateType } from '../../lib/CentralModels';
import SubModalBackground from './SubModalBackground';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import CreateQuestionCardBase from '../cards/creategamecard/createquestion/CreateQuestionCardBase';
import CorrectAnswerCard from '../cards/creategamecard/createquestion/CorrectAnswerCard';
import IncorrectAnswerCard from '../cards/creategamecard/createquestion/IncorrectAnswerCard';
import { handleCheckQuestionComplete } from '../../lib/helperfunctions/createGame/CreateQuestionsListHelpers';
import CCSSTabs from '../ccsstabs/CCSSTabs';
import ImageUploadModal from './ImageUploadModal';
import { updateDQwithImage, updateDQwithImageURL } from '../../lib/helperfunctions/createquestion/CreateQuestionCardBaseHelperFunctions';


interface CreateQuestionModalProps {
    isModalOpen: boolean;
    screenSize: ScreenSize;
    handleCreateQuestion: (draftQuestion: CentralQuestionTemplateInput) => void;
    handleCloseCreateQuestionModal: () => void;
}


type IntegratedContainerProps = {
  screenSize: ScreenSize;
};
export const IntegratedContainer = styled(Paper, {
  shouldForwardProp: (prop: string) =>
    prop !== 'screenSize',
})<IntegratedContainerProps>(({ screenSize, theme }) => ({
  position: 'absolute',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  top: '160px',
  left: screenSize === ScreenSize.SMALL ? '0px' : '135px',
  right: screenSize === ScreenSize.SMALL ? '0px' : '135px',
  bottom: 0,
  background: '#FFF',
  paddingTop: screenSize === ScreenSize.SMALL ? '0px' : '48px',
  marginTop: '48px',
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

type ScrollableContentProps = {
  screenSize: ScreenSize;
};

const ScrollableContent = styled(Box, {
  shouldForwardProp: (prop: string) =>
    prop !== 'screenSize',
})<ScrollableContentProps>(({ screenSize, theme }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '20px',
  paddingTop: screenSize === ScreenSize.SMALL ? '24px' : '8px',
  paddingLeft: screenSize === ScreenSize.SMALL ? '24px' : '48px',
  paddingRight: screenSize === ScreenSize.SMALL ? '24px' : '48px',
  paddingBottom: '86px',
  overflow: 'auto',
  flex: 1,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}));

export default function CreateQuestionModal({
    isModalOpen,
    screenSize,
    handleCreateQuestion,
    handleCloseCreateQuestionModal,
}: CreateQuestionModalProps) {
    const theme = useTheme();
    const [isCCSSVisibleModal, setIsCCSSVisibleModal] = useState(false);
    const [isImageUploadVisible, setIsImageUploadVisible] = useState(false);
    const [draftQuestion, setDraftQuestion] = useState<CentralQuestionTemplateInput>(() => {
      return (
        {
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
              answerType: AnswerType.NUMBER,
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

    const [isQuestionComplete, setIsQuestionComplete] = useState(handleCheckQuestionComplete(draftQuestion));
    const handleDebouncedCheckQuestionComplete = useMemo(
      () => debounce((debounceQuestion: CentralQuestionTemplateInput) => {
        setIsQuestionComplete(handleCheckQuestionComplete(debounceQuestion));
      }, 1000),
      []
    );


    const handleTitleChange = (title: string) => {
      setDraftQuestion((prev) => {
        const newDraftQuestion = {
          ...prev,
          questionCard: { ...prev.questionCard, title },
        };
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
        return newDraftQuestion;
      });
    }

    const handleCorrectAnswerChange = (correctAnswer: string) => {
      setDraftQuestion((prev) => {
        const newDraftQuestion = {
          ...prev,
          correctCard: { ...prev.correctCard, answer: correctAnswer },
        };
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
        return newDraftQuestion;
      });
    }

    const handleCorrectAnswerStepsChange = (correctAnswerSteps: string[]) => {
      setDraftQuestion((prev) => {
        const newDraftQuestion = {
          ...prev,
          correctCard: { ...prev.correctCard, answerSteps: correctAnswerSteps },
        };
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
        return newDraftQuestion;
      });
    }

    const handleIncorrectAnswerChange = (incorrectAnswer: string, index: number) => {
      setDraftQuestion((prev) => {
        const newDraftQuestion = {
          ...prev,
          incorrectCards: prev.incorrectCards.map((card, i) => 
            i === index ? { ...card, answer: incorrectAnswer } : card
          ),
        };
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
        return newDraftQuestion;
      });
    }

    const handleIncorrectExplanationChange = (incorrectExplanation: string, index: number) => {
      setDraftQuestion((prev) => {
        const newDraftQuestion = {
          ...prev,
          incorrectCards: prev.incorrectCards.map((card, i) => 
            i === index ? { ...card, explanation: incorrectExplanation } : card
          ),
        };
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
        return newDraftQuestion;
      });
    }
   
    const handleAnswerType = () => {
      setDraftQuestion((prev) => {
        const newDraftQuestion = {
          ...prev,
          correctCard: { ...prev.correctCard, isMultipleChoice: !prev.correctCard.isMultipleChoice },
        };
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
        return newDraftQuestion;
      });
    }

    const handleCCSSSubmit = (ccss: string) => {
      setDraftQuestion((prev) => {
        const newDraftQuestion = {
          ...prev,
          questionCard: { ...prev.questionCard, ccss },
        };
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
        return newDraftQuestion;
      });
      setIsCCSSVisibleModal(false);
    }

    const handleCloseImageUploadModal = () => {
      setIsImageUploadVisible(false);
    }

    const handleCloseSubModal = () => { 
      setIsCCSSVisibleModal(false);
      setIsImageUploadVisible(false);
    }

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
      if (inputImage) {
        const { isFirstEdit } = draftQuestion.questionCard;
        const newDraftQuestion = updateDQwithImage(
          draftQuestion,
          undefined,
          inputImage,
        );
        window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
        setDraftQuestion(newDraftQuestion);
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
      }
      if (inputUrl) {
        const { isFirstEdit } = draftQuestion.questionCard;
        const newDraftQuestion = updateDQwithImageURL(draftQuestion, inputUrl);
        window.localStorage.setItem(StorageKey, JSON.stringify(newDraftQuestion));
        setDraftQuestion(newDraftQuestion);
        handleDebouncedCheckQuestionComplete(newDraftQuestion);
      }
    };

    return (
        <Modal
          open={isModalOpen}
          onClose={handleCloseCreateQuestionModal}
          disableScrollLock={false}
          disableEscapeKeyDown
          closeAfterTransition
        >
          <>
            {/* tracks ccss state according to index */}
            {isCCSSVisibleModal && (
                <CCSSTabs
                  screenSize={screenSize}
                  isTabsOpen={isCCSSVisibleModal}
                  handleCCSSSubmit={handleCCSSSubmit}
                  ccss={
                    draftQuestion.questionCard.ccss
                  }
                />
              )}

            {/* open modals according to correct index */}
            {isImageUploadVisible && (
                <ImageUploadModal
                  draftQuestion={draftQuestion}
                  screenSize={screenSize}
                  isClone={false}
                  isCloneImageChanged={
                    false
                  }
                  isModalOpen={
                    isImageUploadVisible
                  }
                  handleImageChange={handleImageChange}
                  handleImageSave={handleImageSave}
                  handleCloseModal={handleCloseImageUploadModal}
                />
              )}
            <SubModalBackground
              isModalOpen={isCCSSVisibleModal || isImageUploadVisible}
              handleCloseModal={handleCloseSubModal}
            />
            <Slide
              direction="up"
              in={isModalOpen}
              timeout={1000}
              mountOnEnter
              unmountOnExit
            >
              <IntegratedContainer elevation={12} tabIndex={-1} screenSize={screenSize}>
                <ScrollableContent screenSize={screenSize}>
                  <Box
                    style={{
                      width: '100%',
                      maxWidth: '445px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: `${theme.sizing.mdPadding}px`,
                      
                    }}
                  >
                    <Box
                      style={{
                        display: 'flex',
                        gap: `${theme.sizing.xSmPadding}px`,
                      }}
                    >
                      <CentralButton 
                        buttonType={ButtonType.CANCELQUESTION} 
                        isEnabled
                        onClick={handleCloseCreateQuestionModal} 
                      />
                      <CentralButton 
                        buttonType={ButtonType.SAVEADD} 
                        isEnabled={isQuestionComplete}
                        onClick={() => handleCreateQuestion(draftQuestion)} 
                      />
                    </Box>
                    <Box>
                      <CreateQuestionCardBase
                        screenSize={screenSize}
                        isClone={false}
                        isEdit={false}
                        isCloneImageChanged={false}
                        label=''
                        draftQuestion={draftQuestion}
                        handleTitleChange={handleTitleChange}
                        handleCCSSClick={() => setIsCCSSVisibleModal(true)}
                        handleImageUploadClick={() => setIsImageUploadVisible(true)}
                        handleAnswerType={handleAnswerType}
                        handlePublicPrivateChange={() => {}}
                        isHighlight={false}
                        isCardSubmitted={false}
                        isDraftCardErrored={false}
                        isCardErrored={false}
                        isAIError={false}
                        isPublic={false}
                        isMultipleChoice={draftQuestion.correctCard.isMultipleChoice}
                      />
                    </Box>
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
                      isHighlight={false}
                      handleCorrectAnswerChange={handleCorrectAnswerChange}
                      handleCorrectAnswerStepsChange={handleCorrectAnswerStepsChange}
                      handleAnswerSettingsChange={() => {}}
                      isCardSubmitted={false}
                      isCardErrored={false}
                      isAIError={false}
                    />
                    <Box
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${theme.sizing.xSmPadding}px`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        Incorrect Answers
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Rubik',
                          fontSize: '16px',
                          fontWeight: '400',
                        }}
                      >
                        Each question has three incorrect answers
                      </Typography>
                      {draftQuestion.incorrectCards.map((card, index) => (
                        <IncorrectAnswerCard
                          screenSize={screenSize}
                          isClone={false}
                          cardIndex={index}
                          draftQuestion={draftQuestion}
                          isHighlight={false}
                          handleIncorrectAnswerChange={handleIncorrectAnswerChange}
                          handleIncorrectExplanationChange={handleIncorrectExplanationChange}
                          isCardSubmitted={false}
                          isCardErrored={false}
                          isAIError={false}
                        />
                      ))}
                    </Box>
                  </Box>
                </ScrollableContent>
              </IntegratedContainer>
            </Slide>
          </>
        </Modal>
    )
}