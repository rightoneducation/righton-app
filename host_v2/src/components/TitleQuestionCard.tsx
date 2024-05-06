import React from 'react';
import { useTheme, styled} from '@mui/material/styles';
import { Typography, Paper, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IQuestion } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface TitleQuestionCardProps {
  title: string;
  questions: IQuestion[];

}

const TitleBoxStyled = styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '8px',
    // height: '95px',
    borderRadius: '18px',
    padding: '16px 18px 20px 18px',
    gap: '2px',
    boxShadow: '0px 4px 10px 0px #0F1B28 30%',
  })
  const TitleBoxTopStyled = styled(Box)({
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  })

const TitleTypography = styled(Typography)({
  fontFamily: 'Poppins',
    width: '100%', 
    // height: '42px', probably keep this out
  textAlign: 'left', 
  fontWeight: '700', 
  fontSize: '14px',
  lineHeight: '21px',
  color: '#384466',
})
const TopLineTypography = styled(Typography)({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '12px',
  letterSpacing: '.15em',
  color: '#9BA9D0',
})
export default function TitleQuestionCard({
    title,
    questions,
}: TitleQuestionCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <TitleBoxStyled>
        <TitleBoxTopStyled>
            <TopLineTypography>
                7.RP.A.3
            </TopLineTypography>
            <TopLineTypography>
                5 Questions
            </TopLineTypography>
        </TitleBoxTopStyled>
        <TitleTypography>{title}</TitleTypography>
    </TitleBoxStyled>
  );
}
