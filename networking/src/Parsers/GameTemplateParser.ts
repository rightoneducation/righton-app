import { isNullOrUndefined } from "../global";
import { IGameTemplate, IQuestionTemplate, IQuestionTemplateOrder } from "../Models";
import { AWSGameTemplate } from "../Models/AWS";
import { QuestionTemplateParser } from "./QuestionTemplateParser";
import { PublicPrivateType } from "../APIClients";

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
                    } else if (publicPrivate === PublicPrivateType.DRAFT && item.draftQuestionTemplate) {
                        template = item.draftQuestionTemplate;
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
        const questionTemplatesOrder = awsGameTemplate.questionTemplatesOrder ? JSON.parse(awsGameTemplate.questionTemplatesOrder) : null;
        const sortedQuestionTemplates = sortQuestionTemplatesByOrder(questionTemplates, questionTemplatesOrder);

       const {
          id,
          userId,
          publicPrivateType,
          title,
          lowerCaseTitle,
          owner,
          version,
          description,
          lowerCaseDescription,
          domain,
          cluster,
          grade,
          standard,
          ccss,
          ccssDescription,
          imageUrl,
          timesPlayed,
          questionTemplatesCount
      } = awsGameTemplate || {}
        const createdAt = awsGameTemplate.createdAt ? new Date(awsGameTemplate.createdAt) : new Date();
        const updatedAt = awsGameTemplate.updatedAt ? new Date(awsGameTemplate.updatedAt) : new Date();
        const phaseOneTime = awsGameTemplate.phaseOneTime ?? 0;
        const phaseTwoTime = awsGameTemplate.phaseTwoTime ?? 0;


    
      const isPublicPrivateValid = (x: any): x is PublicPrivateType => {
        return Object.values(PublicPrivateType).includes(x);
      }

      const parsedPublicPrivate = isPublicPrivateValid(publicPrivateType) ? publicPrivateType : PublicPrivateType.PUBLIC;

      const gameTemplate: IGameTemplate = {
          id,
          userId,
          publicPrivateType: parsedPublicPrivate,
          title,
          lowerCaseTitle,
          owner,
          version,
          description,
          lowerCaseDescription,
          domain,
          cluster,
          grade,
          standard,
          ccss,
          ccssDescription: ccssDescription ?? '',
          phaseOneTime,
          phaseTwoTime,
          imageUrl,
          timesPlayed,
          questionTemplates: sortedQuestionTemplates,
          questionTemplatesCount,
          questionTemplatesOrder,
          createdAt,
          updatedAt
      }
      return gameTemplate
  }
}