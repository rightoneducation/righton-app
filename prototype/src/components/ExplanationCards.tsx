import { IQuestionToSave, IRegenInput } from '../lib/Models';
import { ExplanationCardContainer } from '../lib/styledcomponents/generator/StyledContainers';
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
}

export const ExplanationCards = ({
  questionToSave,
  isSubmitted, 
  selectedCards,
  setQuestionToSave,
  handleExplanationClick,
  saveDiscardExplanation,
  isQuestionSaved
}: ExplanationCardsProps) => {
  const isQuestionFilled = questionToSave.wrongAnswers.length > 0;
  return (
    <ExplanationCardContainer isQuestionFilled={isQuestionFilled}> 
      {questionToSave.wrongAnswers.length === 0 
      ?
        <>
          <PlaceholderHeaderStyled>💡 Explanations Awaiting...</PlaceholderHeaderStyled>
          <PlaceholderBodyStyled> Fill out all fields to generate AI-powered explanations. </PlaceholderBodyStyled>
        </>
      : questionToSave.wrongAnswers.length > 0 && questionToSave.wrongAnswers.map((explanation, index) => {
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
          />
        )
      })}
    </ExplanationCardContainer>
  );
};