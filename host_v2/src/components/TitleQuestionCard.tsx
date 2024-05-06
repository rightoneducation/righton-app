import React from 'react';
import { useTheme, styled} from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface TitleQuestionCardProps {
  title: string;

}
const TitleTypography = styled(Typography)({
  width: '100%', 
  textAlign: 'left', 
  fontWeight: '700', 
  fontSize: '24px'
})
const BodyTypography = styled(Typography)({
  fontFamily: 'Rubik',
  fontWeight: '400',
  fontSize: '16px',
})
export default function TitleQuestionCard({
    title
}: TitleQuestionCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled>
        <BodyTypography>{title}</BodyTypography>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
