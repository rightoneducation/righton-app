import { isNullOrUndefined } from "../IApiClient";
import { IQuestionTemplate, IGameTemplate } from "../Models";
import { AWSQuestionTemplate } from "../Models/AWS";

export class QuestionTemplateParser {
  static questionTemplateFromAWSQuestionTemplate(
      awsQuestionTemplate: AWSQuestionTemplate
  ): IQuestionTemplate {
      let gameTemplates: IGameTemplate[] = [];
      if (!isNullOrUndefined(awsQuestionTemplate) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates.items)) {
          gameTemplates = awsQuestionTemplate.gameTemplates.items.map((item: any) => {
              const { gameTemplate } = item;
              const { gameTemplates, questionTemplates, ...rest } = gameTemplate;
              return rest as IGameTemplate;
          });
      } 

      const {
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
          createdAt,
          updatedAt
      } = awsQuestionTemplate || {}
      if (isNullOrUndefined(id) ||
          isNullOrUndefined(title) ||
          isNullOrUndefined(owner) ||
          isNullOrUndefined(version) ||
          isNullOrUndefined(choices) ||
          isNullOrUndefined(instructions) ||
          isNullOrUndefined(answerSettings) ||
          isNullOrUndefined(imageUrl) ||
          isNullOrUndefined(createdAt) ||
          isNullOrUndefined(updatedAt)) {
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
          domain: domain ?? null,
          cluster: cluster ?? null,
          grade: grade ?? null,
          standard: standard ?? null,
          imageUrl,
          gameTemplates,
          createdAt,
          updatedAt
      }
      return questionTemplate
  }
}