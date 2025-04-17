import { CreatePrivateGameQuestionsInput, CreatePrivateGameTemplateInput, CreatePublicGameTemplateInput } from "@righton/networking";

type GameTemplate = CreatePrivateGameTemplateInput | CreatePublicGameTemplateInput;

export const createGameTemplate = (template: GameTemplate) => {
return {
    title: template.title,
    lowerCaseTitle: template.title.toLowerCase(),
    description: template.description,
    lowerCaseDescription: template.description.toLowerCase(),
    questionTemplatesCount: 0,
    version: 0,
    phaseOneTime: template.phaseOneTime,
    phaseTwoTime: template.phaseTwoTime,
    ccss: template?.ccss,
    grade: template?.ccss?.split(".")[0],
    gradeFilter: template?.ccss?.split(".")[0],
    domain: template?.ccss?.split(".")[1],
    cluster: template?.ccss?.split(".")[2],
    standard: template?.ccss?.split(".")[3],
    imageUrl: template?.imageUrl
    }
}