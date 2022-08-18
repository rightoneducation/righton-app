export interface IQuestion {
    id: number
    text: string
    answer?: string | null
    wrongAnswers?: string | null
    imageUrl?: string | null
    instructions?: string | null
    standard?: string | null
    cluster?: string | null
    domain?: string | null
    grade?: string | null
    gameSessionId: string
    order: number
}