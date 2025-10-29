import React from 'react';
import { Typography, Box, styled, useTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate, CloudFrontDistributionUrl } from '@righton/networking';
import {
  QuestionTitleStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  BaseCardStyled,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ButtonCCSS } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';

interface DetailedQuestionCardUnifiedProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate | null;
}

interface CreateQuestionTitleBarStyledProps {
  screenSize: ScreenSize;
}

const CreateQuestionTitleBarStyled = styled(
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

export default function DetailedQuestionCardUnified({
  screenSize,
  question,
}: DetailedQuestionCardUnifiedProps) {
  const theme = useTheme();
  return (
    <BaseCardStyled
      elevation={6}
      isCardComplete={false}
      style={{
        maxWidth: '410px',
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
          <QuestionTitleStyled>Question</QuestionTitleStyled>
        </Box>
        <Box
          style={{
            width: 'fit-content',
            padding: `${theme.sizing.xxSmPadding}px ${theme.sizing.smPadding}px`,
            borderRadius: '12px',
            backgroundColor: `${theme.palette.primary.buttonPrimaryDefault}`,
            color: '#FFFFFF',
          }}
        >
          Public
        </Box>
      </CreateQuestionTitleBarStyled>
      <Box
        style={{
          height: '100%',
          width: '100%',
          margin: 0,
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ whiteSpace: 'pre-line' }}>
          {question?.title ?? ''}
        </Typography>
      </Box>
      <Box
        style={{
          width: '100%',
          height: 'auto',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <img
          src={`${CloudFrontDistributionUrl}${question?.imageUrl ?? ''}`}
          alt="question"
          style={{
            width: '100%',
            height: '185px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      </Box>
      <Box
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          flexWrap: 'wrap',
          marginTop: '8px',
        }}
      >
        {question?.ccss && <ButtonCCSS key={uuidv4()}>{question.ccss}</ButtonCCSS>}
      </Box>
    </BaseCardStyled>
  );
}


