import { isNullOrUndefined } from "../global";
import { IQuestionTemplate, IGameTemplate, CentralQuestionTemplateInput } from "../Models";
import { AWSQuestionTemplate } from "../Models/AWS";
import { GameTemplateParser } from "./GameTemplateParser";
import { PublicPrivateType } from "../APIClients";
import { IChoice } from "../Models/IQuestion";

export class QuestionTemplateParser {
    static centralQuestionTemplateInputToIQuestionTemplate(
        createQuestionTemplateInput: CentralQuestionTemplateInput
    ): IQuestionTemplate {
        const {title, ccss } = createQuestionTemplateInput.questionCard;
        const lowerCaseTitle = title.toLowerCase();
        const deconstructCCSS = (ccss: string): { domain: string, cluster: string, grade: string, standard: string } => {
            const [domain, cluster, grade, standard] = ccss.split('.');
            return { domain, cluster, grade, standard }
        }
        const {domain, cluster, grade, standard} = deconstructCCSS(ccss);
        const instructions = createQuestionTemplateInput.correctCard.answerSteps;
        const choicesIncorrect = createQuestionTemplateInput.incorrectCards.map(card => {
            return {
                isAnswer: false,
                reason: card.explanation,
                text: card.answer,
            }
        });
        const choicesCorrect = {isAnswer: true, reason: '', text: createQuestionTemplateInput.correctCard.answer}; 
        const choices = [choicesCorrect, ...choicesIncorrect];
        const imageUrl = '';
        const questionTemplate: IQuestionTemplate = {
            id: '',
            title,
            lowerCaseTitle,
            version: 0,
            choices,
            instructions,
            ccss,
            domain,
            cluster,
            grade,
            gradeFilter: grade,
            standard,
            imageUrl,
            gameTemplates: [],
            gameTemplatesCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        return questionTemplate
    }

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
          lowerCaseTitle,
          owner,
          version,
          answerSettings,
          ccss,
          domain,
          cluster,
          grade,
          gradeFilter,
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
          lowerCaseTitle: lowerCaseTitle ?? '',
          owner,
          version,
          choices,
          instructions,
          answerSettings,
          ccss: ccss ?? '',
          domain: domain ?? '',
          cluster: cluster ?? '',
          grade: grade ?? '',
          gradeFilter: gradeFilter ?? '',
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