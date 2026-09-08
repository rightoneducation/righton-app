import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { GradeLevelAppropriatenessEvaluator } from '@learning-commons/evaluators';

const GRADE_BANDS = ['K-1', '2-3', '4-5', '6-8', '9-10', '11-CCR'];

async function loadGoogleApiKey() {
  const secretName = process.env.GOOGLE_API_SECRET_NAME || 'google-api';
  const client = new SecretsManagerClient({ region: process.env.REGION || 'us-east-1' });
  const data = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
  if (!data.SecretString) throw new Error(`No SecretString for ${secretName}`);
  const parsed = JSON.parse(data.SecretString);
  return parsed.google_api;
}

function gradeBandIndex(band) {
  const idx = GRADE_BANDS.indexOf(band);
  return idx >= 0 ? idx : -1;
}

function expectedBand(grade) {
  if (grade <= 1) return 'K-1';
  if (grade <= 3) return '2-3';
  if (grade <= 5) return '4-5';
  if (grade <= 8) return '6-8';
  if (grade <= 10) return '9-10';
  return '11-CCR';
}

function classifyResult(score, grade) {
  const expected = expectedBand(grade);
  const expectedIdx = gradeBandIndex(expected);
  const actualIdx = gradeBandIndex(score);
  if (actualIdx < 0 || expectedIdx < 0) return 'unknown';
  if (actualIdx === expectedIdx) return 'atGrade';
  if (actualIdx < expectedIdx) return 'belowGrade';
  return 'aboveGrade';
}

export const handler = async (event) => {
  console.log('Event received:', JSON.stringify({ grade: event.grade, textCount: event.texts?.length }));

  const { grade, texts } = event;
  if (!grade || !texts?.length) {
    return { evaluations: [], summary: { total: 0, atGrade: 0, aboveGrade: 0, belowGrade: 0 } };
  }

  const googleApiKey = await loadGoogleApiKey();

  const evaluator = new GradeLevelAppropriatenessEvaluator({
    googleApiKey,
    maxRetries: 2,
    logLevel: 'ERROR',
  });

  // Evaluate all texts in parallel (with concurrency limit to avoid rate limits)
  const CONCURRENCY = 6;
  const evaluations = [];

  for (let i = 0; i < texts.length; i += CONCURRENCY) {
    const batch = texts.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (t) => {
        console.log(`  Evaluating: ${t.type} — ${t.label}`);
        const result = await evaluator.evaluate(t.text);
        return {
          id: t.id,
          type: t.type,
          label: t.label,
          score: result.score,
          reasoning: result.reasoning,
          classification: classifyResult(result.score, grade),
        };
      })
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      if (r.status === 'fulfilled') {
        evaluations.push(r.value);
      } else {
        const t = batch[j];
        console.error(`  ✗ Failed: ${t.type} — ${t.label}: ${r.reason?.message}`);
        evaluations.push({
          id: t.id,
          type: t.type,
          label: t.label,
          score: 'error',
          reasoning: r.reason?.message ?? 'Evaluation failed',
          classification: 'unknown',
        });
      }
    }
  }

  const summary = {
    total: evaluations.length,
    atGrade: evaluations.filter((e) => e.classification === 'atGrade').length,
    aboveGrade: evaluations.filter((e) => e.classification === 'aboveGrade').length,
    belowGrade: evaluations.filter((e) => e.classification === 'belowGrade').length,
    expectedBand: expectedBand(grade),
  };

  console.log(`Evaluation complete: ${JSON.stringify(summary)}`);
  return { evaluations, summary };
};
