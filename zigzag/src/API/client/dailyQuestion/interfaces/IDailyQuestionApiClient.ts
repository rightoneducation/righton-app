import { IDailyQuestion } from "../../../models/DailyQuestion/IDailyQuestion";

export interface IDailyQuestionAPIClient {
    /**
     * Get a daily question by its ID.
     * @param id - The ID of the daily question to fetch.
     * @returns The daily question if found, undefined if not found.
     * @throws Error if the daily question is not found or if there is an error fetching it.
     */
    getDailyQuestion: (id: string) => Promise<IDailyQuestion | undefined>;
    
    /**
     * Update an existing daily question.
     * @param questionId - The ID of the daily question to update.
     * @param input - The updated daily question data.
     * @returns The updated daily question if successful, undefined if not found.
     * @throws Error if the daily question is not found or if there is an error updating it.
     */
    updateDailyQuestion: (questionId: string, input: IDailyQuestion) => Promise<IDailyQuestion | undefined>;
    
    /**
     * Create a new daily question.
     * @param input - The daily question data to create.
     * @returns The created daily question if successful, undefined if creation fails.
     * @throws Error if there is an error creating the daily question.
     */
    createDailyQuestion: (input: IDailyQuestion) => Promise<IDailyQuestion | undefined>;
    
    /**
     * Delete a daily question by its ID.
     * @param id - The ID of the daily question to delete.
     * @throws Error if the daily question is not found or if there is an error deleting it.
     */
    deleteDailyQuestion: (id: string) => Promise<void>;
}