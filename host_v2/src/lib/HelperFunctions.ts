import { GameSessionState, ITeam, ITeamMember } from '@righton/networking';
import { ShortAnswerResponse, Mistake } from './HostModels';

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
     isSelectedMistake: shortAnswerResponse.isSelectedMistake ?? false
   }));
  const orderedMistakes = extractedMistakes.sort((a, b) => b.percent - a.percent);
  if (isPopularMode) {
    orderedMistakes.forEach((mistake, index) => {
      if (index < numOfPopularMistakes)
        mistake.isSelectedMistake = true; // eslint-disable-line
      else mistake.isSelectedMistake = false; // eslint-disable-line
    });
  }
  return orderedMistakes;
};

export const extractAnswersByTeam =  (teams: ITeam[], currentState: GameSessionState, currentQuestionId: string) => {
  const results = [{}];
  teams.forEach((team: ITeam) => {
    team.teamMembers && team.teamMembers.forEach((teamMember: ITeamMember) => { // eslint-disable-line
      teamMember.answers && teamMember.answers.forEach((answer: any) => { // eslint-disable-line
        if (answer && answer.questionId === currentQuestionId && answer.currentState === currentState) {
          results.push({team, answer});
        }
      });
    });
  });
  return results;
};

export const getNextGameSessionState = (currentState: GameSessionState, numQuestions: number, currentQuestionIndex: number) => {
  const states = Object.values(GameSessionState);
  const currentIndex = states.indexOf(currentState);
  if (currentState === GameSessionState.PHASE_2_DISCUSS && (numQuestions - 1) !== currentQuestionIndex)
    return GameSessionState.TEAMS_JOINING;
  return states[currentIndex + 1];
};