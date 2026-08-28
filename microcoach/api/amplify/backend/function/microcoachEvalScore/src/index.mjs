import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

export const handler = async (event) => {
  const { MISCONCEPTION, ACTIVITY, LEARNING_COMPONENTS } = event?.arguments?.input?.generatedContent;
  if (!MISCONCEPTION || !ACTIVITY || !LEARNING_COMPONENTS) throw new Error(`Required input parameter missing. Misconception: ${MISCONCEPTION}. Activity: ${ACTIVITY}. Learning Components: ${LEARNING_COMPONENTS}.`);
  
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });
  const MODEL = 'gpt-4o-mini',
  const AnalysisResponse = z.object({
    score: z.string().describe('The overall score (between 0 - 3) assigned from the rubric'),
    aiReasoning: z.array(z.string()).describe('A <250 word description of the reasoning used to arrive at the above score, subtantiated with evidence'),
  });

  const misconceptionEvalUserPrompts = [
    {
      row: `conceptualDepth`,
      prompt: `You are tasked with evaluating the provided misconception (below) and assigning it a score based on the following rubric:
        Metric: Conceptual Depth
        Description: The extent to which a misconception reflects an underlying misunderstanding of the mathematical concept or mental model, rather than primarily an error in carrying out a mathematical procedure or algorithm. Higher Conceptual Depth indicates that the misconception reflects a more fundamental conceptual misunderstanding.
        Categories:
          Category 0:
            Score: 0
            Description: The misconception primarily reflects an error in carrying out a mathematical procedure or algorithm. The underlying mathematical concept appears largely intact.
          Category 1:
            Score: 1
            Description: The misconception reflects mostly procedural difficulty, but there is some evidence of incomplete or emerging conceptual understanding.
          Category 2: 
            Score: 2
            Description: The misconception reflects an incorrect or incomplete understanding of an important mathematical concept, although students may still demonstrate partial conceptual understanding.
          Category 3:
            Score: 3
            Description: The misconception reflects a fundamentally incorrect mental model or core mathematical idea that is likely to affect reasoning across multiple problems or contexts. 

        The misconception is as follows: ${MISCONCEPTION}

        You will provide exclusively JSON in your response per the structured outputs format including the score from the assigned category and a brief description of your reasoning with evidence.
      `.trim(),
    }
  ];

  const nextStepEvalUserPrompts = [
    {
      row: `misconceptionGrounding`,
       prompt: `You are tasked with evaluating the provided classroom activity (below) and assigning it a score based on the following rubric and the supporting material:
        Metric: Misconception Grounding
        Description: Activity directly addresses the identified misconception (or underlying conceptual difficulty), rather than simply providing additional practice on the associated skill.
        Categories:
          Category 0:
            Score: 0
            Description: No connection to the misconception or learning component.
          Category 1:
            Score: 1
            Description: Addresses the learning component but not the misconception itself.
          Category 2: 
            Score: 2
            Description: Targets the identified misconception.
          Category 3:
            Score: 3
            Description: Targets the misconception and supports future learning through connected buildsTowards concepts.

        The activity is as follows: ${ACTIVITY}

        Supporting Material:
          The misconception is as follows: ${MISCONCEPTION}
          The learning components are: ${LEARNING_COMPONENTS}

        You will provide exclusively JSON in your response per the structured outputs format including the score from the assigned category and a brief description of your reasoning with evidence.
      `.trim(),
    },
    {
      row: `classroomFeasability`,
       prompt: `You are tasked with evaluating the provided classroom activity (below) and assigning it a score based on the following rubric:
        Metric: Classroom Feasability
        Description: Extent to which the activity can be realistically implemented in a typical classroom given available time, materials, technology, teacher effort, and classroom management demands. 
        Categories:
          Category 0:
            Score: 0
            Description: Not feasible - The activity is impractical to implement in a typical classroom without substantial additional resources, preparation, technology, time, or logistical support.
          Category 1:
            Score: 1
            Description: Somewhat feasible - The activity could be implemented, but requires substantial teacher preparation, classroom management, specialized resources, or instructional time that may make it impractical in many classrooms.
          Category 2: 
            Score: 2
            Description: Feasible - The activity can reasonably be implemented in a typical classroom with modest preparation, resources, and teacher effort.
          Category 3:
            Score: 3
            Description: Highly feasible - The activity can be implemented easily in a typical classroom with minimal preparation, resources, time, or logistical complexity.

        The activity is as follows: ${ACTIVITY}

        You will provide exclusively JSON in your response per the structured outputs format including the score from the assigned category and a brief description of your reasoning with evidence.
      `.trim(),
    },
     {
      row: `differentiation`,
       prompt: `You are tasked with evaluating the provided classroom activity (below) and assigning it a score based on the following rubric:
        Metric: Differentiation
        Description: Extent to which the activity appropriately differentiates instruction based on students’ differing needs or levels of understanding.
        Categories:
          Category 0:
            Score: 0
            Description: No differentiation - The activity provides essentially the same task, support, and level of challenge to all students, without responding to differences in student needs or understanding.
          Category 1:
            Score: 1
            Description: Limited differentiation - The activity includes some flexibility or optional support, but makes only limited use of differences in student needs or understanding.
          Category 2: 
            Score: 2
            Description: Meaningful differentiation - The activity provides different levels of support, scaffolding, challenge, or instructional pathways that respond to identifiable differences among students. 
          Category 3:
            Score: 3
            Description: Targeted differentiation - The activity is explicitly designed around distinct student needs or misconceptions, providing substantially different and appropriately targeted instruction, tasks, or supports for different students or groups

        The activity is as follows: ${ACTIVITY}

        You will provide exclusively JSON in your response per the structured outputs format including the score from the assigned category and a brief description of your reasoning with evidence.
      `.trim(),
    },
    {
      row: `conceptualChange`,
       prompt: `You are tasked with evaluating the provided classroom activity (below) and assigning it a score based on the following rubric and the supporting materials:
        Metric: Conceptual Change
        Description: The activity shouldn't merely produce correct answers. It should help students revise an incorrect mental model.
        Categories:
          Category 0:
            Score: 0
            Description: Only provides additional practice.
          Category 1:
            Score: 1
            Description: Hints at the misconception.
          Category 2: 
            Score: 2
            Description: Creates opportunities to confront incorrect reasoning.
          Category 3:
            Score: 3
            Description: Explicitly supports conceptual change through explanation, comparison, or reasoning.

        The activity is as follows: ${ACTIVITY}

        Supporting Material:
          The misconception is as follows: ${MISCONCEPTION}

        You will provide exclusively JSON in your response per the structured outputs format including the score from the assigned category and a brief description of your reasoning with evidence.
      `.trim(),
    },
    {
      row: `cognitiveDemand`,
       prompt: `You are tasked with evaluating the provided classroom activity (below) and assigning it a score based on the following rubric and the supporting materials:
        Metric: Cognitive Demand
        Description: The activity should require students to think mathematically (not merely execute procedures).
        Categories:
          Category 0:
            Score: 0
            Description: Memorization only.
          Category 1:
            Score: 1
            Description: Routine procedure.
          Category 2: 
            Score: 2
            Description: Requires explanation or reasoning.
          Category 3:
            Score: 3
            Description: Requires students to justify, compare, or generalize.

        The activity is as follows: ${ACTIVITY}

        You will provide exclusively JSON in your response per the structured outputs format including the score from the assigned category and a brief description of your reasoning with evidence.
      `.trim(),
    }
  ];

  const 

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach, with a specialty in assessment. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(AnalysisResponse, 'analysisResponse'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const structured = AnalysisResponse.parse(JSON.parse(raw));

    return JSON.stringify(structured);
  } catch (error) {
    console.error('[microcoachEvalScore] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
