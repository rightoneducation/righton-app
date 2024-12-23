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
  CCSSIndicator,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';

interface DetailedQuestionCardBaseProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate;
}

export default function DetailedQuestionCardBase({
  screenSize,
  question,
}: DetailedQuestionCardBaseProps) {
  const [questionType, setQuestionType] = React.useState<string>('A');
  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };

  return (
    <BaseCardStyled>
      <TitleBarStyled>
        <QuestionTitleStyled>Question</QuestionTitleStyled>
        <RadioContainerStyled>
          <RadioGroup row value={questionType} style={{overflow: 'hidden', flexWrap: 'nowrap'}}>
            <RadioLabelStyled
              value="A"
              control={<RadioStyled />}
              label={screenSize === ScreenSize.SMALL ? "M.C." : "Multiple Choice"}
              isSelected={questionType === 'A'}
            />
            <RadioLabelStyled
              value="B"
              control={<RadioStyled />}
              label={screenSize === ScreenSize.SMALL ? "S.A." : "Short Answer"}
              isSelected={questionType === 'B'}
            />
          </RadioGroup>
        </RadioContainerStyled>
      </TitleBarStyled>
      <ContentContainerStyled screenSize={screenSize}>
        <ImageStyled src={question.imageUrl ?? ''} alt="image" />
        <ContentRightContainerStyled>
          <TextContainerStyled>
            <Typography>{question.title}</Typography>
          </TextContainerStyled>
          <CCSSIndicator>
            {question.ccss}
          </CCSSIndicator>
        </ContentRightContainerStyled>
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}
