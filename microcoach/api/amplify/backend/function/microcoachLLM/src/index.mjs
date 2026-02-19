import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const StructuredResponse = z.object({
  synthesis: z.string().describe('Analysis that interprets classroom data in light of the learning science data'),
  keyFindings: z.array(z.string()).optional().describe('Bullet-point findings from the analysis'),
});

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const classroomData = event?.arguments?.input?.classroomData ?? event?.input?.classroomData;
  const learningScienceData = event?.arguments?.input?.learningScienceData ?? event?.input?.learningScienceData;

  if (classroomData == null) throw new Error('classroomData is required');
  if (learningScienceData == null) throw new Error('learningScienceData is required');

  const apiSecret = await loadSecret(apiSecretName);
  const secretPayload = JSON.parse(apiSecret);
  const apiKey = secretPayload.openai_api ?? secretPayload.OPENAI_API_KEY ?? secretPayload.API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  const systemContent = `You are an expert educational analyst. You analyze classroom data using learning science frameworks and standards. You output exclusively valid JSON per the schema defined in response_format.`;

  const userContent = `
Analyze the following classroom data using the provided learning science data.

Learning science data (standards, frameworks, relationships, learning components):
${typeof learningScienceData === 'string' ? learningScienceData : JSON.stringify(learningScienceData, null, 2)}

Classroom data to analyze:
${typeof classroomData === 'string' ? classroomData : JSON.stringify(classroomData, null, 2)}

Tasks:
- Interpret the classroom data in light of the learning science data (standards, progressions, learning components).
- Produce a concise synthesis that connects what is happening in the classroom to the standards and learning science.
- Optionally list key findings as short bullet points.

Output your analysis as JSON with "synthesis" (required) and "keyFindings" (optional array of strings).
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(StructuredResponse, 'structuredResponse'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const parsed = JSON.parse(raw);
    const structured = StructuredResponse.parse(parsed);

    return JSON.stringify(structured);
  } catch (error) {
    console.error('[microcoachLLM] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
