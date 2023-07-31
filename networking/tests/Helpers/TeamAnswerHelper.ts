import { randomUUID } from "crypto";
import { ITeamAnswer } from "../../src";
import { ConfidenceLevel } from "../../src/GraphQLAPI";

class TeamAnswerHelper {
  static teamAnswer(
    teamMemberId: string,
    questionId: string,
    answerText: string,
    isChosen: boolean,
    isTrickAnswer: boolean = false
  ): ITeamAnswer {
    return {
      id: randomUUID(),
      isChosen: isChosen,
      text: answerText,
      questionId: questionId,
      isTrickAnswer: isTrickAnswer,
      createdAt: Date().toString(),
      updatedAt: Date().toString(),
      teamMemberAnswersId: teamMemberId,
      confidenceLevel: ConfidenceLevel.KINDA,
    };
  }
}

export default TeamAnswerHelper;
