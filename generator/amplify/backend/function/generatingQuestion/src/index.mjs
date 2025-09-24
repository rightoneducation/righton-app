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
    const { 
        question, 
        correctAnswer, 
        wrongAnswers, 
        solutionExplanation, 
        ccss 
    } = parsedEvent;
    
    console.log('Input data:', { question, correctAnswer, wrongAnswers, solutionExplanation, ccss });

    // At least one field must be provided
    if (!question?.trim() && !correctAnswer?.trim() && !wrongAnswers?.length && !solutionExplanation?.trim() && !ccss?.trim()) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'At least one field must be provided' })
        };
    }

    try {
        // Determine which fields are provided and which need to be generated
        const providedFields = [];
        const missingFields = [];
        
        if (question?.trim()) providedFields.push('question');
        else missingFields.push('question');
        
        if (correctAnswer?.trim()) providedFields.push('correctAnswer');
        else missingFields.push('correctAnswer');
        
        if (wrongAnswers?.length > 0) providedFields.push('wrongAnswers');
        else missingFields.push('wrongAnswers');
        
        if (solutionExplanation?.trim()) providedFields.push('solutionExplanation');
        else missingFields.push('solutionExplanation');
        
        if (ccss?.trim()) providedFields.push('ccss');
        else missingFields.push('ccss');

        console.log('Provided fields:', providedFields);
        console.log('Missing fields:', missingFields);

        // Create dynamic prompt based on provided context
        let contextInfo = '';
        if (question?.trim()) contextInfo += `Question: "${question}"\n`;
        if (correctAnswer?.trim()) contextInfo += `Correct Answer: "${correctAnswer}"\n`;
        if (wrongAnswers?.length > 0) contextInfo += `Wrong Answers: ${JSON.stringify(wrongAnswers)}\n`;
        if (solutionExplanation?.trim()) contextInfo += `Solution Explanation: "${solutionExplanation}"\n`;
        if (ccss?.trim()) contextInfo += `CCSS: "${ccss}"\n`;

        const prompt = `
You are an expert math teacher creating a comprehensive question for middle school students. 

CONTEXT PROVIDED:
${contextInfo}

TASK: Generate the missing fields based on the provided context. The more context you have, the more accurate and consistent your generation should be.

MISSING FIELDS TO GENERATE: ${missingFields.join(', ')}

INSTRUCTIONS:
${missingFields.includes('question') ? '- Generate a clear, age-appropriate math question that aligns with the provided context\n' : ''}
${missingFields.includes('correctAnswer') ? '- Provide the correct answer that matches the question and context\n' : ''}
${missingFields.includes('wrongAnswers') ? '- Generate three plausible wrong answers that students might choose (common mistakes)\n' : ''}
${missingFields.includes('solutionExplanation') ? '- Create a detailed step-by-step solution explanation that leads to the correct answer\n' : ''}
${missingFields.includes('ccss') ? '- Provide the appropriate Common Core State Standards (CCSS) code (e.g., 7.RP.A.3, 8.EE.C.7, 6.NS.B.3)\n' : ''}

IMPORTANT: 
- Maintain consistency with the provided context
- If you have the correct answer, ensure wrong answers are plausible mistakes
- If you have wrong answers, ensure the correct answer is clearly different
- The solution explanation should always lead to the correct answer
- CCSS should match the mathematical concept and grade level

Please respond in the following JSON format (only include the fields you need to generate):
{
${missingFields.includes('question') ? '  "question": "the math question",\n' : ''}
${missingFields.includes('correctAnswer') ? '  "correctAnswer": "the correct answer",\n' : ''}
${missingFields.includes('wrongAnswers') ? '  "wrongAnswers": ["wrong answer 1", "wrong answer 2", "wrong answer 3"],\n' : ''}
${missingFields.includes('solutionExplanation') ? '  "solutionExplanation": "step-by-step explanation of how to solve the problem",\n' : ''}
${missingFields.includes('ccss') ? '  "ccss": "appropriate CCSS code"\n' : ''}
}
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

        // Merge provided data with generated data
        const finalData = {
            question: question || generatedData.question || '',
            correctAnswer: correctAnswer || generatedData.correctAnswer || '',
            wrongAnswers: wrongAnswers || generatedData.wrongAnswers || [],
            solutionExplanation: solutionExplanation || generatedData.solutionExplanation || '',
            ccss: ccss || generatedData.ccss || ''
        };

        // Validate that we have at least the essential fields
        if (!finalData.question && !finalData.correctAnswer) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to generate essential question data' })
            };
        }

        console.log('Final merged data:', finalData);

        // Return the merged data
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: finalData,
                generatedFields: missingFields.filter(field => generatedData[field]),
                providedFields: providedFields
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
