import React from 'react';
import { useTheme, styled} from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GameSessionState, CloudFrontDistributionUrl } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import { BodyCardStyled } from '../lib/styledcomponents/BodyCardStyled';

interface QuestionCardProps {
  questionText: string;
  imageUrl: string | undefined;
  currentQuestionIndex: number;
  currentState?: GameSessionState;
}

export default function QuestionCard({
  questionText,
  imageUrl,
  currentQuestionIndex,
  currentState
}: QuestionCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled style={{alignItems: 'center'}}>
        <Typography variant="h1" style={{color: theme.palette.designSystem.surface.host, textAlign: 'left', width: '100%'}}>
        {`${t('gamesession.questionCard.title')} ${currentQuestionIndex + 1}`}       
        </Typography>
        {imageUrl === undefined ? null : (
          <img
            style={{
              width: '75%',
              height: 'auto',
            }}
            src={`${CloudFrontDistributionUrl}${imageUrl}`}
            alt="Question"
          />
        )}
        <Typography variant="paragraph" style={{color: theme.palette.designSystem.surface.play }}> 
          {questionText} 
        </Typography>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
