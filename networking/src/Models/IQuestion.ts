export interface IQuestion {
    id: number
    text: string
    choices?: Array<Choice> | null
    imageUrl?: string | null
    instructions?: Array<string> | null
    standard?: string | null
    cluster?: string | null
    domain?: string | null
    grade?: string | null
    gameSessionId: string
    order: number
}

export interface Choice {
    text: string
    reason?: string
    isAnswer: boolean
}