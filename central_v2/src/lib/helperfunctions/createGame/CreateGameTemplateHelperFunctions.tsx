import { 
    CreatePrivateGameTemplateInput,
    CreatePublicGameTemplateInput,
    CentralQuestionTemplateInput,
    IQuestionTemplate,
    AnswerType
} from "@righton/networking";

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

export const assembleQuestionTemplate = (template: IQuestionTemplate): CentralQuestionTemplateInput => {
    const correctAnswer = template.choices?.find((choice) => choice.isAnswer);
    const incorrectAnswers = template.choices?.filter((choice) => !choice.isAnswer);
    const blankIncorrectAnswers = Array.from({ length: 3 }, (_, i) => ({
        id: `card-${i + 1}`,
        answer: '',
        explanation: '',
        isFirstEdit: true,
        isCardComplete: true
    }));
    const incorrectCards = incorrectAnswers?.map((answer, index) => ({
        id: `card-${index + 1}`,
        answer: answer.text,
        explanation: answer.reason,
        isFirstEdit: true,
        isCardComplete: true
    })) ?? blankIncorrectAnswers;
    
    return {
       questionCard: {
            title: template.title,
            ccss: template.ccss,
            isFirstEdit: true,
            isCardComplete: true,
            imageUrl: template.imageUrl ?? '',
        },
        correctCard: {
            answer: correctAnswer?.text ?? '',
            answerSteps: template.instructions ?? [],
            answerSettings: {
                answerType: template.answerSettings?.answerType ?? AnswerType.STRING,
                answerPrecision: template.answerSettings?.answerPrecision
            },
            isFirstEdit: true,
            isCardComplete: true,
        },
        incorrectCards,
    }
}