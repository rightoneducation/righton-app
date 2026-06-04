import React from 'react';
import { useTheme, styled} from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GameSessionState, CloudFrontDistributionUrl } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import QuestionCardStyled from '../lib/styledcomponents/QuestionCardStyled';

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

const TextContainer = styled(Typography)(({theme}) => {
  return {
    paddingTop: `${theme.sizing.smPadding}px`,
    paddingLeft: `${theme.sizing.mdPadding}px`,
    paddingRight: `${theme.sizing.mdPadding}px`,
    paddingBottom: `${theme.sizing.mdPadding}px`,
    whiteSpace: 'pre-line'
  }
})

export default function QuestionCardFullBleed({
  questionText,
  imageUrl,
  currentQuestionIndex,
  currentState
}: QuestionCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <QuestionCardStyled elevation={10}>
      <BodyCardContainerStyled>
        {imageUrl === undefined ? null : (
          <QuestionImage
            src={`${CloudFrontDistributionUrl}${imageUrl}`}
            alt="Question"
          />
        )}
        <TextContainer variant="paragraph" > 
          {questionText} 
        </TextContainer>
      </BodyCardContainerStyled>
    </QuestionCardStyled>
  );
}
