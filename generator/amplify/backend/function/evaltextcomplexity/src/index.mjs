
import { OpenAI } from "openai"
import { zodResponseFormat } from 'openai/helpers/zod';
import { 
  systemPromptLabel, 
  userPromptLabel, 
  structuredResponseLabel,
  systemPromptAssign,
  userPromptAssign,
  structuredResponseAssign
} from "./prompt.mjs";

export async function handler(event) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    try {
      console.log(event);
      const text = JSON.parse(event.body).text;
      console.log(text);
      // prompt for open ai
      // first specify the format returned via the role
      let messages = [{
        role: "system",
        content: systemPromptLabel
      }];
      // then provide the actual content
      messages.push({
        role: "user",
        content: userPromptLabel.replace("{text}", text)
      });
      console.log(messages);
      // Make the API call to OpenAI to label the sentence 
      const completionLabel = await openai.chat.completions.create({
        model: 'gpt-4o-2024-08-06', // config per CZI
        messages: messages,
        response_format: zodResponseFormat(structuredResponseLabel, 'textComplexityAnalysis') // config per CZI
      });
      console.log(completionLabel.choices[0].message.content);
      if (completionLabel) {
        const statistics = JSON.parse(completionLabel.choices[0].message.content);
        const userPromptAssignWithStats = userPromptAssign.replace(
          "{statistics}",
          JSON.stringify(statistics, null, 2)
        );

        let messagesAssign = [{
          role: "system",
          content: systemPromptAssign
        }];
        messagesAssign.push({
          role: "user",
          content: userPromptAssignWithStats
        });
        const completionAssign = await openai.chat.completions.create({
          model: 'gpt-4o-2024-08-06', // config per CZI
          messages: messagesAssign,
          response_format: zodResponseFormat(structuredResponseAssign, 'complexityAssignment') // config per CZI
        });
        if (completionAssign) {
          return {
            statusCode: 200,
            body: JSON.stringify(completionAssign.choices[0].message.content),
          };
        }
      } else {
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Error processing your request' }),
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
