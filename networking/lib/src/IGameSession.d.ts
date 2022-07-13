export declare enum GameSessionState {
    ChoosingTrickAnswer = "CHOOSING_TRICK_ANSWER",
    Finished = "FINISHED",
    InitialIntro = "INITIAL_INTRO",
    NotStarted = "NOT_STARTED",
    ReviewingResult = "REVIEWING_RESULT",
    Voting = "VOTING"
}
export interface IGameSession {
    id: String;
    gameId: number;
    startTime?: Date;
    phaseOneTime: number;
    phaseTwoTime: number;
    currentQuestionId?: number;
    currentState: GameSessionState;
    gameCode: number;
    updatedAt: Date;
    createdAt: Date;
}
