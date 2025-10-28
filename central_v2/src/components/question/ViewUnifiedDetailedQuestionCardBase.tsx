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

interface DetailedUnifiedQuestionCardBaseProps {
  screenSize: ScreenSize;
  questionTemplate: IQuestionTemplate;
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

export default function DetailedUnifiedQuestionCardBase({
  screenSize,
  questionTemplate,
  handleRemoveQuestion,
  dropShadow,
  isCreateGame,

}: DetailedUnifiedQuestionCardBaseProps) {
  const theme = useTheme();
  const correctAnswer = questionTemplate?.choices?.find((choice) => choice.isAnswer)?.text;
  const incorrectAnswers = questionTemplate?.choices?.filter((choice) => !choice.isAnswer)?.map((choice) => choice.text);
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [isPublic, setIsPublic] = React.useState<boolean>(
    true
  );
  const isMultipleChoice =
    questionTemplate?.answerSettings?.answerType === AnswerType.MULTICHOICE;
  const isCreateGamePage =
    (isCreateGame && screenSize === ScreenSize.LARGE) ||
    (isCreateGame && screenSize === ScreenSize.MEDIUM) ||
    (isCreateGame && screenSize === ScreenSize.SMALL);


  let imageLink: string | null = null;
  if (questionTemplate?.imageUrl) {
      imageLink = `${CloudFrontDistributionUrl}${questionTemplate.imageUrl}`;
  }

  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };

  const handlePublicPrivateChange = () => {
    setIsPublic((prev) => !prev);
  };
console.log('questionTemplate');
console.log(questionTemplate);
console.log('imageLink');
console.log(imageLink);

  return (
    <ViewQuestionBaseCardStyled
      elevation={6}
      style={{
        marginRight: '10px' 
      }}
    >
      <img
        src={imageLink ?? ''}
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
              <ButtonCCSS key={uuidv4()}>{questionTemplate.ccss}</ButtonCCSS>
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
              {handleRemoveQuestion && isCreateGame && (
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
              {questionTemplate.title}
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
          {(!questionTemplate.id || questionTemplate.id === '') && isCreateGame ? 
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
