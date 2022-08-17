
export interface ITeamAnswer {
    id: string,
    isChosen?: boolean | null
    text?: string | null
    createdAt: string
    updatedAt: string
    teamMemberAnswersId?: string | null
}