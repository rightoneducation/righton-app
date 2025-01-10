
import { OpenAI } from "openai";
import ExampleQuestions  from "./lib/exampleQuestions.mjs";
import UnacceptableExplanations from "./lib/UnacceptableExplanations.mjs";
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';


export async function handler(event) {
     const openai = new OpenAI(process.env.OPENAI_API_KEY);
    // Parse input data from the event object
    const body = event.arguments.input;
    const question = body.question;
    const correctAnswer = body.correctAnswer;
    const wrongAnswer = body.wrongAnswer;
    const currentExplanation = body.currentExplanation;
    const currentPrompt = body.currentPrompt ?? '';
    const incorrectMath = body.incorrectMath;
    const toneClarity = body.toneClarity;
    const other = body.other;
    const discardedExplanations = body.discardedExplanations;

    // Define the structured response format
    const StructuredResponse = z.object({
        explanation: z.string(),
      });

    // prompt for open ai
    // first specify the format returned via the role
    let messages = [{
      role: "system",
      content: "You are a helpful teacher's assistant working side-by-side with a teacher. You are designed to output exclusively JSON per the schema defined in response_format."
    }];
    // then provide the actual content
    messages.push({
      role: "user",
      content: 
        `
        Your task is to generate a more plausible explanation for a middle school student's incorrect answer to a math question, taking into account the need to revise a previously rejected explanation. 

        Here are the details you'll work with:
        - Math Question: ${question}. This is the problem the student faced.
        - Correct Answer: ${correctAnswer}. This is the accurate solution to the question.
        - Submitted Wrong Answer: ${wrongAnswer}. The student arrived at this incorrect solution.
        - Previously Rejected Explanation: ${currentExplanation}. This explanation was deemed inadequate for its lack of realism or logical consistency.
        - Discarded Explanations: ${discardedExplanations} - Rejected explanations that should never be regenerated. For each of these, review the discardText and discardType fields and ensure that your generated answer explanations do not follow the same logic. This is the highest priority. For discardType: "0" refers to an incorrect mathematical operation, "1" refers to tone/clarity, and "2" refers to other (and should include a discardText explanation).

        Steps for New Wrong Answer Explanation:
        - If ${currentPrompt} is provided, it contains specific instructions about the previous explanation. Use this as a foundation for your revised explanation.
        - if ${incorrectMath} review the provided explanation and correct the math so that it is accurate.
        - if ${toneClarity} review the provided explanation and ensure that the tone and clarity are appropriate for a middle school student.
        - if ${other} review the provided explanation and the ${currentPrompt} and ensure that the guidance is followed.
        - Avoidance of Discarded Explanations: Some explanations have been completely rejected (${discardedExplanations}). Your new explanation should offer a different perspective, ensuring it does not echo the core misconception communicated in these discarded attempts.
        - Review the unacceptable explanations and do not use the same logic or reasoning.
            Unacceptable Explanations: ${JSON.stringify(UnacceptableExplanations.UnacceptableExplanation, null, 2)}
        - Review the example questions provide below to obtain the correct type of explanation and tone of response. If the question and wrong answer are similar, make use of a similar explanation.
            Example Questions: ${JSON.stringify(ExampleQuestions.ExampleQuestions, null, 2)}   
        - Keep the explanations succinct and clear, focusing on the core misconception that led to the wrong answer.
        - Make the wrong method of thinking clear. It is not enough to say that the student "used a flawed method." Explain what the flaw was.
        - Do not include iterative or unrelated mathematical operations.
        - Do not include random impulses by the student as a cause for the wrong answer.
        - Do not include gessing by the student as a cause for the wrong answer.
          
        Here is an inappropriate example GPT has previously submitted:
            The student may have attempted to average the two rates of speed (2 feet per second and 1/2 foot per second), resulting in an incorrect combined rate of 1.25 feet per second (not a valid operation in this context). Using this incorrect rate to calculate the time to raise the entire 20 feet would lead them to calculate 20 divided by 1.25 equals 16 seconds. Adding some random amount of time due to misunderstanding of changing rates or misinterpretation of what was effective for only part of the duration potentially led them to the erroneous answer of 13.75 seconds

        Here is what is wrong:
            The explanation is based on getting an answer of 16 and then randomly guessing 13.75. This is not acceptable. The explanation needs to be based on the wrong answer provided, with no randomized guesses.

        Here is an appropriate example:
            Students may have confused the relationship between distance, rate and time. Instead of distance = (rate)(time), they may have thought (distance)(rate) = time. To find the height, they then might have thought they needed to solve (d feet)(2 feet/second) = 5 seconds, yielding d = 2.5 feet. [Note that the units in this equation do not make sense: on the left you have (ft)(ft/s), which would result in (ft^2)/s, while on the right you have just seconds.] To get the remaining time it takes to raise the flag the remaining 17.5 feet, they might try to use the same incorrect equation (17.5 feet)(1/2 feet/second) = t seconds, yielding 8.75 seconds. Students might then add 5 + 8.75 seconds to get 13.75 seconds. 

        - After generating an explanation, pause. Review the mathematical operations and ensure they are correct. Avoid introducing additional, unrelated mathematical errors or random guesses from the student. For example, "for no reason" and the like are not acceptable methods of error.
        - After generating an explanation, pause. Ensure that the wrongAnswerPrompt is addressed in the explanation and no discardedExplanations are repeated. For example, if the wrongAnswerPrompt is "shorten to 1 sentence" adjust the output to be a maximum of one sentence in length. 
        - If the wrongAnswePrompt is "shorten the explanation" or "shorten this" or the like, reduce the total number of words of the explanation without losing the underlying meaning.

        Please ensure each explanation for the incorrect answers adheres to the guidelines, caveats, and expectations outlined above, providing clear, concise, and educationally valuable insight into the possible misconceptions leading to the wrong answer.

        Limit your response to 30 words.
        `,
    });
    try {
        // Make the API call to OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', 
            messages: messages,
            response_format: zodResponseFormat(StructuredResponse, 'structuredResponse')
        });
        const content = JSON.parse(completion.choices[0].message.content);
        const structuredData = StructuredResponse.parse(content);
        const explanation = structuredData.explanation;
          
        // Return the response
        return explanation;
    } catch (error) {
        console.error(error);
        // Handle any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error processing your request' }),
        };
    }
};
