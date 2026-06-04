import React from 'react';
import { useTheme, styled} from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GameSessionState, CloudFrontDistributionUrl } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import QuestionCardStyled from '../lib/styledcomponents/QuestionCardGameplayStyled';

interface QuestionCardProps {
  questionText: string;
  imageUrl: string | undefined;
  currentQuestionIndex: number;
  currentState?: GameSessionState;
}

const QuestionImage = styled('img')({
  width: '100%',
  height: '186px',
  minHeight: '186px',
  objectFit: 'cover',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
});

export default function QuestionCardFullBleed({
  questionText,
  imageUrl,
  currentQuestionIndex,
  currentState
}: QuestionCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();

  // Split into sentences at terminator-then-whitespace so decimals/currency
  const sentences = questionText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
  // The question is any sentence containing '?'; if none has one, bold the last.
  const hasQuestionMark = sentences.some((sentence) => sentence.includes('?'));

  return (
    <QuestionCardStyled elevation={10}>
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
      </BodyCardContainerStyled>
    </QuestionCardStyled>
  );
}