import React, {useState} from 'react';
import { Paper, Modal, Slide, styled, useTheme, Box } from '@mui/material';
import { AnswerPrecision, AnswerType, CentralQuestionTemplateInput } from '@righton/networking';
import { ScreenSize, TemplateType } from '../../lib/CentralModels';
import { TDraftQuestionsList } from '../../lib/CreateGameModels';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';
import CreateQuestionCardBase from '../cards/creategamecard/createquestion/CreateQuestionCardBase';

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
  paddingBottom: '86px',
  paddingLeft: '48px',
  paddingRight: '48px',
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '16px',
  boxSizing: 'border-box',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none',
}));

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
            answerSteps: ['', '', ''],
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
            </IntegratedContainer>
          </Slide>
        </Modal>
    )
}