
export interface ITeamAnswer {
    id: string,
    questionId?: number | null
    isChosen: boolean
    text?: string | null
    createdAt?: string
    updatedAt?: string
    teamMemberAnswersId?: string | null
    isTrickAnswer: boolean
}