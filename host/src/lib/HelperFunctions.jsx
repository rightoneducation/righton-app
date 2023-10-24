import {
  isNullOrUndefined,
  GameSessionState,
  ConfidenceLevel,
  AnswerType,
} from '@righton/networking';
import { parse, evaluate } from 'mathjs';
/*
 * counts all answers for current question using isChosen, for use in footer progress bar
 * @param {array} answerArray - array of answers for current question
 * @returns {number} count - number of answers for current question
 */
export const getTotalAnswers = (answerArray) => {
  console.log(answerArray);
  return answerArray 
    ? answerArray.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)
    : 0;
};

/*
 * returns the choices object for an individual question
 * @param {array} questions - array of questions
 * @param {number} currentQuestionIndex - index of current question
 * @returns {array} choices - array of choices for current question
 */
export const getQuestionChoices = (questions, currentQuestionIndex) => {
  if (
    isNullOrUndefined(questions) ||
    questions.length <= currentQuestionIndex ||
    isNullOrUndefined(questions[currentQuestionIndex].choices)
  ) {
    return null;
  }
  return questions[currentQuestionIndex].choices;
};

/*
* returns team and answer data for each answer
* for use in getTeamByQuestion and getAnswersByQuestion, below
* @param {array} teamsArray - array of teams
* @param {number} currentState - current state of game
* @param {number} currentQuestionId - id of current question
* @returns {array} results - array of objects containing corresponding team and answer data
*/
export const extractAnswers =  (teamsArray, currentState, currentQuestionId) => {
  let results = [];
  teamsArray.forEach(team => {
    team.teamMembers && team.teamMembers.forEach(teamMember => {
      teamMember.answers && teamMember.answers.forEach(answer => {
        if (answer.questionId === currentQuestionId) {
          const isGameInPhaseOne = (
            currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ||
            currentState === GameSessionState.PHASE_1_DISCUSS
          ) && answer.isChosen;
          const isGameInPhaseTwo = (
            currentState === GameSessionState.PHASE_2_DISCUSS ||
            currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER
          ) && answer.isTrickAnswer;
          if (isGameInPhaseOne || isGameInPhaseTwo) {
            results.push({team, answer});
          }
        }
      });
    });
  });
  return results;
};

const createBlankConfidenceArray = () => { 
  return Object.keys(ConfidenceLevel).map((key) => {
    return {
      confidence: ConfidenceLevel[key],
      correct: 0,
      incorrect: 0,
      players: [],
    };
  });
};
/*
 * returns an array ordered to match the order of answer choices, containing the total number of each answer
 * @param {array} choices - array of choices for current question
 * @param {array} teamsArray - array of teams
 * @param {number} currentQuestionIndex - index of current question
 * @returns {array} answersArray - ordered array of total number of each answer
 * confidenceArray interface:
 * confidenceArray {
 *   confidence: ConfidenceLevel,
 *   correct: number,
 *   incorrect: number,
 *   players: [{
 *     name: string,
 *     answer: string,
 *     isCorrect: boolean
 *   }]
 * }
 */
export const getMultiChoiceAnswers = (
  choices,
  teamsArray,
  currentQuestionIndex,
  questions,
  currentState,
  correctChoiceIndex
) => {
  // create this to use as an index reference for the confidence levels to avoid find/findIndex
  const confidenceLevelsArray = Object.values(ConfidenceLevel);
  let confidenceArray = createBlankConfidenceArray();
  if (
    teamsArray.length !== 0 &&
    questions &&
    choices &&
    Object.keys(teamsArray[0]).length !== 0 &&
    Object.getPrototypeOf(teamsArray[0]) === Object.prototype
  ) {
    let choicesTextArray = choices.map(choice => choice.text);
    let answersArray = Array.from({length: choices.length}, (item, index) => ({ count: 0, teams: [], isCorrect: index === correctChoiceIndex-1 ? true : false }));
    let currentQuestionId = questions[currentQuestionIndex].id;
    const answers = extractAnswers(teamsArray, currentState, currentQuestionId);
    answers.forEach(({ team, answer }) => {
      choices.forEach((choice) => {
        if (answer.answerContent.rawAnswer === choice.text) {
          const index = confidenceLevelsArray.indexOf(
            answer.confidenceLevel,
          );
          if (choice.isAnswer) {
            confidenceArray[index].correct += 1;
            confidenceArray[index].players.push({
              name: team.name,
              answer: choice.text,
              isCorrect: true,
            });
            answersArray[
              choicesTextArray.indexOf(choice.text)
            ].isCorrect = true;
          } else {
            confidenceArray[index].incorrect += 1;
            confidenceArray[index].players.push({
              name: team.name,
              answer: choice.text,
              isCorrect: false,
            });
          }
          answersArray[
            choicesTextArray.indexOf(choice.text)
          ].count += 1;
          answersArray[choicesTextArray.indexOf(choice.text)].teams.push(team.name);
        }
      });
    });
    return { answersArray, confidenceArray };
  }
  return { answersArray: [], confidenceArray };
};

