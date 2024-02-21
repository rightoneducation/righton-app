import { isNullOrUndefined } from "../global";
import { BackendAnswer, AnswerPrecision, AnswerType } from "../Models";
import { AWSTeamAnswer } from "../Models/AWS";
import { 
  ConfidenceLevel,
  OnCreateTeamAnswerSubscription, 
  OnUpdateTeamAnswerSubscription 
} from "../AWSMobileApi";

export class TeamAnswerParser {

    static convertProperty<T>(obj: any, propertyName: string, enumType: T) {
        if (!isNullOrUndefined(obj) && !isNullOrUndefined(obj[propertyName])) {
            obj[propertyName] = enumType[obj[propertyName] as keyof typeof enumType];
        }
    }

    static parseAnswerSettings<t>(input: any | t): t {
        if (typeof input === "string") {
            const answerSettingsObject = JSON.parse(input as string);
            if (!isNullOrUndefined(answerSettingsObject)) {
                this.convertProperty(answerSettingsObject, 'answerType', AnswerType);
                this.convertProperty(answerSettingsObject, 'answerPrecision', AnswerPrecision);
            }
            return answerSettingsObject as t;
        }
        return input
    }

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
        const {
            id,
            answer = JSON.parse(awsTeamAnswer.answer),
            isSubmitted = awsTeamAnswer.isSubmitted,
            isShortAnswerEnabled = awsTeamAnswer.isShortAnswerEnabled,
            currentState = awsTeamAnswer.currentState,
            currentQuestionIndex = awsTeamAnswer.currentQuestionIndex,
            questionId = awsTeamAnswer.questionId,
            teamMemberAnswersId = awsTeamAnswer.teamMemberAnswersId,
            text = awsTeamAnswer.text ?? '',
            confidenceLevel = awsTeamAnswer.confidenceLevel ?? ConfidenceLevel.NOT_RATED,
            hint = awsTeamAnswer.hint ?? '',
            createdAt = awsTeamAnswer.createdAt,
            updatedAt = awsTeamAnswer.updatedAt
        } = awsTeamAnswer || {}

        if (isNullOrUndefined(id) ||
            isNullOrUndefined(teamMemberAnswersId) ||
            isNullOrUndefined(questionId) ||
            isNullOrUndefined(text) ||
            isNullOrUndefined(answer)) {
            throw new Error(
                "Team answer has null field for the attributes that are not nullable"
            )
        }

        const teamAnswer: BackendAnswer = {
            id,
            answer,
            isSubmitted,
            isShortAnswerEnabled,
            currentState,
            currentQuestionIndex,
            questionId,
            teamMemberAnswersId,
            text,
            confidenceLevel,
            createdAt,
            updatedAt,
            hint
        } as BackendAnswer;
        return teamAnswer
    }
}