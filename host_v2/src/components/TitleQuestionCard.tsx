
import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Paper, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IQuestion } from '@righton/networking';
import TitleCCSS from './TitleCCSS';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface TitleQuestionCardProps {
  title: string;
  questions: {
    text: string;
    grade: string;
    domain: string;
    cluster: string;
    standard: string;
    imageUrl: string;
  }[];
}

const TitleBoxStyled = styled(Paper)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '18px',
  marginLeft: `${theme.sizing.xSmPadding}px`,
  marginRight: `${theme.sizing.xSmPadding}px`,
  padding: '16px 18px 20px 18px',
  gap: '2px',
  boxShadow: '0px 4px 10px 0px rgba(15, 27, 40, 0.3)',
}));

const TitleBoxTopStyled = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const TitleTypography = styled(Typography)({
  fontFamily: 'Poppins',
  width: '100%', 
  textAlign: 'left', 
  fontWeight: '700', 
  fontSize: '14px',
  lineHeight: '21px',
  color: '#384466',
});

const TopLineTypography = styled(Typography)({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: '12px',
  letterSpacing: '.15em',
  color: '#9BA9D0',
});


export default function TitleQuestionCard({
    title,
    questions,
  }: TitleQuestionCardProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    if (questions.length === 0) {
      return (
        <TitleBoxStyled>
          <TitleTypography>{title}</TitleTypography>
          <TopLineTypography>No questions available</TopLineTypography>
        </TitleBoxStyled>
      );
    }
    const firstQuestion = questions[0];
    const { grade, domain, cluster, standard } = firstQuestion;
  
    return (
      <TitleBoxStyled>
        <TitleBoxTopStyled>
            <TitleCCSS
            key={`${grade}-${domain}-${cluster}-${standard}`}
            grade={grade}
            domain={domain}
            cluster={cluster}
            standard={standard}
            />
          <TopLineTypography>
            {questions.length} Questions
          </TopLineTypography>
        </TitleBoxTopStyled>  
        <TitleTypography>{title}</TitleTypography>      
      </TitleBoxStyled>
    );
  }
  