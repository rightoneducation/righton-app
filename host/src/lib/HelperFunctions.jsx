import { isNullOrUndefined, GameSessionState } from "@righton/networking";
/* 
* counts all answers for current question using isChosen, for use in footer progress bar
* @param {array} answerArray - array of answers for current question
* @returns {number} count - number of answers for current question
*/
export const getTotalAnswers = (answerArray) => {
  let count = 0;
  if (answerArray) {
    answerArray.forEach(answerCount => {
      count = count + answerCount;
    });
    return count;
  }
  return count;
};


/*
* returns the choices object for an individual question
* @param {array} questions - array of questions
* @param {number} currentQuestionIndex - index of current question
* @returns {array} choices - array of choices for current question
*/
export const getQuestionChoices = (questions, currentQuestionIndex) => {
  if (isNullOrUndefined(questions) || questions.length <= currentQuestionIndex || isNullOrUndefined(questions[currentQuestionIndex].choices)) {
    return null;
  }
  return questions[currentQuestionIndex].choices;
};


/*
* returns an array of which team names picked which question choices
* @param {array} teamsArray - array of teams
* @param {number} currentQuestionIndex - index of current question
* @param {array} choices - array of choices for current question
* @returns {array} teamsPickedChoices - array of objects containing corresponding team names and choice texts
*/
export const getTeamByQuestion = (teamsArray, currentQuestionIndex, choices, questions, currentState) => {
  const teamsPickedChoices = [];

  teamsArray.forEach(team => {
    const teamPickedChoices = [];
    let isNoResponse = true;
    
    team.teamMembers && team.teamMembers.forEach(teamMember => {
      teamMember.answers && teamMember.answers.forEach(answer => {
        if (answer.questionId === questions[currentQuestionIndex].id) {
          if (((currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS) && answer.isChosen) || ((currentState === GameSessionState.PHASE_2_DISCUSS || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) && answer.isTrickAnswer)) {
            isNoResponse = false;
            choices && choices.forEach(choice => {
              if (answer.text === choice.text) {
                teamPickedChoices.push({
                  teamName: team.name,
                  choiceText: choice.text
                });
              }
            });
          }
        }
      });
    });

    if (teamPickedChoices.length > 0 || isNoResponse) {
      teamsPickedChoices.push(...teamPickedChoices);
      if (isNoResponse) {
        teamsPickedChoices.push({
          teamName: team.name,
          choiceText: 'No response'
        });
      }
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
*/
export const getAnswersByQuestion = (choices, teamsArray, currentQuestionIndex, questions, currentState) => {
  if (teamsArray.length !== 0 && questions && choices && Object.keys(teamsArray[0]).length !== 0 && Object.getPrototypeOf(teamsArray[0]) === Object.prototype) {
    let choicesTextArray = [choices.length];
    let answersArray = new Array(choices.length).fill(0);
    let currentQuestionId = questions[currentQuestionIndex].id;
    choices && choices.forEach((choice, index) => {
      choicesTextArray[index] = choice.text;
    });

    teamsArray.forEach(team => {
      team.teamMembers && team.teamMembers.forEach(teamMember => {
        teamMember.answers && teamMember.answers.forEach(answer => {
          if (answer.questionId === currentQuestionId) {
            if (((currentState === GameSessionState.CHOOSE_CORRECT_ANSWER || currentState === GameSessionState.PHASE_1_DISCUSS) && answer.isChosen) || ((currentState === GameSessionState.PHASE_2_DISCUSS || currentState === GameSessionState.CHOOSE_TRICKIEST_ANSWER) && answer.isTrickAnswer)) {
              choices && choices.forEach(choice => {
                if (answer.text === choice.text) {
                  answersArray[choicesTextArray.indexOf(choice.text)] += 1;
                }
              })
            }
          }
        })
      })

    });
    return answersArray;
  }
  return [];
};