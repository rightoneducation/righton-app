import React from 'react';
import {
  Typography,
  Box,
  styled,
  useTheme,
  Collapse
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  PublicPrivateType,
  IQuestionTemplate,
  CloudFrontDistributionUrl,
  AnswerType,
  CentralQuestionTemplateInput,
} from '@righton/networking';
import {
  AnswerIndicator,
} from '../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  ViewQuestionBaseCardStyled,
  ViewQuestionContentContainerStyled,
  QuestionTextStyled,
} from '../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ButtonCCSS } from '../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize } from '../../lib/CentralModels';
import { ButtonType } from '../button/ButtonModels';
import CentralButton from '../button/Button';
import buttonExpandQuestionImage from '../../images/buttonExpandQuestion.svg';
import buttonRemoveQuestionImage from '../../images/buttonRemoveQuestion.svg';
import { SelectArrowContainer } from '../../lib/styledcomponents/SelectGrade';

interface DetailedUnifiedQuestionCardBaseProps {
  screenSize: ScreenSize;
  question: CentralQuestionTemplateInput;
  questionTemplate: IQuestionTemplate | null;
  handleRemoveQuestion?: () => void;
  dropShadow?: boolean;
  isCreateGame?: boolean;
}

interface CreateQuestionTitleBarStyledProps {
  screenSize: ScreenSize;
}

export const CreateQuestionTitleBarStyled = styled(
  Box,
)<CreateQuestionTitleBarStyledProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap:
    screenSize === ScreenSize.SMALL
      ? `${theme.sizing.xSmPadding}px`
      : `${theme.sizing.smPadding}px`,
}));

