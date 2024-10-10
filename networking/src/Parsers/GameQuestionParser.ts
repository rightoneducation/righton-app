import { isNullOrUndefined } from "../global";
import { IGameQuestion } from "../Models";
import { AWSGameQuestion } from "../Models/AWS";
import { GameTemplateParser } from "./GameTemplateParser";
import { QuestionTemplateParser } from "./QuestionTemplateParser";
import { PublicPrivateType } from "../APIClients";

export class GameQuestionParser {
    static gameQuestionFromAWSGameQuestion(
        awsGameQuestion: AWSGameQuestion,
        publicPrivate: PublicPrivateType
    ): IGameQuestion {
        if (isNullOrUndefined(awsGameQuestion)) {
            throw new Error(
                "GameQuestion is null"
            )
        }
        let gameQuestion: IGameQuestion;
        if (publicPrivate === PublicPrivateType.PUBLIC){
            if (isNullOrUndefined(awsGameQuestion.publicGameTemplate))
                throw new Error(
                    "GameQuestion has null field for the attributes that are not nullable"
                )
            if (isNullOrUndefined(awsGameQuestion.publicQuestionTemplate))
                throw new Error(
                    "GameQuestion has null field for the attributes that are not nullable"
                )

            const gameTemplate = GameTemplateParser.gameTemplateFromAWSGameTemplate(awsGameQuestion.publicGameTemplate, publicPrivate);
            const questionTemplate = QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(awsGameQuestion.publicQuestionTemplate, publicPrivate);

            const {
                id,
                publicQuestionTemplateID,
                publicGameTemplateID,
            } = awsGameQuestion || {}

            gameQuestion = {
                id,
                questionTemplateID: publicQuestionTemplateID,
                gameTemplateID: publicGameTemplateID,
                gameTemplate,
                questionTemplate,
                createdAt: new Date(awsGameQuestion.createdAt ?? 0),
                updatedAt: new Date(awsGameQuestion.updatedAt ?? 0)
            } as IGameQuestion
        } else {
            if (isNullOrUndefined(awsGameQuestion.privateGameTemplate))
                throw new Error(
                    "GameQuestion has null field for the attributes that are not nullable"
                )
            if (isNullOrUndefined(awsGameQuestion.privateQuestionTemplate))
                throw new Error(
                    "GameQuestion has null field for the attributes that are not nullable"
                )

            const gameTemplate = GameTemplateParser.gameTemplateFromAWSGameTemplate(awsGameQuestion.privateGameTemplate, publicPrivate);
            const questionTemplate = QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(awsGameQuestion.privateQuestionTemplate, publicPrivate);

            const {
                id,
                privateQuestionTemplateID,
                privateGameTemplateID,
            } = awsGameQuestion || {}

            gameQuestion = {
                id,
                questionTemplateID: privateQuestionTemplateID,
                gameTemplateID: privateGameTemplateID,
                gameTemplate,
                questionTemplate,
                createdAt: new Date(awsGameQuestion.createdAt ?? 0),
                updatedAt: new Date(awsGameQuestion.updatedAt ?? 0)
            } as IGameQuestion
        }
        return gameQuestion
    }
}