import { AWSModelGameQuestionConnection } from "./AWSModelGameQuestionConnection";

export type AWSQuestionTemplate = {
    id: string,
    title?: string | null,
    lowerCaseTitle?: string | null,
    owner?: string | null,
    version?: number | null,
    choices?: string | null,
    instructions?: string | null,
    answerSettings?: string | null,
    ccss?: string | null,
    domain?: string | null,
    cluster?: string | null,
    grade?: string | null,
    gradeFilter?: string | null,
    standard?: string | null,
    imageUrl?: string | null | undefined,
    gameTemplates?:  AWSModelGameQuestionConnection | null,
    gameTemplatesCount: number,
    createdAt?: string | null | undefined,
    updatedAt?: string | null
}