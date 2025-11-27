import React from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate, CentralQuestionTemplateInput } from '@righton/networking';
import { ScreenSize, CardType } from '../../lib/CentralModels';
import DetailedUnifiedQuestionCardBase from './DetailedUnifiedQuestionCardBase';
import DetailedQuestionSubCard from '../cards/detailedquestion/DetailedQuestionSubCard';
import OwnerTag from '../profile/OwnerTag';
import {
  DetailedQuestionContainer,
  CardContainer,
  SubCardGridItem,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

interface CreateQuestionCardUnifiedProps {
  screenSize: ScreenSize;
  question: CentralQuestionTemplateInput;
  questionTemplate: IQuestionTemplate | null;
  handleRemoveQuestion: () => void;
  isViewGame: boolean;
  isCreateGame?: boolean;
  isUserCreated: boolean;
}

export default function CreateQuestionCardUnified({
  screenSize,
  question,
  questionTemplate,
  handleRemoveQuestion,
  isViewGame,
  isCreateGame,
  isUserCreated,
}: CreateQuestionCardUnifiedProps) {
  const theme = useTheme();
  console.log("Question: ", question)
  return (
    <CardContainer sx={{ overflowY: 'visible', paddingTop: '0px'}}>
      <DetailedUnifiedQuestionCardBase
        isCreateGame={isCreateGame}
        isUserCreated={isUserCreated}
        handleRemoveQuestion={handleRemoveQuestion}
        dropShadow
        screenSize={screenSize}
        question={question}
        questionTemplate={questionTemplate}
      />
    </CardContainer>
  );
}
