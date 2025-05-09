import { AWSModelGameQuestionConnection } from "../AWS/AWSModelGameQuestionConnection";

export type AWSGameTemplate = {
    id: string,
    userId: string,
    title: string,
    lowerCaseTitle: string,
    owner: string,
    version: number,
    description: string,
    lowerCaseDescription: string,
    domain?: string | null | undefined,
    cluster?: string | null | undefined,
    grade?: string | null | undefined,
    ccss?: string | null | undefined,
    standard?: string | null | undefined,
    phaseOneTime?: number | null | undefined,
    phaseTwoTime?: number | null | undefined,
    imageUrl?: string | null | undefined,
    timesPlayed?: number | null,
    questionTemplates?: AWSModelGameQuestionConnection | null,
    questionTemplatesCount: number,
    questionTemplatesOrder: string,
    createdAt?: Date | null,
    updatedAt?: Date | null
}