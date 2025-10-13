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
            wrongAnswerExplanations,
            wrongAnswerSummaries,
            solutionExplanation, 
            ccss 
    } = parsedEvent;
    
    console.log('Input data:', { question, correctAnswer, wrongAnswers, wrongAnswerExplanations, wrongAnswerSummaries, solutionExplanation, ccss });

    // At least one field must be provided
    if (!question?.trim() && !correctAnswer?.trim() && !wrongAnswers?.length && !wrongAnswerExplanations?.length && !wrongAnswerSummaries?.length && !solutionExplanation?.trim() && !ccss?.trim()) {
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
        
        if (wrongAnswers?.length > 0 && wrongAnswers.some(answer => answer.trim())) providedFields.push('wrongAnswers');
        else missingFields.push('wrongAnswers');
        
        if (wrongAnswerExplanations?.length > 0 && wrongAnswerExplanations.some(explanation => explanation.trim())) providedFields.push('wrongAnswerExplanations');
        else missingFields.push('wrongAnswerExplanations');
        
        if (wrongAnswerSummaries?.length > 0 && wrongAnswerSummaries.some(summary => summary.trim())) providedFields.push('wrongAnswerSummaries');
        else missingFields.push('wrongAnswerSummaries');
        
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
        if (wrongAnswerExplanations?.length > 0) contextInfo += `Wrong Answer Explanations: ${JSON.stringify(wrongAnswerExplanations)}\n`;
        if (wrongAnswerSummaries?.length > 0) contextInfo += `Wrong Answer Summaries: ${JSON.stringify(wrongAnswerSummaries)}\n`;
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
${missingFields.includes('wrongAnswers') ? '- Generate EXACTLY SIX (6) plausible wrong answers that students might choose (common mistakes)\n' : ''}
${missingFields.includes('wrongAnswerExplanations') ? '- Generate explanations for each wrong answer explaining why it is incorrect and what mistake the student likely made\n' : ''}
${missingFields.includes('wrongAnswerSummaries') ? '- Generate short summaries (1-2 sentences) for each wrong answer explanation that capture the key mistake\n' : ''}
${missingFields.includes('solutionExplanation') ? '- Create a detailed step-by-step solution explanation that leads to the correct answer. Format it as "Step 1: [action], Step 2: [action], etc."\n' : ''}
${missingFields.includes('ccss') ? '- Provide the appropriate Common Core State Standards (CCSS) code (e.g., 7.RP.A.3, 8.EE.C.7, 6.NS.B.3)\n' : ''}

CRITICAL REQUIREMENTS:
- For wrong answers: You MUST generate exactly 6 different wrong answers
- Each wrong answer should represent a different type of student mistake
- Wrong answers should be plausible and realistic
- Do NOT generate fewer than 6 wrong answers
- Do NOT generate more than 6 wrong answers
- For wrong answer explanations: Generate exactly 6 explanations, one for each wrong answer
- Each explanation should clearly explain why that specific wrong answer is incorrect
- Explanations should identify the specific mistake the student likely made
- For wrong answer summaries: Generate exactly 6 summaries, one for each wrong answer
- Each summary should be 1-2 sentences that capture the key mistake in a concise way
- Summaries should complement the full explanations by providing a quick overview
- For solution explanation: Format as clear, numbered steps (Step 1:, Step 2:, etc.)
- Each step should be a single, clear action
- Make it easy for students to follow along

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
${missingFields.includes('wrongAnswers') ? '  "wrongAnswers": ["wrong answer 1", "wrong answer 2", "wrong answer 3", "wrong answer 4", "wrong answer 5", "wrong answer 6"], // MUST BE EXACTLY 6 ANSWERS\n' : ''}
${missingFields.includes('wrongAnswerExplanations') ? '  "wrongAnswerExplanations": ["explanation for wrong answer 1", "explanation for wrong answer 2", "explanation for wrong answer 3", "explanation for wrong answer 4", "explanation for wrong answer 5", "explanation for wrong answer 6"], // MUST BE EXACTLY 6 EXPLANATIONS\n' : ''}
${missingFields.includes('wrongAnswerSummaries') ? '  "wrongAnswerSummaries": ["summary for wrong answer 1", "summary for wrong answer 2", "summary for wrong answer 3", "summary for wrong answer 4", "summary for wrong answer 5", "summary for wrong answer 6"], // MUST BE EXACTLY 6 SUMMARIES\n' : ''}
${missingFields.includes('solutionExplanation') ? '  "solutionExplanation": "Step 1: [first action], Step 2: [second action], Step 3: [final action]",\n' : ''}
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
            
            generatedData = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
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
            wrongAnswerExplanations: wrongAnswerExplanations || generatedData.wrongAnswerExplanations || [],
            wrongAnswerSummaries: wrongAnswerSummaries || generatedData.wrongAnswerSummaries || [],
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

        // Ensure exactly 6 wrong answers
        if (!finalData.wrongAnswers || finalData.wrongAnswers.length !== 6) {
            const baseAnswers = finalData.wrongAnswers || [];
            const additionalAnswers = [];
            
            // Add more wrong answers to reach exactly 6
            for (let i = baseAnswers.length; i < 6; i++) {
                additionalAnswers.push(`Wrong answer ${i + 1}`);
            }
            
            finalData.wrongAnswers = [...baseAnswers, ...additionalAnswers];
        }

        // Ensure exactly 6 wrong answer explanations
        if (!finalData.wrongAnswerExplanations || finalData.wrongAnswerExplanations.length !== 6) {
            const baseExplanations = finalData.wrongAnswerExplanations || [];
            const additionalExplanations = [];
            
            // Add more explanations to reach exactly 6
            for (let i = baseExplanations.length; i < 6; i++) {
                additionalExplanations.push(`Explanation for wrong answer ${i + 1}`);
            }
            
            finalData.wrongAnswerExplanations = [...baseExplanations, ...additionalExplanations];
        }

        // Ensure exactly 6 wrong answer summaries
        if (!finalData.wrongAnswerSummaries || finalData.wrongAnswerSummaries.length !== 6) {
            const baseSummaries = finalData.wrongAnswerSummaries || [];
            const additionalSummaries = [];
            
            // Add more summaries to reach exactly 6
            for (let i = baseSummaries.length; i < 6; i++) {
                additionalSummaries.push(`Summary for wrong answer ${i + 1}`);
            }
            
            finalData.wrongAnswerSummaries = [...baseSummaries, ...additionalSummaries];
        }

        // Calculate which fields were actually generated
        const actuallyGeneratedFields = [];
        if (missingFields.includes('question') && generatedData.question) actuallyGeneratedFields.push('question');
        if (missingFields.includes('correctAnswer') && generatedData.correctAnswer) actuallyGeneratedFields.push('correctAnswer');
        if (missingFields.includes('wrongAnswers') && generatedData.wrongAnswers) actuallyGeneratedFields.push('wrongAnswers');
        if (missingFields.includes('wrongAnswerExplanations') && generatedData.wrongAnswerExplanations) actuallyGeneratedFields.push('wrongAnswerExplanations');
        if (missingFields.includes('wrongAnswerSummaries') && generatedData.wrongAnswerSummaries) actuallyGeneratedFields.push('wrongAnswerSummaries');
        if (missingFields.includes('solutionExplanation') && generatedData.solutionExplanation) actuallyGeneratedFields.push('solutionExplanation');
        if (missingFields.includes('ccss') && generatedData.ccss) actuallyGeneratedFields.push('ccss');


        // Return the merged data
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: finalData,
                generatedFields: actuallyGeneratedFields,
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
