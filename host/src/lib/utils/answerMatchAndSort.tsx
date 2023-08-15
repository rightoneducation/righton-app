import {
  isNullOrUndefined,
  ApiClient,
  IGameSession,
} from '@righton/networking';

interface SortedAnswer {
  answer: string, 
  count: number
}

/**
 * This function is called when a new answer is received
 * It receives this answer and the current list of answers
 * It attempts to find equality with an existing answer
 * If it finds equality, it increases the count of that answer
 * If it does not find equality, it adds the new answer to the list
 * It then sorts the list by count and returns the new list
 * @param {SortedAnswer[]} sortedAnswers
 * @param {string} newAnswer
 * @returns {string[]}
**/

export default function answerMatchAndSort(
  sortedAnswers: SortedAnswer[],
  newAnswer: string,
) {

  const equalityCheck = (answer: SortedAnswer, newAnswer: string) => {
    
    return answer.answer === newAnswer;
  }

  if (!isNullOrUndefined(newAnswer)) {
    // Equality check
    sortedAnswers.map((answer) => {
      if (equalityCheck(answer, newAnswer)) {
        answer.count++;
      }
    })

  }
  return sortedAnswers;
};