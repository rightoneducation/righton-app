
import { OpenAI } from "openai"

export async function handler(event) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    // Parse input data from the event object
    const body = JSON.parse(event.body);
    const originalExplanation = body.originalExplanation;
    const editedExplanation = body.editedExplanation;

    // prompt for open ai
    // first specify the format returned via the role
    let messages = [{
      role: "system",
      content: "You are a helpful assistant designed to output a string that exclusively contains the reason for changes between two strings and no headers, or other related information."
    }];
    // then provide the actual content
    messages.push({
      role: "user",
      content: `
        Your task is to generate the reason for changes between two strings. Such reasons could include, shortening the string, removing irrelevant information, adjusting the tone or reading level, or something else. 

        Here are the details you'll work with:
        - Original String: ${originalExplanation}. This is the original string.
        - Edited String: ${editedExplanation}. This is the string that the user edited. Your task is to identify the difference between this string and the original.
        
        Response format: 
        - You should limit your response to a maximum of ten words.

        Example 1:
            OriginalExplanation: The student may have divided 16 first and then gone ahead and mistaken divided by 3 afterwards. 
            EditedExplanation: The student divided by 16 and then divided by 3.

        Desired Response: The text was shortened and redundancies were removed.

        Example 2:
            OriginalExplanation: The student may have performed the division mathematical operation. Then they may have erred significantly in the second step and, ignorantly, divided by 3 again,
            EditedExplanation: They might have just divided by 16 and then divided by three by mistake.

        Desired Response: The text was shortened and tone was adjusted for less formality.
        `
    });
    try {
        // Make the API call to OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', 
            messages: messages,
        });
        // Return the response
        return {
            statusCode: 200,
            body: JSON.stringify({
                editedReason: completion.choices[0].message
            }),
        };
    } catch (error) {
        console.error(error);
        // Handle any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error processing your request' }),
        };
    }
};
