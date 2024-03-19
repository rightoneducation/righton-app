import {
  isNullOrUndefined,
  GameSessionState,
  ConfidenceLevel,
  AnswerFactory,
  NumericAnswer,
  StringAnswer,
  ExpressionAnswer,
  AnswerType
} from '@righton/networking';

/*
 * counts all answers for current question using isChosen, for use in footer progress bar
 * @param {array} answerArray - array of answers for current question
 * @returns {number} count - number of answers for current question
 */
export const getTotalAnswers = (answerArray) => {
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

export const getNoResponseTeams = (teams, answers) => {
  const allTeamNames = teams.map(team => team.name);
  const answeredTeamNames = answers.reduce((acc, item) => {
    const teams =item.teams.map(t => t.name);
    return acc.concat(teams);
  }, []);
  const teamsWithoutResponses = allTeamNames.filter(teamName => !answeredTeamNames.includes(teamName)).map(teamName => ({name: teamName}));
  return teamsWithoutResponses;
};

/* 
* checks that the gamesessionstate that the answer was created in matches the current state of the game
* done to prevent students from being able to answer repeatedly etc
* @param {GameSessionState} answerState - state of the game when answer was created
* @param {GameSessionState} currentState - current state of the game
* @returns {boolean} - true if the answer state matches the current state, false if not
*/
const isAnswerStateCurrent = (answerState, currentState) => {
  const stateMappings = {
    [GameSessionState.PHASE_1_DISCUSS]: GameSessionState.CHOOSE_CORRECT_ANSWER,
    [GameSessionState.PHASE_1_RESULTS]: GameSessionState.CHOOSE_CORRECT_ANSWER,
    [GameSessionState.PHASE_2_DISCUSS]: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
    [GameSessionState.PHASE_2_RESULTS]: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  };
  return answerState === currentState || 
       answerState === stateMappings[currentState];
}

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
        if (answer.questionId === currentQuestionId && isAnswerStateCurrent(answer.currentState, currentState)) {
          results.push({team, answer});
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
        if (answer.answer.rawAnswer === choice.text) {
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
          answersArray[choicesTextArray.indexOf(choice.text)].teams.push({name: team.name});
        }
      });
    });
    return { answersArray, confidenceArray };
  }
  return { answersArray: [], confidenceArray };
};

/**
 * function to get short answer responses for use in victory charts
 * @param {IResponse []} shortAnswerResponses 
 * @returns {answersArray: IResponse[], confidenceArray: IConfidenceLevel[]}
 */
