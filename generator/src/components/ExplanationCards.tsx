import { Box, CircularProgress } from '@mui/material';
import { IQuestionToSave, IRegenInput } from '../lib/Models';
import { EmptyExplanationCardContainer, ExplanationCardContainer } from '../lib/styledcomponents/generator/StyledContainers';
import { PlaceholderHeaderStyled, PlaceholderBodyStyled } from '../lib/styledcomponents/generator/StyledTypography';
import ExplanationCard from './ExplanationCard';

interface ExplanationCardsProps {
  questionToSave: IQuestionToSave
  isSubmitted: boolean;
  selectedCards: boolean[];
  setQuestionToSave: (questionToSave: IQuestionToSave) => void;
  handleExplanationClick: (input: IRegenInput) => void;
  saveDiscardExplanation: (
    question: string, selectedExplanation: string
  ) => void;
  isQuestionSaved: boolean;
  isQuestionGenerating: boolean;
  isExplanationRegenerating: boolean;
  regenIndex: null | number;
}

export const ExplanationCards = ({
  questionToSave,
  isSubmitted, 
  selectedCards,
  setQuestionToSave,
  handleExplanationClick,
  saveDiscardExplanation,
  isQuestionSaved,
  isQuestionGenerating,
  isExplanationRegenerating,
  regenIndex
}: ExplanationCardsProps) => {
  const isQuestionFilled = questionToSave.wrongAnswers.length > 0;
  return (
    <>
      {!isQuestionFilled
      ?
        <EmptyExplanationCardContainer>
          <PlaceholderHeaderStyled>💡 Explanations Loading...</PlaceholderHeaderStyled>
          <PlaceholderBodyStyled> Fill out all fields to generate AI-powered explanations. </PlaceholderBodyStyled>
          { isQuestionGenerating && 
            <CircularProgress style={{color: "#FFF"}}/>
          }
        </EmptyExplanationCardContainer>
      : <ExplanationCardContainer>  
        {isQuestionFilled && questionToSave.wrongAnswers.map((explanation, index) => {
          return (
            <ExplanationCard
              index={index}
              questionToSave={questionToSave}
              isSubmitted={isSubmitted}
              explanation={explanation}
              selectedCards={selectedCards}
              setQuestionToSave={setQuestionToSave}
              handleExplanationClick={handleExplanationClick}
              saveDiscardExplanation={saveDiscardExplanation}
              isQuestionSaved={isQuestionSaved}
              isRegenerating={isExplanationRegenerating && regenIndex === index}
            />
          )
        })}
      </ExplanationCardContainer>
      }
    
    </>
  );
};