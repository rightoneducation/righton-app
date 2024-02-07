export interface IQuestion {
    id: string
    text: string
    choices: Array<IChoice>
    responses: Array<string>
    imageUrl: string
    instructions: Array<string>
    standard: string
    cluster: string
    domain: string
    grade: string
    gameSessionId: string
    order: number
    isConfidenceEnabled: boolean
    isShortAnswerEnabled: boolean
    isHintEnabled: boolean
}

export interface IChoice {
    text: string
    reason: string
    isAnswer: boolean
}