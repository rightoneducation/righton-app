import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import RichTextField from './RichTextEditor/RichTextEditor';

interface AnswerCardProps {
  answers: { text: string; isCorrectAnswer: boolean }[] | undefined;
  isSubmitted: boolean;
  handleSubmitAnswer: (answerText: string) => void;
  selectedAnswer: number | null;
}

export default function AnswerCard({
  answers,
  isSubmitted,
  handleSubmitAnswer,
  selectedAnswer,
}: AnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [contents, setContents] = useState('');
  console.log(contents);

  return (
    <BodyCardStyled elevation={10} >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'left' }}>
           Enter Your Answer
         </Typography> 
        <RichTextField contents={contents} setContents={setContents} />
        <ButtonSubmitAnswer
          isSubmitted={isSubmitted}
          answer={contents}
          handleSubmitAnswer={handleSubmitAnswer}
          isSelected={!isNullOrUndefined(contents)}
        />
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
