import {
  isNullOrUndefined,
  GameSessionState,
  ConfidenceLevel,
} from '@righton/networking';
/*
 * counts all answers for current question using isChosen, for use in footer progress bar
 * @param {array} answerArray - array of answers for current question
 * @returns {number} count - number of answers for current question
 */
export const getTotalAnswers = (answerArray) => {
  return answerArray ? answerArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) : 0;
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
export const extractAnswers = (teamsArray, currentState, currentQuestionId) => {
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

/*
 * returns an array of which team names picked which question choices
 * @param {array} teamsArray - array of teams
 * @param {number} currentQuestionIndex - index of current question
 * @param {array} choices - array of choices for current question
 * @returns {array} teamsPickedChoices - array of objects containing corresponding team names and choice texts
 */
export const getTeamByQuestion = (
  teamsArray,
  currentQuestionIndex,
  choices,
  questions,
  currentState,
) => {
  const teamsPickedChoices = [];
  const currentQuestionId = questions[currentQuestionIndex].id;
  const answers = extractAnswers(teamsArray, currentState, currentQuestionId);
  answers.forEach(({team, answer}) => {
    let isNoResponse = true;
    choices && choices.forEach(choice => {
      if (answer.text === choice.text){
        isNoResponse = false;
        teamsPickedChoices.push({
          teamName: team.name,
          choiceText: choice.text
        });
      }
    });

    if (isNoResponse) {
      teamsPickedChoices.push({
        teamName: team.name,
        choiceText: 'No response'
      });
    }
  });
  return teamsPickedChoices;
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
export const getAnswersByQuestion = (
  choices,
  teamsArray,
  currentQuestionIndex,
  questions,
  currentState,
) => {
  // create this to use as an index reference for the confidence levels to avoid find/findIndex
  const confidenceLevelsArray = Object.values(ConfidenceLevel);
  let confidenceArray = Object.keys(ConfidenceLevel).map((key) => {
    return {
      confidence: ConfidenceLevel[key],
      correct: 0,
      incorrect: 0,
      players: [],
    };
  });
  if (
    teamsArray.length !== 0 &&
    questions &&
    choices &&
    Object.keys(teamsArray[0]).length !== 0 &&
    Object.getPrototypeOf(teamsArray[0]) === Object.prototype
  ) {
    let choicesTextArray = choices.map(choice => choice.text);
    let answersArray = new Array(choices.length).fill(0);
    let currentQuestionId = questions[currentQuestionIndex].id;
    const answers = extractAnswers(teamsArray, currentState, currentQuestionId);

    answers.forEach(({ team, answer }) => {
      choices.forEach((choice) => {
        if (answer.text === choice.text) {
          answersArray[
            choicesTextArray.indexOf(choice.text)
          ] += 1;
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
          } else {
            confidenceArray[index].incorrect += 1;
            confidenceArray[index].players.push({
              name: team.name,
              answer: choice.text,
              isCorrect: false,
            });
          }
        }
      });
    });
    return { answersArray, confidenceArray };
  }
  return { answersArray: [], confidenceArray };
};
