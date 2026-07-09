import { AWSModelGameQuestionConnection } from "./AWSModelGameQuestionConnection";

export type AWSQuestionTemplate = {
    id: string,
    userId: string,
    publicPrivateType?: string | null,
    title?: string | null,
    lowerCaseTitle?: string | null,
    owner?: string | null,
    version?: number | null,
    isDraft: number,
    choices?: string | null,
    instructions?: string | null,
    answerSettings?: string | null,
    ccss?: string | null,
    ccssDescription?: string | null,
    domain?: string | null,
    cluster?: string | null,
    grade?: string | null,
    gradeFilter?: string | null,
    standard?: string | null,
    imageUrl?: string | null | undefined,
    timesPlayed?: number | null,
    gameTemplates?:  AWSModelGameQuestionConnection | null,
    gameTemplatesCount: number,
    createdAt?: string | null | undefined,
    updatedAt?: string | null
}