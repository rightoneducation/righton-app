import { isNullOrUndefined } from "../global";
import { IGameTemplate, IQuestionTemplate } from "../Models";
import { AWSGameTemplate } from "../Models/AWS";
import { QuestionTemplateParser } from "./QuestionTemplateParser";
import { PublicPrivateType } from "../APIClients";

export class GameTemplateParser {
    static gameTemplateFromAWSGameTemplate(
        awsGameTemplate: AWSGameTemplate,
        publicPrivate: PublicPrivateType
    ): IGameTemplate {
        // parse the IQuestionTemplate[] from IModelGameQuestionConnection
        let questionTemplates: Array<{ questionTemplate: IQuestionTemplate, gameQuestionId: string }> | null = [];
        if (!isNullOrUndefined(awsGameTemplate) && !isNullOrUndefined(awsGameTemplate.questionTemplates) && !isNullOrUndefined(awsGameTemplate.questionTemplates.items)) {
            for (const item of awsGameTemplate.questionTemplates.items) {
                if (item) {
                    let template;
                    if (publicPrivate === PublicPrivateType.PUBLIC && item.publicQuestionTemplate) {
                        template = item.publicQuestionTemplate;
                    } else if (publicPrivate === PublicPrivateType.PRIVATE && item.privateQuestionTemplate) {
                        template = item.privateQuestionTemplate;
                    } else {
                        continue;
                    }
                    const { gameTemplates, ...rest } = template;
                    // Only add to questionTemplates if 'rest' is not empty
                    if (Object.keys(rest).length > 0) {
                        questionTemplates.push({questionTemplate: QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(rest, publicPrivate) as IQuestionTemplate, gameQuestionId: item.id as string});
                    }
                }
            }
        } else {
            // assign an empty array if questionTemplates is null
            questionTemplates = [];
        }

      const {
          id,
          title,
          owner,
          version,
          description,
          domain,
          cluster,
          grade,
          standard,
          imageUrl,
          questionTemplatesCount,
      } = awsGameTemplate || {}

        const createdAt = new Date(awsGameTemplate.createdAt ?? 0);
        const updatedAt = new Date(awsGameTemplate.updatedAt ?? 0);
        const phaseOneTime = awsGameTemplate.phaseOneTime ?? 0;
        const phaseTwoTime = awsGameTemplate.phaseTwoTime ?? 0;

      const gameTemplate: IGameTemplate = {
          id,
          title,
          owner,
          version,
          description,
          domain,
          cluster,
          grade,
          standard,
          phaseOneTime,
          phaseTwoTime,
          imageUrl,
          questionTemplates,
          questionTemplatesCount,
          createdAt,
          updatedAt
      }
      return gameTemplate
  }
}