import React from 'react';
import { Typography, Box, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { CloudFrontDistributionUrl } from '@righton/networking';
import QuestionCardStyled from '../lib/styledcomponents/QuestionCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface QuestionCardProps {
  questionText: string;
  imageUrl: string;
}

const QuestionImage = styled('img')({
  width: '100%',
  height: '186px',
  minHeight: '186px',
  objectFit: 'cover',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
});

export default function QuestionCard({
  questionText,
  imageUrl,
}: QuestionCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  // Split into sentences at terminator-then-whitespace so decimals/currency
  // (e.g. "3.5") aren't broken up. Trim and drop any empties.
  const sentences = questionText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
  // The question is any sentence containing '?'; if none has one, bold the last.
  const hasQuestionMark = sentences.some((sentence) => sentence.includes('?'));

  return (
    <QuestionCardStyled elevation={10}>
      <BodyCardContainerStyled>
        <QuestionImage
          src={`${CloudFrontDistributionUrl}${imageUrl}`}
          alt="Question"
        />
        {/* One Typography per sentence so the question sentence can be bolded on its own line */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${theme.sizing.xSmPadding}px`,
            padding: `${theme.sizing.mdPadding}px`,
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