export const getShortAnswers = (shortAnswerResponses) => {
  // create this to use as an index reference for the confidence levels to avoid find/findIndex
  const confidenceLevelsArray = Object.values(ConfidenceLevel);
  let confidenceArray = createBlankConfidenceArray();
  if (shortAnswerResponses && shortAnswerResponses.length > 0) {
    shortAnswerResponses.forEach((answer) => {
      if (answer.teams){
        answer.teams.forEach((team) => {
          const index = confidenceLevelsArray.indexOf(team.confidence);
          if (answer.isCorrect) {
            confidenceArray[index].correct += 1;
            confidenceArray[index].players.push({
              name: team.name,
              answer: answer.value,
              isCorrect: true,
            });
          } else {
            confidenceArray[index].incorrect += 1;
            confidenceArray[index].players.push({
              name: team.name,
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

/**
 * the answers object in phase 2 needs to be different than in phase 1 (As it represents only answers selected via featured mistakes)
 * this functions creates a similar object to above with that consideration made
 * @param {IResponse []} shortAnswerResponses
 * @param {ITeam []} teamsArray
 * @param {GameSessionState} currentState
 * @param {IQuestion []} questions
 * @param {number} currentQuestionIndex
 * @returns {answersArray: IResponse[]}
 */
export const getShortAnswersPhaseTwo = (shortAnswerResponses, teamsArray, currentState, questions, currentQuestionIndex) => {
  if (shortAnswerResponses && shortAnswerResponses.length > 0) {
    let currentQuestionId = questions[currentQuestionIndex].id;
    const answers = extractAnswers(teamsArray, currentState, currentQuestionId);
    const choices = shortAnswerResponses.reduce((acc, answer) => {
      if (answer.isSelectedMistake || answer.isCorrect) {
        acc.push(answer);
      }
      return acc; 
    }, []);
    const correctChoiceIndex = choices.findIndex(choice => choice.isCorrect);
    let answersArray = Array.from({length: choices.length ?? 0}, (item, index) => ({ count: 0, teams: [], isCorrect: index === correctChoiceIndex ? true : false }));
    answers.forEach(({team, answer}) => {
      for (let i = 0; i < choices.length; i++){ 
        if (answer.answer.rawAnswer === choices[i].rawAnswer) {
          answersArray[i].count += 1;
          answersArray[i].teams.push({name: team.name});
          break;
        }
      }; 
    });
    return { answersArray };
  };
  return { answersArray: [] };
};

/**
 * returns team info to be used when receiving team answers from createteamanswers
 * @param {ITeam[]} teamsArray 
 * @param {string} teamMemberAnswersId 
 * @returns {teamName: string, teamId: string}
 */
export const getTeamInfoFromAnswerId = (teamsArray, teamMemberAnswersId) => {
  let teamName = '';
  let teamId = '';
  console.log("getTeamInfoFromAnswerId");
  console.log(teamsArray);
  console.log(teamMemberAnswersId);
  teamsArray.forEach((team) => {
    team.teamMembers &&
      team.teamMembers.forEach((teamMember) => {
        console.log(teamMember.id);
        if (teamMember.id === teamMemberAnswersId){
          teamName=team.name;
          teamId=team.id;
        }
      });
  });
  return {teamName, teamId};
};

/**
 * This function creates the short answer responses object that will be stored in the question object, via equality checks
 * @param {IResponse} prevShortAnswer 
 * @param {IChoice[]} choices 
 * @param {any}} newAnswer 
 * @param {any} newAnswerTeamName 
 * @param {string} teamId 
 * @returns {IResponse[]}
 */
export const buildShortAnswerResponses = (prevShortAnswer, choices, answerSettings, newAnswer, newAnswerTeamName, teamId) => {
  // if the answer is empty, skip and return the previous answer
  // an empty answer could mean that a user was able to submit an answer of the wrong type
  if (newAnswer.answer.normAnswer.length === 0) {
    return prevShortAnswer;
  }
  const answer = AnswerFactory.createAnswer(
    newAnswer.answer.rawAnswer,
    answerSettings.answerType,
    answerSettings.answerPrecision,
    newAnswer.answer.normAnswer
  );
  if (isNullOrUndefined(answer.normAnswer) || answer.normAnswer.length === 0) 
    answer.normalizeAnswer(newAnswer.answer.rawAnswer);
  // if this is the first answer received, add the correct answer object to prevShortAnswer for comparisons
  if (prevShortAnswer.length === 0) { 
    prevShortAnswer.push({
      rawAnswer: answer.rawAnswer,
      normAnswer: answer.normAnswer,
      isCorrect: true,
      isSelectedMistake: false,
      count: 0,
      teams: [],
    });
  }
  let isExistingAnswer = false;  
  prevShortAnswer.forEach((prevAnswer) => {
    if(
      answer.isEqualTo(prevAnswer.normAnswer)){
      isExistingAnswer = true;
      prevAnswer.count += 1;
      prevAnswer.teams.push({name: newAnswerTeamName, id: teamId, confidence: newAnswer.confidenceLevel});
    }
  });
  // if there was no match above, add the new answer to the array of previous answers
  if (!isExistingAnswer){
    prevShortAnswer.push({
      rawAnswer: newAnswer.answer.rawAnswer,
      normAnswer: newAnswer.answer.normAnswer,
      isCorrect: false,
      isSelectedMistake: false,
      count: 1,
      teams: [{name: newAnswerTeamName, id: teamId, confidence: newAnswer.confidenceLevel}]
    });
  }
  return prevShortAnswer;
};

/**
 * The below functions build out data objects for the Victory charts. There are three types each category require different data objects
 * Multiple choice charts require just the multiple choice answers for the axis and the data received
 * Short answer phase one charts require no information until answers are added to it, building out the axis and the data as answers are received
 * Short answer phase two charts require previous, selected short answers as the axis and then build out the data as the answers are received
 */
export const buildVictoryDataObject = ( 
  answers, 
  questionChoices,
  noResponseObject
  ) => {
  if (!isNullOrUndefined(answers.answersArray)){
    return [
      noResponseObject,
      ...Object.keys(answers.answersArray).map((key, index) => (
        {
        answerCount: answers.answersArray[index].count,
        answerChoice: String.fromCharCode(65 + index),
        answerText:  isNullOrUndefined(questionChoices[index]) ? '' : questionChoices[index].text,
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
        answerText: answer.rawAnswer.toString(),
        answerTeams: answer.teams,
        answerCorrect: answer.isCorrect
    }))
  ]
};

export const buildVictoryDataObjectShortAnswerPhaseTwo = ( 
  shortAnswerResponses, 
  answers,
  noResponseObject
  ) => {
  if (!isNullOrUndefined(answers.answersArray && shortAnswerResponses)){
    return [
      noResponseObject,
      ...Object.keys(answers.answersArray).map((key, index) => ({
        answerCount: answers.answersArray[index].count,
        answerChoice: String.fromCharCode(65 + index),
        answerText: shortAnswerResponses[index].rawAnswer.toString(),
        answerTeams: shortAnswerResponses[index].teams,
        answerCorrect: shortAnswerResponses[index].isCorrect
      })).reverse(),
    ];
  }
  return [];
}

/**
 * rebuilds the hints array from each of the team answers. This is only done if a teacher refreshes the page 
 * before they have a chance to move to the next phase of the game where we process them through GPT
 * @param {*} gameSession 
 * @returns array of hints 
 */
export const rebuildHints = (gameSession) => {
  const currentQuestionId = gameSession.questions[gameSession.currentQuestionIndex].id;
  let hints = [];
  gameSession.teams.forEach(team => {
    team.teamMembers && team.teamMembers.forEach(teamMember => {
      teamMember.answers && teamMember.answers.forEach(answer => {
        if (answer.questionId === currentQuestionId) {
          if (answer.hint) {
              hints.push(answer.hint);
          }
        }
      });
    });
  });
  return hints;
}