import { isNullOrUndefined } from "../global";
import { IQuestionTemplate, IGameTemplate } from "../Models";
import { AWSQuestionTemplate } from "../Models/AWS";
import { GameTemplateParser } from "./GameTemplateParser";
import { PublicPrivateType } from "../APIClients";
import { IChoice } from "../Models/IQuestion";

export class QuestionTemplateParser {
    static questionTemplateFromAWSQuestionTemplate(
        awsQuestionTemplate: AWSQuestionTemplate,
        publicPrivate: PublicPrivateType
    ): IQuestionTemplate {
        let gameTemplates: Array<{ gameTemplate: IGameTemplate, gameQuestionId: string }> | null = [];
        if (!isNullOrUndefined(awsQuestionTemplate) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates.items)) {
            for (const item of awsQuestionTemplate.gameTemplates.items) {
                if (item) {
                    let template;
                    if (publicPrivate === PublicPrivateType.PUBLIC && item.publicGameTemplate) {
                        template = item.publicGameTemplate;
                    } else if (publicPrivate === PublicPrivateType.PRIVATE && item.privateGameTemplate) {
                        template = item.privateGameTemplate;
                    } else {
                       continue;
                    }
                  const { questionTemplates, ...rest } = template;
                  // Only add to questionTemplates if 'rest' is not empty
                  if (Object.keys(rest).length > 0) {
                      gameTemplates.push({gameTemplate: GameTemplateParser.gameTemplateFromAWSGameTemplate(rest, publicPrivate) as IGameTemplate, gameQuestionId: item.id as string});
                  }
                }
          }
        } else {
            // assign an empty array if gameTemplates is null
            gameTemplates = [];
        }
        // parse choices array
        let choices: IChoice[] = [];
        if (!isNullOrUndefined(awsQuestionTemplate.choices)) {
           try {
            choices = JSON.parse(awsQuestionTemplate.choices) as IChoice[]
            } catch (e) {
                console.error(e);
           }
        }
        // parse instructions array
        let instructions: string[] = [];
        if (!isNullOrUndefined(awsQuestionTemplate.instructions)) {
           try {
            instructions = JSON.parse(awsQuestionTemplate.instructions) as string[]
            } catch (e) {
                console.error(e);
           }
        }
       
      const {
          id,
          title,
          owner,
          version,
          answerSettings,
          domain,
          cluster,
          grade,
          standard,
          imageUrl,
          gameTemplatesCount
      } = awsQuestionTemplate || {}
      if (isNullOrUndefined(id) ||
          isNullOrUndefined(title) ||
          isNullOrUndefined(owner) ||
          isNullOrUndefined(version)) {
          throw new Error(
              "Question Template has null field for the attributes that are not nullable"
          )
      }

      const createdAt = new Date(awsQuestionTemplate.createdAt ?? 0)
      const updatedAt = new Date(awsQuestionTemplate.updatedAt ?? 0)
      const questionTemplate: IQuestionTemplate = {
          id,
          title,
          owner,
          version,
          choices,
          instructions,
          answerSettings,
          domain: domain ?? '',
          cluster: cluster ?? '',
          grade: grade ?? '',
          standard: standard ?? '',
          imageUrl,
          gameTemplates,
          gameTemplatesCount,
          createdAt,
          updatedAt
      }
      return questionTemplate
  }
}