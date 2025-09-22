export const promptCopy = `
           You have previously analyzed the complexity of a text. You used {userPromptLabel} to label the text and then {userPromptAssign} to assign a complexity level to the text.
            Now you will be given a new complexity level for the text. You need to refine the text to match the new complexity level, maintaining the original meaning but incorporating {userPromptAssign} to ensure the text is at the new complexity level.

            Perform this multi-step task:

            STEP 1: Refine the text to match the new complexity level
            Input text: {text}
            Target complexity level: {newComplexity}
            Past analysis reference: {pastAnalysis}
            
            Instructions: Maintain the original meaning of the text but target the past analysis as a means to ensure the text is at the new complexity level. A primary goal of this function is to ensure that it achieves the new complexity level in a single pass.
            
            Store result as: REFINED_TEXT

            STEP 2: BLIND ANALYSIS - Analyze REFINED_TEXT without considering the target
            Use these criteria: {userPromptLabel}
            
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
            
             
            Store result as: ANALYSIS_DATA: {
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
            
            FINAL OUTPUT: Include REFINED_TEXT and ANALYSIS_DATA  according to the structured JSON format here {JSON.stringify(structuredResponseRefine, null, 2)}. All other fields in the structured JSON format should be null. I will be displaying this directly to the user, so ensure that it does not include any other text, introductory passages, explanations etc.
        `;