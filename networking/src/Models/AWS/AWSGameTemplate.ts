import { IModelGameQuestionConnection } from "../IModelGameQuestionConnection";

export type AWSGameTemplate = {
    id: string,
    title: string,
    owner: string,
    version: number,
    description: string,
    domain?: string | null | undefined,
    cluster?: string | null | undefined,
    grade?: string | null | undefined,
    standard?: string | null | undefined,
    phaseOneTime?: number | null | undefined,
    phaseTwoTime?: number | null | undefined,
    imageUrl?: string | null | undefined,
    questionTemplates?: IModelGameQuestionConnection | null,
    numQuestionTemplates: number,
    createdAt?: string | null | undefined,
    updatedAt?: string | null
}