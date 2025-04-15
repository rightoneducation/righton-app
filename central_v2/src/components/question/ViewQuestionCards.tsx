import React from 'react';
import {
  Grid,
  Box,
  useTheme,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IQuestionTemplate } from '@righton/networking';
import {
  ScreenSize,
  CardType
} from '../../lib/CentralModels';
import DetailedQuestionCardBase from '../cards/detailedquestion/DetailedQuestionCardBase';
import DetailedQuestionSubCard from '../cards/detailedquestion/DetailedQuestionSubCard';
import OwnerTag from '../profile/OwnerTag';
import { 
  DetailedQuestionContainer, 
  CardContainer,
  SubCardGridItem
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

interface ViewQuestionsProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate;
  isViewGame: boolean;
}

export default function ViewQuestionCards({
  screenSize,
  question,
  isViewGame
}: ViewQuestionsProps) {
  const theme = useTheme();
 
  return (
    <CardContainer>
    {screenSize !== ScreenSize.LARGE &&
      <OwnerTag isViewGame={isViewGame} screenSize={screenSize}/>
    }
    <DetailedQuestionContainer
      container
    >
      <Grid
        sm
        md
        item
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        {screenSize === ScreenSize.LARGE &&
          <OwnerTag isViewGame={isViewGame} screenSize={screenSize}/>
        }
      </Grid>
      <Grid
        sm={12}
        item
        style={{
          width: '100%',
          maxWidth: '672px',
          display: 'flex',
          flexDirection: 'column',
          gap: `${theme.sizing.smPadding}px`,
        }}
      >
        <DetailedQuestionCardBase dropShadow screenSize={screenSize} question={question} />
        <Grid
          container
          spacing={`${theme.sizing.smPadding}px`}
        >
          <SubCardGridItem 
            item
            sm={12}
            md={6}
          >
            <DetailedQuestionSubCard
              cardType={CardType.CORRECT}
              answer={
                question?.choices?.find((answer) => answer.isAnswer)
                  ?.text ?? ''
              }
              instructions={question?.instructions ?? []}
            />
          </SubCardGridItem>
          <SubCardGridItem
            item
            sm={12}
            md={6}
          >
            {question &&
              question.choices
                ?.filter((choice) => !choice.isAnswer)
                .map((choice, index) => (
                  <DetailedQuestionSubCard
                    key={uuidv4()}
                    cardType={CardType.INCORRECT}
                    answer={choice.text}
                    answerReason={choice.reason}
                  />
                ))}
          </SubCardGridItem>
        </Grid>
      </Grid>
      <Grid sm md item />
    </DetailedQuestionContainer>
    </CardContainer>
  )
}


