import React from 'react';
import { Typography, RadioGroup } from '@mui/material';
import { IQuestionTemplate } from '@righton/networking';
import {
  BaseCardStyled,
  TitleBarStyled,
  QuestionTitleStyled,
  RadioContainerStyled,
  RadioLabelStyled,
  RadioStyled,
  ContentContainerStyled,
  ImageStyled,
  ContentRightContainerStyled,
  TextContainerStyled,
  CCSSIndicator
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import image from '../../../images/RightOnLogo.png';

interface DetailedQuestionCardBaseProps {
  question: IQuestionTemplate;
}

export default function DetailedQuestionCardBase(
  {
    question
  } : DetailedQuestionCardBaseProps
) {
  const [questionType, setQuestionType] = React.useState<string>('A'); 
  console.log(questionType);
  const handleQuestionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionType((event.target as HTMLInputElement).value);
  }

  return (
    <BaseCardStyled>
      <TitleBarStyled>
        <QuestionTitleStyled>
          Question
        </QuestionTitleStyled>
        <RadioContainerStyled>
          <RadioGroup
            row
            value={questionType}
            onChange={handleQuestionTypeChange}
          >
            <RadioLabelStyled
              value="A"
              control={<RadioStyled />}
              label='Multiple Choice'
              isSelected={questionType === 'A'}
            />
            <RadioLabelStyled
              value="B"
              control={<RadioStyled />}
              label='Short Answer'
              isSelected={questionType === 'B'}
            />
          </RadioGroup>
        </RadioContainerStyled>
      </TitleBarStyled>
      <ContentContainerStyled>
        <ImageStyled src={question.imageUrl ?? ''} alt="image" />
        <ContentRightContainerStyled>
          <TextContainerStyled> 
            <Typography>
              {question.title}
            </Typography>
          </TextContainerStyled>
          <CCSSIndicator>
            {`${question.grade}.${question.domain}.${question.cluster}.${question.standard}`}
          </CCSSIndicator>
        </ContentRightContainerStyled>      
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}