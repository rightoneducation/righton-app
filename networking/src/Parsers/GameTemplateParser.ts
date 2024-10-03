import { isNullOrUndefined } from "../global";
import { IGameTemplate, IQuestionTemplate, IQuestionTemplateOrder } from "../Models";
import { AWSGameTemplate } from "../Models/AWS";
import { QuestionTemplateParser } from "./QuestionTemplateParser";

const sortQuestionTemplatesByOrder = (questionTemplates: {questionTemplate: IQuestionTemplate, gameQuestionId: string}[], order: IQuestionTemplateOrder[]) => {
    if (isNullOrUndefined(questionTemplates) || isNullOrUndefined(order)) return questionTemplates;
    const orderMap = new Map<string, number>();
    order.map((orderItem) => {
      orderMap.set(orderItem.questionTemplateId, orderItem.index);
    });
  
    return questionTemplates.sort((a, b) => {
      const indexA = orderMap.get(a.questionTemplate.id);
      const indexB = orderMap.get(b.questionTemplate.id);
      if (indexA === undefined) return 1;
      if (indexB === undefined) return -1;
      return indexA - indexB;
    });
  }

export class GameTemplateParser {
    static gameTemplateFromAWSGameTemplate(
        awsGameTemplate: AWSGameTemplate
    ): IGameTemplate {
        // parse the IQuestionTemplate[] from IModelGameQuestionConnection
        let questionTemplates: Array<{ questionTemplate: IQuestionTemplate, gameQuestionId: string }> | null = [];
        if (!isNullOrUndefined(awsGameTemplate) && !isNullOrUndefined(awsGameTemplate.questionTemplates) && !isNullOrUndefined(awsGameTemplate.questionTemplates.items)) {
            for (const item of awsGameTemplate.questionTemplates.items) {
                if (item && item.questionTemplate) {
                    const { gameTemplates, ...rest } = item.questionTemplate;
                    // Only add to questionTemplates if 'rest' is not empty
                    if (Object.keys(rest).length > 0) {
                        questionTemplates.push({questionTemplate: QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(rest) as IQuestionTemplate, gameQuestionId: item.id as string});
                    }
                }
            }
        } else {
            // assign an empty array if questionTemplates is null
            questionTemplates = [];
        }
        const questionTemplatesOrder = awsGameTemplate.questionTemplatesOrder ? JSON.parse(awsGameTemplate.questionTemplatesOrder) : null;
        const sortedQuestionTemplates = sortQuestionTemplatesByOrder(questionTemplates, questionTemplatesOrder);
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
          ccss,
          imageUrl,
          questionTemplatesCount
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
          ccss,
          phaseOneTime,
          phaseTwoTime,
          imageUrl,
          questionTemplates: sortedQuestionTemplates,
          questionTemplatesCount,
          questionTemplatesOrder,
          createdAt,
          updatedAt
      }
      return gameTemplate
  }
}