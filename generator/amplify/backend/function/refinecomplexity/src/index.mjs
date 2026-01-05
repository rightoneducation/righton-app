
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
          .describe("REFINED_TEXT - The text refined to match the target complexity level"),
        newComplexity: z.string()
          .describe("NEW_COMPLEXITY_LEVEL - The new complexity level of the text"),
        analysisData: z.object({
          NUM_SENTENCES: z.number().int()
            .describe("number of sentences in the generated text"),
          NUM_SIMPLE_SENTENCES: z.number().int()
            .describe("number of simple sentences in the generated text"),
          NUM_COMPOUND_SENTENCES: z.number().int()
            .describe("number of compound sentences in the generated text"),
          NUM_BASIC_COMPLEX_SENTENCES: z.number().int()
            .describe("number of basic complex sentences in the generated text"),
          NUM_ADVANCED_COMPLEX_SENTENCES: z.number().int()
            .describe("number of advanced complex sentences in the generated text"),
          PERCENTAGE_SIMPLE: z.number()
            .describe("percentage of all sentences that are simple"),
          PERCENTAGE_COMPOUND: z.number()
            .describe("percentage of all sentences that are compound"),
          PERCENTAGE_BASIC_COMPLEX: z.number()
            .describe("percentage of all sentences that are basic complex"),
          PERCENTAGE_ADVANCED_COMPLEX: z.number()
            .describe("percentage of all sentences that are advanced complex"),
        }).describe("ANALYSIS_DATA - The analysis data of the text"),
        verification: z.object({
          analysisDataExplanation: z.string().describe("Explanation of how ANALYSIS_DATA was used in complexity assignment"),
          complexityMatchesTarget: z.boolean().describe("Does COMPLEXITY_LEVEL match the target complexity?"),
          complexityMatchExplanation: z.string().describe("Explanation of whether complexity matches target and why"),
        }).describe("Verification of the multi-step process"),
        finalReasoning: z.string()
          .describe("The complete reasoning for the final complexity level assignment"),
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
            You will now perform a multi-step task to refine the text to match the new complexity level. Please simulate each step as though it was a separate API call to your OpenAI API.
            Importantly, each call exists in its own context and you should not use any information from previous calls to inform your response. The goal is to achieve the new complexity level in a single pass without the presence of that complexity level informaing the analysis of the newly generated texts complexity level.
            
            In brief, the steps are as follows:
            1. Refine the text to match the new complexity level (input: text, target complexity level, past analysis) (output: refined text)
            2. Blind analysis of the refined text (input: refined text exclusively) (output: analysis data)
            3. Assignment of the complexity level to the refined text (input: analysis data) (output: complexity level)
            4. Verification of the complexity level assignment (input: target complexity level, complexity level) (output: verification)
            5, If verification is unsuccessful, repeat the process with the unsuccessfully refined text as input (input: refined text, target complexity level, past analysis) (output: refined text)

            Detailed Steps:

            STEP 1: 
            Task: Refine the text to match the new complexity level
            Input: {
              Text: ${text}
              Target complexity level: ${newComplexity}
              Past analysis: ${pastAnalysis}
            }
            
            Instructions: Maintain the original meaning of the text but target the past analysis as a means to ensure the text is at the new complexity level. A primary goal of this function is to ensure that it achieves the new complexity level in a single pass.
            Output: {
              Refined text: REFINED_TEXT
            }

            STEP 2: BLIND ANALYSIS of REFINED_TEXT
            Task: Blind analysis of the refined text
            Inputs: {
              Refined text: REFINED_TEXT
            }
            Instructions: Use these criteria: ${userPromptLabel} to analyze the refined text and outut the data. IMPORTANT: Do not use any information from previous calls to inform your response.
            Output: {
              Analysis data: ANALYSIS_DATA
            }
            
            CRITICAL BLIND ANALYSIS STEPS:
            1. Firstly, correctly count the number of sentences in REFINED_TEXT. Store the result as: NUM_SENTENCES.
            2. For each sentence in REFINED_TEXT, determine if it is a simple sentence, a compound sentence, a basic complex sentence, or an advanced complex sentence.
            3. Count the number of sentences in REFINED_TEXT that are simple, compound, basic complex, and advanced complex.
            4. Output the total number of sentences as: NUM_SENTENCES.
            5. Output the number of simple sentences as: NUM_SIMPLE_SENTENCES.
            6. Output the number of compound sentences as: NUM_COMPOUND_SENTENCES.
            7. Output the number of basic complex sentences as: NUM_BASIC_COMPLEX_SENTENCES.
            8. Output the number of advanced complex sentences as: NUM_ADVANCED_COMPLEX_SENTENCES.
            9. Output the percentage of simple sentences as: PERCENTAGE_SIMPLE.
            10. Output the percentage of compound sentences as: PERCENTAGE_COMPOUND.
            11. Output the percentage of basic complex sentences as: PERCENTAGE_BASIC_COMPLEX.
            12. Output the percentage of advanced complex sentences as: PERCENTAGE_ADVANCED_COMPLEX.
            
            Output:
            ANALYSIS_DATA: {
              NUM_SENTENCES: number,
              NUM_SIMPLE_SENTENCES: number,
              NUM_COMPOUND_SENTENCES: number,
              NUM_BASIC_COMPLEX_SENTENCES: number,
              NUM_ADVANCED_COMPLEX_SENTENCES: number,
              PERCENTAGE_SIMPLE: number,
              PERCENTAGE_COMPOUND: number,
              PERCENTAGE_BASIC_COMPLEX: number,
              PERCENTAGE_ADVANCED_COMPLEX: number,
            }

            STEP 3:
            Task: Assignment of the complexity level to the refined text
            Input: {
              Analysis data: ANALYSIS_DATA
            }
            Instructions: Use these criteria: ${userPromptAssign} to assign a complexity level to the refined text. IMPORTANT: Do not use any information from previous calls to inform your response.
            Output: {
              Complexity level: NEW_COMPLEXITY_LEVEL
            }

            STEP 4:
            Task: Verification of the complexity level assignment
            Input: {
              Target complexity level: ${newComplexity}
              Complexity level: NEW_COMPLEXITY_LEVEL
            }
            Instructions: Verify that the complexity level assignment is correct. IMPORTANT: Do not use any information from previous calls to inform your response.
            Output: {
              Verification: VERIFICATION
            }

            STEP 5:
            Task: Only if verification is unsuccessful, repeat the process with the unsuccessfully refined text as input
            Input: {
              Refined text: REFINED_TEXT
              Target complexity level: ${newComplexity}
              Past analysis: ${pastAnalysis}
            }
            Instructions: Repeat the process with the unsuccessfully refined text as input. IMPORTANT: Do not use any information from previous calls to inform your response.
            Output: {
              Refined text: REFINED_TEXT
            }

            OTHERWISE: Final output include REFINED_TEXT and ANALYSIS_DATA according to the structured JSON format here ${JSON.stringify(structuredResponseRefine, null, 2)}. All other fields in the structured JSON format should be null. I will be displaying this directly to the user, so ensure that it does not include any other text, introductory passages, explanations etc.
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
