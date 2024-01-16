import { isNullOrUndefined } from "../IApiClient";
import { IQuestionTemplate, IGameTemplate } from "../Models";
import { AWSQuestionTemplate } from "../Models/AWS";

export class QuestionTemplateParser {
    static questionTemplateFromAWSQuestionTemplate(
        awsQuestionTemplate: AWSQuestionTemplate
    ): IQuestionTemplate {
        let gameTemplates: Array<{ gameTemplate: IGameTemplate, gameQuestionId: string }> | null = [];
        if (!isNullOrUndefined(awsQuestionTemplate) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates.items)) {
            for (const item of awsQuestionTemplate.gameTemplates.items) {
              if (item && item.gameTemplate) {
                  const { questionTemplates, ...rest } = item.gameTemplate;
                  // Only add to questionTemplates if 'rest' is not empty
                  if (Object.keys(rest).length > 0) {
                      gameTemplates.push({gameTemplate: rest as IGameTemplate, gameQuestionId: item.id as string});
                  }
              }
          }
        } else {
            // assign an empty array if gameTemplates is null
            gameTemplates = [];
        }

        const {
            id,
            title,
            owner,
            version,
            choices,
            instructions,
            answerSettings,
            domain = awsQuestionTemplate.domain ?? '',
            cluster = awsQuestionTemplate.cluster ?? '',
            grade = awsQuestionTemplate.grade ?? '',
            standard = awsQuestionTemplate.standard ?? '',
            imageUrl = awsQuestionTemplate.imageUrl ?? '',
            createdAt = awsQuestionTemplate.createdAt ?? '',
            updatedAt = awsQuestionTemplate.updatedAt ?? ''
        } = awsQuestionTemplate || {}
        
        if (isNullOrUndefined(id) ||
            isNullOrUndefined(title) ||
            isNullOrUndefined(owner) ||
            isNullOrUndefined(version) ||
            isNullOrUndefined(choices) ||
            isNullOrUndefined(instructions) ||
            isNullOrUndefined(answerSettings)) {
            throw new Error(
                "Question Template has null field for the attributes that are not nullable"
            )
        }

        const questionTemplate: IQuestionTemplate = {
            id,
            title,
            owner,
            version,
            choices,
            instructions,
            answerSettings,
            domain,
            cluster,
            grade,
            standard,
            imageUrl,
            gameTemplates,
            createdAt,
            updatedAt
        }
        return questionTemplate
    }
}