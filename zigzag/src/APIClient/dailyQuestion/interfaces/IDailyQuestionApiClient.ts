import { IDailyQuestion } from "../../../API/models/DailyQuestion/IDailyQuestion";

export interface IDailyQuestionAPIClient {
    getDailyQuestion: (id: string) => Promise<IDailyQuestion | undefined>;
    updateDailyQuestion: (input: Partial<IDailyQuestion> & { id: string }) => Promise<void>;
    updateDQAnalytics: (id: string, updatedAnalytics: Partial<IDailyQuestion['answerAnalytics']>) => Promise<void>;
    addComment: (
        questionId: string,
        comment: { userId: string; comment: string; commentDate?: Date }
    ) => Promise<void>;
    // submitAnswer is superseded by submitAnswers to minimize API calls
    // submitAnswer: (
    //     id: string,
    //     payload: { phase: 1 | 2; answerKey: 'A' | 'B' | 'C' | 'D' }
    // ) => Promise<void>;
    submitAnswers: (
        questionId: string,
        payload: {
            phaseOneAnswerKey?: 'A' | 'B' | 'C' | 'D';
            phaseTwoAnswerKey?: 'A' | 'B' | 'C' | 'D';
        }
    ) => Promise<void>;
}