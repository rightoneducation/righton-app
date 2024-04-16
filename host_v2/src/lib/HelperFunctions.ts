import { ShortAnswerResponse, Mistake } from './HostModels';
import { ConfidenceLevel, IQuestion, isNullOrUndefined} from '@righton/networking';

export const sortMistakes = (
  shortAnswerResponses: ShortAnswerResponse[],
  totalAnswers: number,
  isPopularMode: boolean,
  numOfPopularMistakes: number,
): Mistake[] => {
  // eslint-disable-line
  const extractedMistakes: Mistake[] = shortAnswerResponses
   .filter(shortAnswerResponse => !shortAnswerResponse.isCorrect)
   .map(shortAnswerResponse => ({ 
     answer: shortAnswerResponse.rawAnswer, 
     percent: Math.round((shortAnswerResponse.count / totalAnswers) * 100), 
     isSelected: shortAnswerResponse.isSelectedMistake ?? false
   }));
  const orderedMistakes = extractedMistakes.sort((a, b) => b.percent - a.percent);
  if (isPopularMode) {
    orderedMistakes.forEach((mistake, index) => {
      if (index < numOfPopularMistakes)
        mistake.isSelected = true; // eslint-disable-line
      else mistake.isSelected = false; // eslint-disable-line
    });
  }
  return orderedMistakes;
};

export const getQuestionChoices = (
  questions: IQuestion[] | null | undefined,
  currentQuestionIndex: number
): any[] | null => {
  if (
    isNullOrUndefined(questions) ||
    questions.length <= currentQuestionIndex ||
    isNullOrUndefined(questions[currentQuestionIndex]?.choices)
  ) {
    return null;
  }
  return questions[currentQuestionIndex]?.choices ?? [];
};

const createBlankConfidenceArray = (): { confidence: ConfidenceLevel; correct: number; incorrect: number; players: { name: string; answer: string; isCorrect: boolean; }[] }[] => {
  return Object.keys(ConfidenceLevel).map((key) => {
    return {
      confidence: ConfidenceLevel[key as keyof typeof ConfidenceLevel],
      correct: 0,
      incorrect: 0,
      players: [],
    };
  });
};
