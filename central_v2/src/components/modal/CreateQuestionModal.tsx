import React, {useState} from 'react';
import { Paper, Modal, Slide, styled, useTheme, Box, Typography } from '@mui/material';
import { AnswerPrecision, AnswerType, CentralQuestionTemplateInput } from '@righton/networking';
import { ScreenSize, TemplateType } from '../../lib/CentralModels';
import { TDraftQuestionsList } from '../../lib/CreateGameModels';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import CreateQuestionCardBase from '../cards/creategamecard/createquestion/CreateQuestionCardBase';
import CorrectAnswerCard from '../cards/creategamecard/createquestion/CorrectAnswerCard';
import IncorrectAnswerCard from '../cards/creategamecard/createquestion/IncorrectAnswerCard';

interface CreateQuestionModalProps {
    isModalOpen: boolean;
    screenSize: ScreenSize;
    handleCreateQuestion: () => void;
    handleCloseCreateQuestionModal: () => void;
}

const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  top: '160px',
  left: '135px',
  right: '135px',
  bottom: 0,
  background: '#FFF',
  paddingTop: '48px',
  marginTop: '48px',
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

const ScrollableContent = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '20px',
  paddingLeft: '48px',
  paddingRight: '48px',
  paddingBottom: '86px',
  overflow: 'auto',
  flex: 1,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
});

export default function CreateQuestionModal({
    isModalOpen,
    screenSize,
    handleCreateQuestion,
    handleCloseCreateQuestionModal,
}: CreateQuestionModalProps) {
    const theme = useTheme();
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

    const handleTitleChange = (title: string) => {
      setDraftQuestion({
        ...draftQuestion,
        questionCard: { ...draftQuestion.questionCard, title },
      });
    };

    return (
        <Modal
          open={isModalOpen}
          onClose={handleCloseCreateQuestionModal}
          disableScrollLock={false}
          disableEscapeKeyDown
          closeAfterTransition
        >
          <Slide
            direction="up"
            in={isModalOpen}
            timeout={1000}
            mountOnEnter
            unmountOnExit
          >
            <IntegratedContainer elevation={12} tabIndex={-1}>
              <ScrollableContent>
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
                      isEnabled 
                      onClick={handleCreateQuestion} 
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
                      handleCCSSClick={() => {}}
                      handleImageUploadClick={() => {}}
                      handleAnswerType={() => {}}
                      handlePublicPrivateChange={() => {}}
                      isHighlight={false}
                      isCardSubmitted={false}
                      isDraftCardErrored={false}
                      isCardErrored={false}
                      isAIError={false}
                      isPublic={false}
                      isMultipleChoice={false}
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
                    handleCorrectAnswerChange={() => {}}
                    handleCorrectAnswerStepsChange={() => {}}
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
                        handleIncorrectAnswerChange={() => {}}
                        handleIncorrectExplanationChange={() => {}}
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
        </Modal>
    )
}