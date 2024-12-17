
import { OpenAI } from "openai";
import ExampleQuestions  from "./lib/exampleQuestions.mjs";
import UnacceptableExplanations from "./lib/UnacceptableExplanations.mjs";
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';


export async function handler(event) {
     const openai = new OpenAI(process.env.OPENAI_API_KEY);
    // Parse input data from the event object
    const question = event.arguments.input.question;
    const correctAnswer = event.arguments.input.correctAnswer;
    const wrongAnswer = event.arguments.input.wrongAnswer;
    const discardedExplanations = event.arguments.input.discardedExplanations;

    const StructuredResponse = z.object({
        wrongAnswerExplanation: z.string(),
      });
    console.log('here');
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
        Your task is to develop explanations for incorrect answers given by middle school students to a specific math question. Each explanation should identify the likely misconceptions or errors that led to the student's wrong answer.

        Input Parameters:
        - Math Question: ${question} - The problem posed to the student.
        - Correct Answer: ${correctAnswer} - The accurate solution.
        - Wrong Answers Provided: ${wrongAnswer} - The incorrect response given by students.
        - Discarded Explanations: ${discardedExplanations} - Rejected explanations that should never be regenerated. For each of these, review the discardText and discardType fields and ensure that your generated answer explanations do not follow the same logic. This is the highest priority. For discardType: "0" refers to an incorrect mathematical operation, "1" refers to tone/clarity, and "2" refers to other (and should include a discardText explanation).        

        Steps to generate explanations:
        - Review the discarded explanations to avoid repeating the same mistakes.
        - Review the unacceptable explanations and do not use the same logic or reasoning.
            Unacceptable Explanations: ${JSON.stringify(UnacceptableExplanations.UnacceptableExplanation, null, 2)}
        - Review the example questions provide below to obtain the correct type of explanation and tone of response. If the question and wrong answer are similar, make use of a similar explanation.
           Example Questions: ${JSON.stringify(ExampleQuestions.ExampleQuestions, null, 2)}
        - Ensure that each explanation is unique and addresses a different misconception or error.
        - Keep the explanations succinct and clear, focusing on the core misconception that led to the wrong answer.
        - Make the wrong method of thinking clear. It is not enough to say that the student "used a flawed method." Explain what the flaw was.
        - Do not include iterative or unrelated mathematical operations.
        - Do not include random impulses by the student. 
        
        Here is an inappropriate example GPT has previously submitted:
            The student may have attempted to average the two rates of speed (2 feet per second and 1/2 foot per second), resulting in an incorrect combined rate of 1.25 feet per second (not a valid operation in this context). Using this incorrect rate to calculate the time to raise the entire 20 feet would lead them to calculate 20 divided by 1.25 equals 16 seconds. Adding some random amount of time due to misunderstanding of changing rates or misinterpretation of what was effective for only part of the duration potentially led them to the erroneous answer of 13.75 seconds

        Here is what is wrong:
            The explanation is based on getting an answer of 16 and then randomly guessing 13.75. This is not acceptable. The explanation needs to be based on the wrong answer provided, with no randomized guesses.

        Here is an appropriate example:
            Students may have confused the relationship between distance, rate and time. Instead of distance = (rate)(time), they may have thought (distance)(rate) = time. To find the height, they then might have thought they needed to solve (d feet)(2 feet/second) = 5 seconds, yielding d = 2.5 feet. [Note that the units in this equation do not make sense: on the left you have (ft)(ft/s), which would result in (ft^2)/s, while on the right you have just seconds.] To get the remaining time it takes to raise the flag the remaining 17.5 feet, they might try to use the same incorrect equation (17.5 feet)(1/2 feet/second) = t seconds, yielding 8.75 seconds. Students might then add 5 + 8.75 seconds to get 13.75 seconds. 

        - After generating an explanation, pause. Review the mathematical operations and ensure they are correct. Avoid introducing additional, unrelated mathematical errors or random guesses from the student. For example, "for no reason" and the like are not acceptable methods of error.
        - After reviewing above, pause. Review that the output is a valid JSON string and that running JSON.parse will not result in an error. Pay special consideration to escape characters and do not embed any Latex formatting that could compromise this.

        Please ensure that the explanation for the incorrect answer adheres to the guidelines, caveats, and expectations outlined above, providing clear, concise, and educationally valuable insight into the possible misconceptions leading to the wrong answer.
        `,
    });
    console.log(messages);
    try {
        // Make the API call to OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', 
            messages: messages,
            response_format: zodResponseFormat(StructuredResponse, 'structuredResponse')
        });
        const content = JSON.parse(completion.choices[0].message.content);
        const structuredData = StructuredResponse.parse(content);
        const explanation = structuredData.wrongAnswerExplanation;
        // Return the response
        return {
            statusCode: 200,
            body: explanation,
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

