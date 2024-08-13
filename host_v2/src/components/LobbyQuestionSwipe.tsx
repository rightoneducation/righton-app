
import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { IQuestion } from '@righton/networking';
import QuestionCard from './QuestionCard';
import TitleQuestionCard from './TitleQuestionCard';
import { StartEndGameScrollBoxStyled } from '../lib/styledcomponents/layout/ScrollBoxStyled';

interface QuestionListProps {
  questions: IQuestion[];
  title: string;
}

const BoxStyled = styled(Box)({
  width: '100%',
  boxSizing: 'border-box',
});

export default function QuestionList({ questions, title }: QuestionListProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <StartEndGameScrollBoxStyled>
        <BoxStyled key={uuidv4()}>
          <Box
            sx={{
              marginBottom: '0',
              borderBottom: `1px solid ${theme.palette.divider}`,
              width: '100%',
            }}
          >
          <TitleQuestionCard title ={title} questions={questions}/>          
        </Box>
        </BoxStyled>
      {questions.map((question, index) => (
        <BoxStyled key={uuidv4()}>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              width: '100%',
            }}
          >
            <QuestionCard
              questionText={question.text}
              imageUrl={question.imageUrl}
              currentQuestionIndex = {index}
                          />
          </Box>
        </BoxStyled>
      ))}
    </StartEndGameScrollBoxStyled>
  );
}
