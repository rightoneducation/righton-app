import React from 'react';
import { useTheme, styled} from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface QuestionCardProps {
  questionText: string;
  imageUrl: string | undefined;
  index: number;
}
const TitleTypography = styled(Typography)({
  width: '100%', 
  textAlign: 'left', 
  fontFamily: 'Poppins',
  fontWeight: '700', 
  fontSize: '24px',
  lineHeight: '36px',
})
const BodyTypography = styled(Typography)({
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '19px',
  color: '#384466',
})
export default function QuestionCard({
  questionText,
  imageUrl,
  index,
}: QuestionCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled>
        <TitleTypography>
          {t('Question ')} {index + 1}         
        </TitleTypography>
        {imageUrl === undefined ? null : (
          <img
            style={{
              width: '75%', // this value was here before, so we're keeping it. (not found on figma)
              height: 'auto',

            }}
            src={imageUrl}
            alt="Question"
          />
        )}
        <BodyTypography> 
          {questionText} 
        </BodyTypography>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
