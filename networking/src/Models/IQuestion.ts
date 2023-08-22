export interface IQuestion {
    id: number
    text: string
    choices?: Array<IChoice> | null
    imageUrl?: string | null
    instructions?: Array<string> | null
    standard?: string | null
    cluster?: string | null
    domain?: string | null
    grade?: string | null
    gameSessionId: string
    order: number
    isHintEnabled: boolean
    isConfidenceEnabled: boolean
}

export interface IChoice {
    text: string
    reason?: string
    isAnswer: boolean
}