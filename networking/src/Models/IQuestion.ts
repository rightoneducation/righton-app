export interface IQuestion {
    id: number
    text: string
    answer?: string | null
    wrongAnswers?: Array<QuestionWrongAnswer> | null
    imageUrl?: string | null
    instructions?: Array<string> | null
    standard?: string | null
    cluster?: string | null
    domain?: string | null
    grade?: string | null
    gameSessionId: string
    order: number
}

interface QuestionWrongAnswer {
    wrongAnswer: string
    reason: string
}