import { AWSModelGameQuestionConnection } from "./AWSModelGameQuestionConnection";

export type AWSQuestionTemplate = {
    id: string,
    title?: string | null,
    owner?: string | null,
    version?: number | null,
    choices?: string | null,
    instructions?: string | null,
    answerSettings?: string | null,
    domain?: string | null,
    cluster?: string | null,
    grade?: string | null,
    standard?: string | null,
    imageUrl?: string | null | undefined,
    gameTemplates?:  AWSModelGameQuestionConnection | null,
    createdAt: string,
    updatedAt: string
}