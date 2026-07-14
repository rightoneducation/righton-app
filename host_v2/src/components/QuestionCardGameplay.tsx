import React from 'react';
import { useTheme, styled} from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { GameSessionState, CloudFrontDistributionUrl } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import QuestionCardGameplayStyled from '../lib/styledcomponents/QuestionCardGameplayStyled';
import AnswerOptionStyled from '../lib/styledcomponents/AnswerOptionStyled';

interface QuestionCardGameplayProps {
  questionText: string;
  imageUrl: string | undefined;
  answerContent: string;
  instructions: string[] | null;
  isShortAnswerEnabled: boolean;
  letterCode: string;
}

const QuestionImage = styled('img')({
  width: '100%',
  height: '186px',
  minHeight: '186px',
  objectFit: 'cover',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
});

export default function QuestionCardGameplay({
  questionText,
  imageUrl,
  answerContent,
  instructions,
  isShortAnswerEnabled,
  letterCode
}: QuestionCardGameplayProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();

  // Split into sentences at terminator-then-whitespace so decimals/currency
  const sentences = questionText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
  // The question is any sentence containing '?'; if none has one, bold the last.
  const hasQuestionMark = sentences.some((sentence) => sentence.includes('?'));

   const correctAnswerInstruction = (index: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: `${theme.sizing.xSmPadding}px`,
        }}
        key={uuidv4()}
      >
        <Typography
          variant='rubikBodyLarge'
          sx={{
            marginLeft: `${theme.sizing.smPadding}px`,
            color: `${theme.palette.designSystem.surface.pink}`,
          }}
        >
          {index + 1}
        </Typography>
        <Typography
          sx={{
            marginLeft: `${theme.sizing.xSmPadding}px`,
            whiteSpace: 'pre-line'
          }}
        >
          {instructions !== null ? instructions[index] : null}
        </Typography>
      </Box>
    );
  };

  return (
    <QuestionCardGameplayStyled elevation={6}>
      <BodyCardContainerStyled>
        {imageUrl === undefined ? null : (
          <QuestionImage
            src={`${CloudFrontDistributionUrl}${imageUrl}`}
            alt="Question"
          />
        )}
         <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.smPadding}px`,
            paddingLeft: `${theme.sizing.mdPadding}px`,
            paddingRight: `${theme.sizing.mdPadding}px`,
            paddingBottom: `${theme.sizing.mdPadding}px`,
          }}
        >
          {sentences.map((sentence, index) => {
            const isQuestion =
              sentence.includes('?') ||
              (!hasQuestionMark && index === sentences.length - 1);
            return (
              <Typography
                key={sentence}
                variant="body1"
                sx={{ whiteSpace: 'pre-line', fontWeight: isQuestion ? 700 : undefined }}
              >
                {sentence}
              </Typography>
            );
          })}
        </Box>
        <Box style={{ 
          width: '100%',
          paddingLeft: `${theme.sizing.mdPadding}px`,
          paddingRight: `${theme.sizing.mdPadding}px`,
          paddingBottom: `${theme.sizing.mdPadding}px`,
          boxSizing: 'border-box'
        }}>
          <Typography variant='rubikBody'> Correct Answer </Typography>
          <AnswerOptionStyled
            sx={{
              backgroundColor: theme.palette.primary.correctColor
            }}
          >
            {!isShortAnswerEnabled && 
              <Typography
                variant='rubikBodyLarge'
                sx={{
                  color: `${theme.palette.designSystem.surface.play}`,
                  marginRight: `${theme.sizing.xSmPadding}px`,
                }}
              >
                <b>{letterCode}</b>
              </Typography>
            }
            <Typography 
              variant='rubikBodyLarge' 
              sx={{
                color: `${theme.palette.designSystem.surface.play}`, 
                whiteSpace: 'pre-line'
              }}
            >
                {answerContent}
            </Typography>
          </AnswerOptionStyled>
          
          <BodyCardContainerStyled sx={{ alignItems: 'flex-start' }}>
            {instructions !== null &&
              instructions.map((instruction: string) =>
                  correctAnswerInstruction(instructions.indexOf(instruction)),
                )
            }
          </BodyCardContainerStyled>
        </Box>
      </BodyCardContainerStyled>
    </QuestionCardGameplayStyled>
  );
}