import { ShortAnswerResponse, Mistake } from "./HostModels";

export const sortMistakes = (shortAnswerResponses: ShortAnswerResponse[], totalAnswers: number, isPopularMode: boolean, numOfPopularMistakes: number): Mistake[] => { // eslint-disable-line
  const extractedMistakes: Mistake[] = shortAnswerResponses
   .filter(shortAnswerResponse => !shortAnswerResponse.isCorrect)
   .map(shortAnswerResponse => ({ 
     answer: shortAnswerResponse.rawAnswer, 
     percent: Math.round((shortAnswerResponse.count / totalAnswers) * 100), 
     isSelected: shortAnswerResponse.isSelectedMistake ?? false
   }));
  // console.log("helper function extractedmistakes below")
  // console.log(extractedMistakes)
  const orderedMistakes = extractedMistakes.sort((a, b) => b.percent - a.percent);
  if (isPopularMode) {
    console.log(extractedMistakes)
    orderedMistakes.forEach((mistake, index) => {
      if (index < numOfPopularMistakes)
        mistake.isSelected = true; // eslint-disable-line
      else
        mistake.isSelected = false; // eslint-disable-line
    });
  }
  return(orderedMistakes);
}