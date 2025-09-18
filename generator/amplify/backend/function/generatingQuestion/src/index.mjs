/* Amplify Params - DO NOT EDIT
	API_WRONGANSWEREXP_GRAPHQLAPIENDPOINTOUTPUT
	API_WRONGANSWEREXP_GRAPHQLAPIIDOUTPUT
	API_WRONGANSWEREXP_GRAPHQLAPIKEYOUTPUT
	API_WRONGANSWEREXP_QUESTIONSTABLE_ARN
	API_WRONGANSWEREXP_QUESTIONSTABLE_NAME
	AUTH_GENERATORAUTH_USERPOOLID
	ENV
	FUNCTION_REGENWRONGANSWEREXP_NAME
	FUNCTION_WRONGANSWEREXP_NAME
	REGION
Amplify Params - DO NOT EDIT */

import { OpenAI } from 'openai';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    
    // Parse input data from the event object
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Request body is required' })
        };
    }
    
    const parsedEvent = JSON.parse(event.body);
    const { question } = parsedEvent;
    
    console.log('Question:', question);

    if (!question || question.trim() === '') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Question is required' })
        };
    }

    try {
        // Create the prompt for OpenAI
        const prompt = `
You are an expert math teacher creating a comprehensive question for middle school students. Given the following math question, please provide:

1. The correct answer
2. Three plausible wrong answers that students might choose
3. A detailed solution explanation showing the steps to solve the problem that leads to the correct answer
4. The appropriate Common Core State Standards (CCSS) code

Question: "${question}"

Please respond in the following JSON format:
{
  "correctAnswer": "the correct answer",
  "wrongAnswers": ["wrong answer 1", "wrong answer 2", "wrong answer 3"],
  "solutionExplanation": "step-by-step explanation of how to solve the problem",
  "ccss": "appropriate CCSS code (e.g., 7.RP.A.3, 8.EE.C.7, 6.NS.B.3)"
}

Make sure the wrong answers are plausible mistakes that students might make, and the solution explanation is clear and educational.
`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert math teacher who creates educational content for middle school students. Always respond with valid JSON format.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        // Parse the response
        const responseContent = completion.choices[0].message.content;
        let generatedData;
        
        try {
            // Clean the response content - remove markdown code blocks if present
            let cleanedContent = responseContent.trim();
            
            // Remove markdown code blocks (```json ... ```)
            if (cleanedContent.startsWith('```json')) {
                cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanedContent.startsWith('```')) {
                cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            // Remove any leading/trailing backticks or other markdown
            cleanedContent = cleanedContent.replace(/^`+|`+$/g, '').trim();
            
            console.log('Cleaned response content:', cleanedContent);
            generatedData = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
            console.error('Original response content:', responseContent);
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: 'Failed to parse AI response',
                    originalResponse: responseContent,
                    parseError: parseError.message
                })
            };
        }

        // Validate the response structure
        if (!generatedData.correctAnswer || !generatedData.wrongAnswers || !generatedData.solutionExplanation || !generatedData.ccss) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Invalid response structure from AI' })
            };
        }

        // Return the generated data
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: {
                    question: question,
                    correctAnswer: generatedData.correctAnswer,
                    wrongAnswers: generatedData.wrongAnswers,
                    solutionExplanation: generatedData.solutionExplanation,
                    ccss: generatedData.ccss
                }
            })
        };

    } catch (error) {
        console.error('Error in autoQuestionGenerator:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};
