// Test helpers: an in-memory store, and the steps run in the state machine's order.
import {
  buildContext,
  stepMisconceptions,
  stepScore,
  stepNeeds,
  stepTemplates,
  stepActivity,
  assembleOutput,
} from '../util/pipeline.mjs';

/** Stands in for util/store.mjs. Keeps JSON text, as S3 does. */
export function memoryStore() {
  const files = new Map();
  return {
    save: async (name, value) => { files.set(name, JSON.stringify(value)); },
    load: async (name) => (files.has(name) ? JSON.parse(files.get(name)) : null),
    names: () => [...files.keys()].sort(),
  };
}

/**
 * Runs every step as the state machine does: in order, one activity at a time,
 * straight to the end when there are no misconceptions.
 * @returns the assembled output, and what each step returned to the state machine
 */
export async function runSteps({ session, assessment, studentResponses, invoke, store = memoryStore() }) {
  const ctx = buildContext({ session, assessment, studentResponses });
  const args = { ctx, store, invoke };
  const returned = {};

  returned.misconceptions = await stepMisconceptions(args);
  if (returned.misconceptions.count === 0) {
    return { output: await assembleOutput({ store }), returned };
  }

  returned.scores = await stepScore(args);
  returned.needs = await stepNeeds(args);
  returned.templates = await stepTemplates(args);
  returned.activities = [];
  for (const index of returned.templates.indexes) {
    returned.activities.push([
      await stepActivity({ ...args, index, pick: 0 }),
      await stepActivity({ ...args, index, pick: 1 }),
    ]);
  }
  return { output: await assembleOutput({ store }), returned };
}