export const getShortAnswers = (shortAnswerResponses) => {
  // create this to use as an index reference for the confidence levels to avoid find/findIndex
  const confidenceLevelsArray = Object.values(ConfidenceLevel);
  let confidenceArray = createBlankConfidenceArray();
  if (shortAnswerResponses && shortAnswerResponses.length > 0) {
    shortAnswerResponses.forEach((answer) => {
      if (answer.teams){
        answer.teams.forEach((team) => {
          console.log(team);
          const index = confidenceLevelsArray.indexOf(team.confidence);
          if (answer.isCorrect) {
            confidenceArray[index].correct += 1;
            confidenceArray[index].players.push({
              name: team.team,
              answer: answer.value,
              isCorrect: true,
            });
          } else {
            confidenceArray[index].incorrect += 1;
            confidenceArray[index].players.push({
              name: team.team,
              answer: answer.value,
              isCorrect: false,
            });
          }
        });
      }
    });
    return { answersArray: shortAnswerResponses, confidenceArray};
  };
  return { answersArray: [], confidenceArray };
};

export const determineAnswerType = (answer) => {
  // check if answer is numeric
  if (
    typeof(answer) === 'number' || 
    typeof(answer) === "string" && 
    answer.trim() !== ''
    && !isNaN(answer)
  ) 
    return AnswerType.NUMBER; 
  // check if answer is an expression
  try {
    // if the answer contains mathematical operators and mathjs can parse the answer, it's an expression
    const expRegex = /[+\-*/^().]/;
    if (expRegex.test(answer) && parse(answer))
      return AnswerType.EXPRESSION;
    return AnswerType.STRING;
  } catch {
    // if the parse fails, the answer is a string
    return AnswerType.STRING;
  }
};

export const checkEqualityWithPrevAnswer = (normValue, prevAnswerValue, prevAnswerType) => {
  switch (prevAnswerType){
    case AnswerType.STRING: // string
    default: 
      return normValue.includes(prevAnswerValue);
    case AnswerType.EXPRESSION: // expression
      try { 
        return evaluate(normValue) === evaluate(prevAnswerValue);
      } catch {
        return false;
      }
    case AnswerType.NUMBER: // number
      return normValue === Number(prevAnswerValue);
  }
};

export const checkEqualityWithOtherAnswers = (normValue, normType, prevAnswer) => {
  // loop through each of the normalized answers in each of the previous answers
  for (let i = 0; i < prevAnswer.normAnswer.length; i++) {
      if (normType === prevAnswer.normAnswer[i].type && checkEqualityWithPrevAnswer(normValue, prevAnswer.normAnswer[i].value, prevAnswer.normAnswer[i].type)) {
        return true;
      }
  };
  return false;
}

export const buildShortAnswerResponses = (prevShortAnswer, choices, newAnswer, newAnswerTeamName) => {
  if (prevShortAnswer.length === 0) {
    const correctAnswer = choices.find(choice => choice.isAnswer).text;
    const correctAnswerType = determineAnswerType(correctAnswer);

    prevShortAnswer.push({
      value: correctAnswer,
      isCorrect: true,
      normAnswer: [{
        value: correctAnswer,
        type: correctAnswerType,
      }],
      count: 0,
      teams: [],
    });
  }

  let isExistingAnswer = false;
  outerloop:
  // for each normalized answer in the newly submitted answer
  for (let i = 0; i < newAnswer.answerContent.normAnswer.length; i++) {
    const answer = newAnswer.answerContent.normAnswer[i];
    // for each answer in the previous short answer array 
    for (let y = 0; y < prevShortAnswer.length; y++) {
      if (checkEqualityWithOtherAnswers(answer.value, answer.type, prevShortAnswer[y])) {
        isExistingAnswer = true;
        prevShortAnswer[y].count += 1;
        prevShortAnswer[y].teams.push({team: newAnswerTeamName, confidence: newAnswer.confidenceLevel});
        break outerloop;
      }
    };
  };
      
  if (!isExistingAnswer){
    prevShortAnswer.push({
      value: newAnswer.answerContent.rawAnswer,
      normAnswer: newAnswer.answerContent.normAnswer,
      isCorrect: false,
      count: 1,
      teams: [{team: newAnswerTeamName, confidence: newAnswer.confidenceLevel}]
    });
  }
  return prevShortAnswer;
};


export const buildVictoryDataObject = ( 
  answers, 
  questionChoices,
  noResponseObject
  ) => {

  if (!isNullOrUndefined(answers.answersArray)){
    return [
      noResponseObject,
      ...Object.keys(answers.answersArray).map((key, index) => ({
        answerCount: answers.answersArray[index].count,
        answerChoice: String.fromCharCode(65 + index),
        answerText: questionChoices[index].text,
        answerTeams: answers.answersArray[index].teams,
        answerCorrect: answers.answersArray[index].isCorrect
      })).reverse(),
    ];
  }
  return [];
}

export const buildVictoryDataObjectShortAnswer = (
  shortAnswerResponses, 
  noResponseObject
) => {
  return [
    noResponseObject,
    ...shortAnswerResponses
      .filter(answer => answer.count > 0)
      .map((answer, index) => ({ 
        answerChoice: String.fromCharCode(65 + index),
        answerCount: answer.count,
        answerText: answer.value,
        answerTeams: answer.teams,
        answerCorrect: answer.isCorrect
    }))
  ]
};