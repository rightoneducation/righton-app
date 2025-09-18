
import { OpenAI } from "openai"
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from "zod";
import { 
  systemPromptLabel, 
  userPromptLabel, 
  userPromptAssign,
} from "./prompt.mjs";

export async function handler(event) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    try {
      console.log(event);
      const body = JSON.parse(event.body);
      const text = body.text;
      const newComplexity = body.newComplexity;
      const pastAnalysis = body.pastAnalysis;
      // prompt for open ai

      const structuredResponseRefine = z.object({
        refinedText: z.string()
          .describe("Text with refined complexity"),
        newComplexity: z.string()
          .describe("The new complexity level of the text"),
      });
      
      // first specify the format returned via the role
      let messages = [{
        role: "system",
        content: systemPromptLabel
      }];
      // then provide the actual content
      messages.push({
        role: "user",
        content: `
            You have previously analyzed the complexity of a text. You used ${userPromptLabel} to label the text and then ${userPromptAssign} to assign a complexity level to the text.
            Now you will be given a new complexity level for the text. You need to refine the text to match the new complexity level, maintaining the original meaning but incorporating ${userPromptAssign} to ensure the text is at the new complexity level.
            Here is the text:
            ${text}
            Here is the new complexity level:
            ${newComplexity}
            Here is the past analysis of the text that assigned the previous complexity level:
            ${pastAnalysis}

            Make sure to maintain the original meaning of the text but target the past analysis as a means to ensure the text is at the new complexity level. A primary goal of this function is to ensure that it achieves the new complexity level in a single pass.

            When finished, pause and analyze the generated text. Perform the following analysis:
            1. ${userPromptLabel}
            2. ${userPromptAssign}
            The output of step 2 will be the new complexity level of the text that will be returned.

            Output exclusively the refined text and the new complexity level according to the structured JSON format here ${JSON.stringify(structuredResponseRefine, null, 2)}. I will be displaying this directly to the user, so ensure that it does not include any other text, introductory passages, explanations etc.
        `,
      });
   
      // Make the API call to OpenAI to label the sentence 
      const completionRefine = await openai.chat.completions.create({
          model: 'gpt-4o-2024-08-06', // config per CZI
          messages: messages,
          response_format: zodResponseFormat(structuredResponseRefine, 'complexityRefinement') // config per CZI
      });
      console.log(completionRefine.choices[0].message.content);
    
      if (completionRefine) {
          return {
          statusCode: 200,
          body: JSON.stringify(completionRefine.choices[0].message.content),
          };
      }
    } catch (error) {
        console.error(error);
        // Handle any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error processing your request' }),
        };
    }
};
