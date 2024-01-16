import { isNullOrUndefined } from "../IApiClient";
import { IGameTemplate, IQuestionTemplate } from "../Models";
import { AWSGameTemplate } from "../Models/AWS";

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
                        questionTemplates.push({questionTemplate: rest as IQuestionTemplate, gameQuestionId: item.id as string});
                    }
                }
            }
        } else {
            // assign an empty array if questionTemplates is null
            questionTemplates = [];
        }

        // destructure AWSGameTemplate and assign default values if null
        const {
            id,
            title,
            owner,
            version,
            description,
            domain = awsGameTemplate.domain ?? '', 
            cluster = awsGameTemplate.cluster ?? '',
            grade = awsGameTemplate.grade ?? '',
            standard = awsGameTemplate.standard ?? '',
            phaseOneTime = awsGameTemplate.phaseOneTime ?? 120,
            phaseTwoTime = awsGameTemplate.phaseTwoTime ?? 120,
            imageUrl = awsGameTemplate.imageUrl ?? '',
            createdAt = awsGameTemplate.createdAt ?? '',
            updatedAt = awsGameTemplate.updatedAt ?? ''
        } = awsGameTemplate || {}

        if (isNullOrUndefined(id) ||
            isNullOrUndefined(title) ||
            isNullOrUndefined(owner) ||
            isNullOrUndefined(version) ||
            isNullOrUndefined(description)) {
            throw new Error(
                "Game Template has null field for the attributes that are not nullable"
            )
        }

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
            createdAt,
            updatedAt
        }
        return gameTemplate
    }
}