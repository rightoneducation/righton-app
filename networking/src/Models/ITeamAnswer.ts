
export interface ITeamAnswer {
    id: string,
    questionId?: number | null
    isChosen?: boolean | null
    text?: string | null
    createdAt?: string
    updatedAt?: string
    teamMemberAnswersId?: string | null
}