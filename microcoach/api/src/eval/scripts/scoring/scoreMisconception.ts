import { MisconceptionOutputType, MisconceptionScore } from "../../types"

export const extractMisconceptionForEval = (output: MisconceptionOutputType) => {
  return{
    title: output.title, // for conceptual depth
    example: output.example, // for conceptual depth
    summary: output.misconceptionSummary, // for conceptual depth
    successIndicators: output.successIndicators, // for conceptual depth
    frequencyPercent: output.studentPercent ?? 0, // for frequency
    learningProgressionCount: output.ccssStandards.prerequisiteGaps.length, // for learning progression count
    distractorMap: output.wrongAnswers // for confidence
  }
}

export const scoreMisconceptionFrequency = (frequencyPercent: number) => {
  if (frequencyPercent > 0.5)  return 3;
  if (frequencyPercent > 0.25) return 2;
  if (frequencyPercent > 0.1)  return 1;
  return 0;
}

 export const scoreMisconception = (output: MisconceptionOutputType): MisconceptionScore => {
  const extractedMisconception = extractMisconceptionForEval(output);
  const frequency = scoreMisconceptionFrequency(extractedMisconception.frequencyPercent);
  const learningProgressionInfluence = extractedMisconception.learningProgressionCount;

  // TODO: the remaining four rows. Left at 0 so the shape compiles; they are not
  // scored yet and a 0 here means "not implemented", not "scored zero".
  const studentConfidence = 0;
  const lcMisconceptionEvalScore = 0;
  const conceptualDepth = 0;

  return {
    frequency,
    learningProgressionInfluence,
    studentConfidence,
    lcMisconceptionEvalScore,
    conceptualDepth
  }
}
 