export const CreateQuestionContentRightContainerStyled = styled(Box)(
  ({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.sizing.xSmPadding}px`,
  }),
);

export default function DetailedUnifiedQuestionCardBase({
  screenSize,
  question,
  questionTemplate,
  handleRemoveQuestion,
  dropShadow,
  isCreateGame,

}: DetailedUnifiedQuestionCardBaseProps) {
  const theme = useTheme();
  const correctAnswer = question?.correctCard?.answer;
  const incorrectAnswers = question?.incorrectCards?.map((answer) => answer.answer);
  const [isSelectOpen, setIsSelectOpen] = React.useState<boolean>(false);
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [isPublic, setIsPublic] = React.useState<boolean>(
    true
  );
  const isMultipleChoice =
    question.correctCard.answerSettings.answerType === AnswerType.MULTICHOICE;
  const isCreateGamePage =
    (isCreateGame && screenSize === ScreenSize.LARGE) ||
    (isCreateGame && screenSize === ScreenSize.MEDIUM) ||
    (isCreateGame && screenSize === ScreenSize.SMALL);


  let imageLink: string | null = null;
  if (question.questionCard.imageUrl) {
    if (!questionTemplate?.id || questionTemplate.id === '')
      imageLink = question.questionCard.imageUrl;
    else
      imageLink = `${CloudFrontDistributionUrl}${question.questionCard.imageUrl}`;
  } else if (question.questionCard.image && question.questionCard.image instanceof File)
    imageLink = URL.createObjectURL(question.questionCard.image);

  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };

  const handlePublicPrivateChange = () => {
    setIsPublic((prev) => !prev);
  };

  return (
    <ViewQuestionBaseCardStyled
      elevation={6}
      style={{
        marginRight: screenSize === ScreenSize.SMALL ? '0px' : '10px',
        flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
      }}
    >
      <Box
        style={{
          width: screenSize === ScreenSize.SMALL ? '100%' : '200px',
          height: '100%',
          position: screenSize === ScreenSize.SMALL ? 'relative' : 'static',
        }}
      >
        <img
          src={imageLink ?? ''}
          alt="question"
          style={{
            width: screenSize === ScreenSize.SMALL ? '100%' : '200px',
            height: screenSize === ScreenSize.SMALL ? '185px' : '100%',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
        {handleRemoveQuestion && isCreateGame && screenSize === ScreenSize.SMALL && (
          <Box
            onClick={handleRemoveQuestion}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'absolute',
              top: '20px',
              right: '20px',
            }}
          >
            <img
              src={`${buttonRemoveQuestionImage}`}
              alt="expand question"
            />
          </Box>
        )}
      </Box>
      <Box
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: `${theme.sizing.mdPadding}px`,
          paddingBottom: `${theme.sizing.mdPadding}px`,
          paddingLeft: `${theme.sizing.smPadding}px`,
          paddingRight: `${theme.sizing.smPadding}px`,
          boxSizing: 'border-box',
          gap: `${theme.sizing.mdPadding}px`,
        }}
      >
        {/* CCSS, buttons, and question text */}
        <ViewQuestionContentContainerStyled
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.smPadding}px`,
          }}
        >
          <CreateQuestionTitleBarStyled screenSize={screenSize}>
            <Box
              style={{
                width: '100%',
                display: 'flex',
                justifyContent:
                  screenSize === ScreenSize.SMALL ? 'space-between' : 'flex-start',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <ButtonCCSS key={uuidv4()}>{question.questionCard.ccss}</ButtonCCSS>
            </Box>
            <Box
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <Box
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <SelectArrowContainer isSelectOpen={isSelectOpen} onClick={() => setIsSelectOpen(!isSelectOpen)}>
                  <img
                    src={`${buttonExpandQuestionImage}`}
                    alt="expand question"
                  />
                </SelectArrowContainer>
              </Box>
              {handleRemoveQuestion && isCreateGame && screenSize !== ScreenSize.SMALL && (
                <Box
                  onClick={handleRemoveQuestion}
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={`${buttonRemoveQuestionImage}`}
                    alt="expand question"
                  />
                </Box>
              )}
            </Box>
          </CreateQuestionTitleBarStyled>
          <Box
            style={{
              width: '100%',
              margin: 0,
              boxSizing: 'border-box',
            }}
          >
            <Typography sx={{whiteSpace: 'pre-line'}}>
              {question.questionCard.title}
            </Typography>
          </Box>
        </ViewQuestionContentContainerStyled>
        <ViewQuestionContentContainerStyled>
          <QuestionTextStyled sx={{whiteSpace: 'pre-line', color: '#148700'}}>
            Correct Answer
          </QuestionTextStyled>
          <AnswerIndicator>{correctAnswer}</AnswerIndicator>
        </ViewQuestionContentContainerStyled>
        <Collapse in={isSelectOpen} timeout={1000}>
          <Box
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: `${theme.sizing.smPadding}px`,
            }}
          >
            <ViewQuestionContentContainerStyled>
              <QuestionTextStyled sx={{whiteSpace: 'pre-line', color: '#1B376F'}}>
                Incorrect Answers
              </QuestionTextStyled>
              <Box
                style={{
                  width: '100%',
                  display: 'flex',
                  gap: `${theme.sizing.xSmPadding}px`,
                }}
              >
                  {incorrectAnswers?.map((answer) => (
                    <AnswerIndicator>{answer}</AnswerIndicator>
                  ))}
              </Box>
            </ViewQuestionContentContainerStyled>
            <ViewQuestionContentContainerStyled
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '38px'
              }}
            >
              {(question.questionCard.isFirstEdit && isCreateGame) ? 
                <CentralButton
                  buttonType={ButtonType.EDIT}
                  isEnabled
                  buttonWidthOverride="127px"
                  onClick={() => {}}
                />
                : 
                <Typography
                  sx={{
                    fontFamily: 'Rubik',
                    fontSize: '14px',
                    color: '#1B376F',
                    padding: 0
                  }}
                >
                  Public Question Created By Other User
                </Typography>
              }
            </ViewQuestionContentContainerStyled>
          </Box>
        </Collapse>
      </Box>
    </ViewQuestionBaseCardStyled>
  );
}
