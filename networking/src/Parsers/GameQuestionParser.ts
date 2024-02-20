import { isNullOrUndefined } from "../global";
import { IGameQuestion } from "../Models";
import { AWSGameQuestion } from "../Models/AWS";
import { GameTemplateParser } from "./GameTemplateParser";
import { QuestionTemplateParser } from "./QuestionTemplateParser";

export class GameQuestionParser {
    static gameQuestionFromAWSGameQuestion(
        awsGameQuestion: AWSGameQuestion
    ): IGameQuestion {
        // if the templates are null, there is a deeper issue here so throw an error
        if (isNullOrUndefined(awsGameQuestion.gameTemplate) || isNullOrUndefined(awsGameQuestion.questionTemplate)) {
            throw new Error(
                "GameQuestion has null field for the attributes that are not nullable"
            )
        }
        // if they aren't null, parse both templates to add to the GameQuestion 
        const gameTemplate = GameTemplateParser.gameTemplateFromAWSGameTemplate(awsGameQuestion.gameTemplate);
        const questionTemplate = QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(awsGameQuestion.questionTemplate);
        
        // destructure remaining AWSGameQuestion fields
        const {
            id,
            questionTemplateID,
            gameTemplateID,
        } = awsGameQuestion || {}

        const createdAt = new Date(awsGameQuestion.createdAt ?? 0)
        const updatedAt = new Date(awsGameQuestion.updatedAt ?? 0)

        if (isNullOrUndefined(id) ||
            isNullOrUndefined(questionTemplateID) ||
            isNullOrUndefined(gameTemplateID)
            ) {
            throw new Error(
                "GameQuestion has null field for the attributes that are not nullable"
            )
        }

        const gameQuestion: IGameQuestion = {
            id,
            questionTemplateID,
            gameTemplateID,
            gameTemplate,
            questionTemplate,
            createdAt,
            updatedAt
        } as IGameQuestion
        return gameQuestion
    }
}