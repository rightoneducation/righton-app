
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
            Now you will be given a new complexity level for the text. You need to refine the text to match the new complexity level, maintaining the original meaning but incorporating ${userPromptAssign} to ensure the text is at the new complexity level.

            Perform this multi-step task:

            STEP 1: Refine the text to match the new complexity level
            Input text: ${text}
            Target complexity level: ${newComplexity}
            Past analysis reference: ${pastAnalysis}
            
            Instructions: Maintain the original meaning of the text but target the past analysis as a means to ensure the text is at the new complexity level. A primary goal of this function is to ensure that it achieves the new complexity level in a single pass.
            
            Store result as: REFINED_TEXT

            STEP 2: BLIND ANALYSIS - Analyze REFINED_TEXT without considering the target
            Use these criteria: ${userPromptLabel}
            
            CRITICAL: Forget that you refined this text for a specific complexity level. Analyze the sentences OBJECTIVELY as if this were a completely separate text. Do NOT consider what complexity level you want to achieve.
            
            Store result as: ANALYSIS_DATA

            STEP 3: OBJECTIVE ASSIGNMENT - Use ANALYSIS_DATA to determine complexity
            Apply these rules: ${userPromptAssign}
            
            CRITICAL: Assign complexity based ONLY on the statistics from your analysis. Do NOT consider what complexity level you want to achieve or what you were targeting.
            
            Store result as: COMPLEXITY_LEVEL

            STEP 4: Compare and verify
            TARGET COMPLEXITY: ${newComplexity}
            ASSIGNED COMPLEXITY: [Your result from step 3]
            
            VERIFICATION:
            - Did I correctly use REFINED_TEXT in step 2? [Yes/No + explanation]
            - Did I correctly use ANALYSIS_DATA in step 3? [Yes/No + explanation]
            - Does COMPLEXITY_LEVEL match target "${newComplexity}"? [Yes/No + explanation]
            - Did I perform objective analysis without considering the target complexity? [Yes/No + explanation]

            IMPORTANT EXAMPLE: 

            Here is an example that you have incorrectly assigned as slightly complex:
            {
              "refinedText": "The student likely misunderstood the problem, overlooking that the rate of 1/2 foot per second applies after the initial 5 seconds. Initially, the child raised the flag 10 feet in 5 seconds (2 feet per second). They mistakenly concluded the process took only 10 seconds, not accounting for the extra 10 feet raised at 1/2 foot per second, which adds time.",
              "newComplexity": "Slightly Complex",
              "verification": {
                  "analysisDataExplanation": "The analysis of the refined text shows that it contains 4 sentences: one compound sentence and three simple sentences. There are no advanced complex sentences, which fits the requirement that Slightly Complex texts must not contain any advanced complex sentences. The presence of simple and compound sentences is sufficient to categorize this text as Slightly Complex, as the number of simple sentences constitutes 75% which exceeds the necessary 50% threshold.",
                  "complexityMatchesTarget": true,
                  "complexityMatchExplanation": "The refined text matches the target of Slightly Complex because it consists predominantly of simple and compound sentences (75% simple sentences) and does not contain any advanced complex sentences."
              },
              "finalReasoning": "The refined text has been structured to predominantly feature simple sentences with straightforward clauses, lacking the complex multi-clause structure that characterizes more advanced complexity levels. This matches the definition of Slightly Complex, as it contains simple and straightforward sentence structures."
            }
            Here is the correct analysis (assigning moderately complex):
            The text consists of 3 sentences: 1 simple, 1 basic complex, and 1 advanced complex sentence. The percentage of simple sentences is 33.33%, which is less than 50%, so the text cannot be classified as Slightly Complex. There is only 1 advanced complex sentence, which is less than the 3 required for the text to be classified as Very Complex. Since there are not more than 2 advanced complex sentences, the text can be considered Moderately Complex. Therefore, the text falls into the Moderately Complex category.

            MAKE SURE THAT YOU ARE CORRECTLY USING THE ANALYSIS FRAMEWORK SO THAT YOU PREVENT INCORRECTLY ASSIGNING THE COMPLEXITY LEVEL LIKE IN THE EXAMPLE ABOVE.

            IMPORTANT: Ensure that you are always reviewing the explanation analyzing it per the above and returning a correct complexity level. If the level doesn't match the desired complexity, ensure that you are refining again using the same process.

            FINAL PROCESS CHECK:
            Before outputting your response, verify:
            1. I have REFINED_TEXT from step 1
            2. I have detailed ANALYSIS_DATA from step 2 with sentence-by-sentence breakdown
            3. I have COMPLEXITY_LEVEL from step 3 with explicit reference to analysis data
            4. I have verification explanations from step 4
            
            If any component is missing or incomplete, go back and complete that step properly.
            
            FINAL OUTPUT: Include REFINED_TEXT, COMPLEXITY_LEVEL, and verification explanations according to the structured JSON format here ${JSON.stringify(structuredResponseRefine, null, 2)}. I will be displaying this directly to the user, so ensure that it does not include any other text, introductory passages, explanations etc.
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
