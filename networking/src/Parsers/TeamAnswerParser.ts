import { isNullOrUndefined } from "../global";
import { BackendAnswer } from "../Models";
import { AWSTeamAnswer } from "../Models/AWS";
import { 
  ConfidenceLevel,
  OnCreateTeamAnswerSubscription, 
  OnUpdateTeamAnswerSubscription 
} from "../AWSMobileApi";

export class TeamAnswerParser {

    static teamAnswerFromCreateTeamAnswerSubscription(
        subscription: OnCreateTeamAnswerSubscription
    ): BackendAnswer {
        const createTeamAnswer = subscription.onCreateTeamAnswer
        if (isNullOrUndefined(createTeamAnswer)) {
            throw new Error("subscription.onCreateTeamAnswer can't be null.")
        }
        if (isNullOrUndefined(createTeamAnswer.confidenceLevel)){
            createTeamAnswer.confidenceLevel = ConfidenceLevel.NOT_RATED;
        }
        return this.teamAnswerFromAWSTeamAnswer(createTeamAnswer as AWSTeamAnswer)
    }

    static teamAnswerFromUpdateTeamAnswerSubscription(
        subscription: OnUpdateTeamAnswerSubscription
    ): BackendAnswer {
        const updateTeamAnswer = subscription.onUpdateTeamAnswer
        if (isNullOrUndefined(updateTeamAnswer)) {
            throw new Error("subscription.onCreateTeamAnswer can't be null.")
        }
        return this.teamAnswerFromAWSTeamAnswer(updateTeamAnswer as AWSTeamAnswer)
    }

    static mapTeamAnswers(
        awsTeamAnswers: Array<AWSTeamAnswer | null> | null | undefined
    ): Array<BackendAnswer> {
        if (isNullOrUndefined(awsTeamAnswers)) {
            return []
        }

        return awsTeamAnswers.map((awsTeamAnswer) => {
            if (isNullOrUndefined(awsTeamAnswer)) {
                throw new Error("Team can't be null in the backend.")
            }
            return this.teamAnswerFromAWSTeamAnswer(awsTeamAnswer)
        })
    }

    static teamAnswerFromAWSTeamAnswer(
        awsTeamAnswer: AWSTeamAnswer
    ): BackendAnswer {
        let parsedAnswer;
        try {
            parsedAnswer = JSON.parse(awsTeamAnswer.answer);
        } catch (error) {
            console.error("Error parsing answer:", error);
            throw new Error("Error parsing the 'answer' field.");
        }
        const {
            id,
            isSubmitted = awsTeamAnswer.isSubmitted,
            isShortAnswerEnabled = awsTeamAnswer.isShortAnswerEnabled,
            currentState = awsTeamAnswer.currentState,
            currentQuestionIndex = awsTeamAnswer.currentQuestionIndex,
            questionId = awsTeamAnswer.questionId,
            teamMemberAnswersId = awsTeamAnswer.teamMemberAnswersId,
            teamAnswersId = awsTeamAnswer.teamAnswersId,
            teamName = awsTeamAnswer.teamName ?? '',
            text = awsTeamAnswer.text ?? '',
            isCorrect = awsTeamAnswer.isCorrect ?? false,
            confidenceLevel = awsTeamAnswer.confidenceLevel as ConfidenceLevel ?? ConfidenceLevel.NOT_RATED,
            hint = awsTeamAnswer.hint ?? '',
            createdAt = awsTeamAnswer.createdAt,
            updatedAt = awsTeamAnswer.updatedAt
        } = awsTeamAnswer || {}

        if (isNullOrUndefined(id) ||
            isNullOrUndefined(teamMemberAnswersId) ||
            isNullOrUndefined(questionId) ||
            isNullOrUndefined(text) ||
            isNullOrUndefined(parsedAnswer)) {
            throw new Error(
                "Team answer has null field for the attributes that are not nullable"
            )
        }
        const teamAnswer: BackendAnswer = {
            id,
            answer: parsedAnswer,
            isSubmitted,
            isShortAnswerEnabled,
            currentState,
            currentQuestionIndex,
            questionId,
            teamMemberAnswersId,
            teamAnswersId,
            teamName,
            text,
            isCorrect,
            confidenceLevel,
            createdAt,
            updatedAt,
            hint
        } as BackendAnswer;
        return teamAnswer
    }
}