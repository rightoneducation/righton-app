import { removeStopwords, eng } from 'stopword'
import { isNullOrUndefined } from "./global"
import { BackendAnswer, IHostTeamAnswersResponse } from "./Models"
import { IGameSession, ITeam } from "./Models"
import { IChoice, IQuestion } from './Models/IQuestion'
import { ITeamMember } from './Models/ITeamMember'
import { GameSessionState } from './AWSMobileApi'
import CCSSDictionary from "./Models/CCSSDictionary"

export abstract class ModelHelper {
    private static correctAnswerScore = 10
    private static isAnswerFromPhaseOne(answer: BackendAnswer | null): boolean {
        return !isNullOrUndefined(answer) && answer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER;
    }

    static getBasicTeamMemberAnswersToQuestionId(team: ITeam, questionId: string): Array<BackendAnswer | null> | null {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length == 0) {
            console.error("Team members is null")
            throw new Error("No members available for the team")
        }

        const teamMember = team.teamMembers[0]!

        if (isNullOrUndefined(teamMember.answers) ||
            teamMember.answers.length === 0) {
            return null
        }

        return teamMember.answers.filter((answer) => {
            return !isNullOrUndefined(answer) &&
                !isNullOrUndefined(answer.questionId) &&
                answer.questionId === questionId 
        })
    }

    static getCorrectAnswer(question: IQuestion): IChoice | null {
        return question.choices!.find((choice) => {
            return !isNullOrUndefined(choice.isAnswer) && choice.isAnswer
        }) ?? null
    }
    static getSelectedAnswer(team: ITeam, question: IQuestion, currentState: GameSessionState): BackendAnswer | null {
        // step 1: get all answers from player
        let teamAnswers;
        if (team != null) {
            teamAnswers = ModelHelper.getBasicTeamMemberAnswersToQuestionId(
            team,
            question.id
            );
        }
        // step 2: get the answer the player selected this round
        const findSelectedAnswer = (answers: (BackendAnswer | null)[]) => {
            const selectedAnswer = answers.find((teamAnswer: BackendAnswer | null) => 
                this.isAnswerFromPhaseOne(teamAnswer)
                    ? currentState === GameSessionState.PHASE_1_DISCUSS
                    : currentState === GameSessionState.PHASE_2_DISCUSS
            );
            return isNullOrUndefined(selectedAnswer) ? null : selectedAnswer;
        };

        if (team != null && !isNullOrUndefined(teamAnswers)) {
            return findSelectedAnswer(teamAnswers);
        }
        return null;
    }
    static getSelectedTrickAnswer(team: ITeam, questionId: string): BackendAnswer | null {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length !== 1) {
            throw new Error("Given team has no members or more than one members")
        }

        const teamMember = team.teamMembers[0]
        const trickAnswer = teamMember!.answers?.find((answer) => {
            if (isNullOrUndefined(answer)) {
                return false
            }

            return answer.questionId === questionId &&
                (!this.isAnswerFromPhaseOne(answer))
        })

        return trickAnswer ?? null
    }

    static calculateBasicModeWrongAnswerScore(gameSession: IGameSession, answerText: string, questionId: string): number {
        if (isNullOrUndefined(gameSession.teams)) {
            throw new Error("'teams' can't be null")
        }

        // Calculate how many teams have chosen the same answer as the passed team.
        const totalNoChosenAnswer = gameSession.teams.reduce((previousVal: number, team: ITeam) => {
            if (isNullOrUndefined(team.teamMembers) ||
                team.teamMembers.length !== 1) {
                console.error(`No team member available for ${team.name}`)
                return previousVal
            }

            const teamMember = team.teamMembers[0]!

            if (isNullOrUndefined(teamMember.answers) ||
                teamMember.answers.length === 0) {
                return previousVal
            };
            const answersToQuestion = teamMember.answers.find((answer) => {
                return !isNullOrUndefined(answer) &&
                    !isNullOrUndefined(answer!.questionId) &&
                    answer.questionId === questionId &&
                    this.isAnswerFromPhaseOne(answer) &&
                    answer!.answer.rawAnswer === answerText
            });
            return previousVal + (isNullOrUndefined(answersToQuestion) ? 0 : 1)
        }, 0);
        console.log(totalNoChosenAnswer);
        const totalNumberOfResponses = gameSession.questions[gameSession.currentQuestionIndex].answerData.phase1.responses.filter((response) => response.multiChoiceCharacter !== `–`).reduce((previousVal: number, response: IHostTeamAnswersResponse) => {
            return previousVal + response.teams.length
        }, 0);
        console.log(totalNumberOfResponses);
        return Math.round(totalNoChosenAnswer / totalNumberOfResponses * 100)
    }
    static isShortAnswerResponseCorrect(shortAnswerResponses: IHostTeamAnswersResponse[], team: ITeam){
        return (shortAnswerResponses.some(response => 
            response.isCorrect 
            && response.teams.some(teamAnswer => teamAnswer === team.name)
        ))
    }
    static calculateBasicModeScoreForQuestion(gameSession: IGameSession, question: IQuestion, team: ITeam, isShortAnswerEnabled: boolean) {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length === 0) {
            console.error("No team member exists for the specified team")
            throw new Error("No team member exists for the specified team")
        }
        const answers = this.getBasicTeamMemberAnswersToQuestionId(team, question.id)
        if (isNullOrUndefined(answers) ||
            answers.length === 0) {
                return 0;
        }

        const correctAnswer = this.getCorrectAnswer(question)
        const currentQuestion = gameSession?.questions[gameSession?.currentQuestionIndex ?? 0]
        let submittedTrickAnswer = answers.find(answer => (!this.isAnswerFromPhaseOne(answer)) && answer?.questionId === currentQuestion.id)
        console.log("hellow");
        if (submittedTrickAnswer || gameSession.currentState === GameSessionState.PHASE_2_DISCUSS) {
            const score = ModelHelper.calculateBasicModeWrongAnswerScore(gameSession, submittedTrickAnswer?.text ?? '', currentQuestion.id);
            console.log(score);
            return score;
        } else {
            if (!isShortAnswerEnabled && answers.find(answer => (this.isAnswerFromPhaseOne(answer)) && answer?.text === correctAnswer?.text && answer?.questionId === currentQuestion.id)){
                return this.correctAnswerScore
            } else {
                const teamResponses = gameSession?.questions[gameSession?.currentQuestionIndex ?? 0].answerData.phase1.responses;
                if (isNullOrUndefined(teamResponses)){
                    return 0;
                }
                if (ModelHelper.isShortAnswerResponseCorrect(teamResponses, team)){
                    return this.correctAnswerScore;

                }
            }
            return 0;
        }
   
    }

    static findTeamInGameSession(gameSession: IGameSession, teamId: string): ITeam | null {
        if (isNullOrUndefined(teamId)) {
            return null
        }
        return gameSession.teams?.find(team => team.id === teamId) ?? null
    }

    static findTeamMemberInTeam(team: ITeam, teamMemberAnswersId: string): ITeamMember | null {
        if (isNullOrUndefined(team.teamMembers) ||
            team.teamMembers.length === 0) {
            return null
        }
        return team.teamMembers.find(member =>
            !isNullOrUndefined(member) && member.id === teamMemberAnswersId) ?? null
    }

    /**
    * sorts teams by score descending, then alphabetically by name
    * only include teams with scores in the top five
    * See this discussion for more info on implementation:
    * https://github.com/rightoneducation/righton-app/pull/685#discussion_r1248353666
    * @param inputTeams - the teams to be sorted
    * @param totalTeamsReturned - the number of teams to be returned
    * @returns - the sorted teams
    */
   static teamSorter = (inputTeams: ITeam[], totalTeams: number) => {
     const sortedTeams = inputTeams.sort((lhs, rhs) => {
       if (lhs.score !== rhs.score) {
         return lhs.score - rhs.score;
       }
       return rhs.name.localeCompare(lhs.name);
     });
     let lastScore = -1;
     let totalTeamsReturned = totalTeams;
     const ret = []; // Array(totalTeamsReturned);
     for (
       let i = sortedTeams.length - 1;
       i >= 0 && totalTeamsReturned > 0;
       i -= 1
     ) {
       if (sortedTeams[i].score !== lastScore) {
         totalTeamsReturned -= 1;
       }
       ret.push(sortedTeams[i]);
       lastScore = sortedTeams[i].score;
     }
     return ret as ITeam[];
   };

   static getCCSSDescription = (grade: string, domain: string, cluster: string, standard: string): string => {
        let ccssText: string = '';
        const gradeObj = CCSSDictionary.find(g => g.key === grade);
        if (gradeObj) {
            ccssText += ` ${gradeObj.desc}`;
            const domainObj = gradeObj.domains.find(d => d.key === domain);
            if (domainObj) {
                ccssText += ` ${domainObj.desc}`;
                const clusterObj = domainObj.clusters.find(c => c.key === cluster);
                if (clusterObj) {
                ccssText += ` ${clusterObj.desc}`;
                const standardObj = clusterObj.standards.find(s => s.key === standard);
                if (standardObj) {
                    ccssText += ` ${standardObj.desc}`;
                }
                }
            }
        }
        if (ccssText === '') {
            return '';
        }
        const arrayCCSSText = ccssText.split(' ');
        return removeStopwords(arrayCCSSText, eng).join(' ').toLowerCase().trim();
    }
}