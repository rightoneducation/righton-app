import { isNullOrUndefined } from "../global";
import { IQuestionTemplate, IGameTemplate, CentralQuestionTemplateInput } from "../Models";
import { QuestionTemplateType } from "../APIClients/templates/interfaces/IQuestionTemplateAPIClient";
import { AWSQuestionTemplate } from "../Models/AWS";
import { GameTemplateParser } from "./GameTemplateParser";
import { PublicPrivateType } from "../APIClients";
import { IChoice } from "../Models/IQuestion";

export class QuestionTemplateParser {
    static centralQuestionTemplateInputToIQuestionTemplate<T extends PublicPrivateType>(
        imageUrl: string,
        userId: string,
        createQuestionTemplateInput: CentralQuestionTemplateInput,
        id?: string
    ): QuestionTemplateType<T>['create']['input']{
        const {title, ccss } = createQuestionTemplateInput.questionCard;
        const lowerCaseTitle = title.toLowerCase();
        const deconstructCCSS = (ccss: string): { grade: string, domain: string, cluster: string, standard: string } => {
            const [grade, domain, cluster, standard] = ccss.split('.');
            return { grade, domain, cluster, standard }
        }
        const {grade, domain, cluster, standard} = deconstructCCSS(ccss);
        const instructions = JSON.stringify(createQuestionTemplateInput.correctCard.answerSteps);
        const choicesIncorrect = createQuestionTemplateInput.incorrectCards.map(card => {
            return {
                isAnswer: false,
                reason: card.explanation,
                text: card.answer,
            }
        });
        const choicesCorrect = {isAnswer: true, reason: '', text: createQuestionTemplateInput.correctCard.answer}; 
        const choices = JSON.stringify([choicesCorrect, ...choicesIncorrect]);
        const answerSettings = JSON.stringify(createQuestionTemplateInput.correctCard.answerSettings);
        const questionTemplate: QuestionTemplateType<T>['create']['input'] = {
            ...(id && id.length > 0 ? { id } : {}),
            title,
            userId,
            lowerCaseTitle,
            version: 0,
            choices,
            instructions,
            answerSettings,
            ccss,
            domain,
            cluster,
            grade,
            gradeFilter: grade,
            standard,
            imageUrl,
            timesPlayed: 0,
            gameTemplatesCount: 0,
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
                    } else if (publicPrivate === PublicPrivateType.DRAFT && item.draftGameTemplate) {
                        template = item.draftGameTemplate;
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
          userId,
          publicPrivateType,
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
          timesPlayed,
          gameTemplatesCount
      } = awsQuestionTemplate || {}
      const awsAnswerSettings = !isNullOrUndefined(answerSettings) ? JSON.parse(answerSettings) : null;
      if (isNullOrUndefined(id) ||
          isNullOrUndefined(title) ||
          isNullOrUndefined(version)) {
          throw new Error(
              "Question Template has null field for the attributes that are not nullable"
          )
      }

      const isPublicPrivateValid = (x: any): x is PublicPrivateType => {
        return Object.values(PublicPrivateType).includes(x);
      }

      const parsedPublicPrivate = isPublicPrivateValid(publicPrivateType) ? publicPrivateType : PublicPrivateType.PUBLIC;

      const createdAt = new Date(awsQuestionTemplate.createdAt ?? 0)
      const updatedAt = new Date(awsQuestionTemplate.updatedAt ?? 0)
      const questionTemplate: IQuestionTemplate = {
          id,
          userId,
          publicPrivateType: parsedPublicPrivate,
          title,
          lowerCaseTitle: lowerCaseTitle ?? '',
          owner: owner ?? '',
          version,
          choices,
          instructions,
          answerSettings: awsAnswerSettings,
          ccss: ccss ?? '',
          domain: domain ?? '',
          cluster: cluster ?? '',
          grade: grade ?? '',
          gradeFilter: gradeFilter ?? '',
          standard: standard ?? '',
          imageUrl,
          timesPlayed,
          gameTemplates,
          gameTemplatesCount,
          createdAt,
          updatedAt
      }
      return questionTemplate
  }
}