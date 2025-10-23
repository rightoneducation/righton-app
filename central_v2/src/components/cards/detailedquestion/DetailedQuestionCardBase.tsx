import React from 'react';
import {
  Typography,
  Box,
  styled,
  useTheme,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  PublicPrivateType,
  IQuestionTemplate,
  CloudFrontDistributionUrl,
  AnswerType,
} from '@righton/networking';
import {
  AnswerIndicator,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  ViewQuestionBaseCardStyled,
  ViewQuestionContentContainerStyled,
  QuestionTextStyled,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ButtonCCSS } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';
import { ButtonType } from '../../button/ButtonModels';
import CentralButton from '../../button/Button';
import buttonExpandQuestionImage from '../../../images/buttonExpandQuestion.svg';
import buttonRemoveQuestionImage from '../../../images/buttonRemoveQuestion.svg';

interface DetailedQuestionCardBaseProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate;
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
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
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

export default function DetailedQuestionCardBase({
  screenSize,
  question,
  handleRemoveQuestion,
  dropShadow,
  isCreateGame,

}: DetailedQuestionCardBaseProps) {
  const theme = useTheme();
  const correctAnswer = question?.choices?.find((answer) => answer.isAnswer)?.text;
  const incorrectAnswers = question?.choices?.filter((answer) => !answer.isAnswer)?.map((answer) => answer.text);
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [isPublic, setIsPublic] = React.useState<boolean>(
    question.publicPrivateType === PublicPrivateType.PUBLIC,
  );
  const isMultipleChoice =
    question.answerSettings?.answerType === AnswerType.MULTICHOICE;
  const isCreateGamePage =
    (isCreateGame && screenSize === ScreenSize.LARGE) ||
    (isCreateGame && screenSize === ScreenSize.MEDIUM) ||
    (isCreateGame && screenSize === ScreenSize.SMALL);

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
    >
      <img
        src={`${CloudFrontDistributionUrl}${question.imageUrl ?? ''}`}
        alt="question"
        style={{
          width: '200px',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
      <Box
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: `${theme.sizing.mdPadding}px`,
          paddingBottom: `${theme.sizing.mdPadding}px`,
          paddingLeft: `${theme.sizing.smPadding}px`,
          paddingRight: `${theme.sizing.smPadding}px`,
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
              <ButtonCCSS key={uuidv4()}>{question.ccss}</ButtonCCSS>
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
                <img
                  src={`${buttonExpandQuestionImage}`}
                  alt="expand question"
                />
              </Box>
              {handleRemoveQuestion && (
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
              {question.title}
            </Typography>
          </Box>
        </ViewQuestionContentContainerStyled>
        <ViewQuestionContentContainerStyled>
          <QuestionTextStyled sx={{whiteSpace: 'pre-line', color: '#148700'}}>
            Correct Answer
          </QuestionTextStyled>
          <AnswerIndicator>{correctAnswer}</AnswerIndicator>
        </ViewQuestionContentContainerStyled>
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
          {question.id === null ? 
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
    </ViewQuestionBaseCardStyled>
  );
}
