import { loadSecret } from './util/loadsecrets.mjs';
import { createAndSignRequest } from './util/request.mjs';
import { normalizeCCSSCode } from './util/normalizeCCSS.mjs';
import { normalizeStandard } from './util/normalizeStandard.mjs';


function countUnits(standards) {
  const sum = (fn) => standards.reduce((n, s) => n + fn(s), 0);
  return {
    standards: standards.length,
    prerequisites: sum((s) => s.prerequisiteStandards.length),
    downstream: sum((s) => s.futureDependentStandards.length),
    children: sum((s) => s.childStandards.length),
    related: sum((s) => s.relatedStandards.length),
    learningComponents: sum((s) => s.learningComponents.length),
    lvnFactors: sum((s) => s.lvnFactors.length),
    lvnStrategies: sum((s) => s.lvnFactors.reduce((n, f) => n + f.strategies.length, 0)),
  };
}

export const handler = async (event) => {
  const startedAt = Date.now();

  const input = event?.arguments?.input ?? event?.input ?? {};
  const ccss = input.ccss ?? '';
  // Added so graph queries can be joined to the session that produced them
  // instead of being matched by CCSS code plus timestamp proximity.
  const sessionId = input.sessionId ?? null;
  const wantTrace = input.trace === true;

  const endpointSecretName = process.env.ENDPOINT_SECRET_NAME;
  if (!endpointSecretName) throw new Error('ENDPOINT_SECRET_NAME environment variable is required');
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');
  if (!ccss) throw new Error('ccss is required');

  const apiSecret = await loadSecret(apiSecretName);
  const apiKey = JSON.parse(apiSecret)['API'];
  const endpointSecret = await loadSecret(endpointSecretName);
  const graphqlEndpoint = JSON.parse(endpointSecret)['ext-endpoint'];

  const possibleCodes = normalizeCCSSCode(ccss);
  const whereConditions = possibleCodes.map((code) => `{ statementCode: "${code}" }`).join(', ');

  const learningScienceDataQuery = `
  {
    standardsFrameworkItems(
      where: {
        AND: [
          { OR: [${whereConditions}] },
          { jurisdiction: "Multi-State" },
          { statementType: "Standard" }
        ]
      }
    ) {
      identifier
      statementCode
      description
      standardsFrameworkItemsbuildsTowards {
        identifier
        statementCode
        description
      }
      buildsTowardsStandardsFrameworkItems {
        identifier
        statementCode
        description
      }
      standardsFrameworkItemshasChild {
        identifier
        statementCode
        description
      }
      standardsFrameworkItemsrelatesTo {
        identifier
        statementCode
        description
      }
      learningComponentssupports {
        identifier
        description
      }
      factorsrelevantToStandard {
        identifier
        name
        description
        category
        gradeLevel
        academicSubject
        strategiestargetsFactor {
          identifier
          name
          description
          category
          gradeLevel
          academicSubject
        }
        learnerModelshasFactor {
          identifier
          name
          description
          gradeLevel
          academicSubject
        }
        interactsWithFactorFactors {
          identifier
          name
          description
        }
      }
    }
  }
  `;

  const requestContext = { ccss, sessionId, normalizedCodes: possibleCodes };

  try {
    console.log('[GetLearningScience] starting request', {
      timestamp: new Date().toISOString(),
      ...requestContext,
      url: graphqlEndpoint || 'NOT PROVIDED',
    });

    const { url: requestUrl, options } = await createAndSignRequest(
      learningScienceDataQuery,
      { ccss },
      apiKey,
      graphqlEndpoint,
    );
    if (!requestUrl || !options) throw new Error('createAndSignRequest did not return url/options');

    const response = await fetch(requestUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 500)}`);
    }

    const data = await response.json();

    if (data?.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors).substring(0, 500)}`);
    }

    const rawItems = data?.data?.standardsFrameworkItems ?? [];
    const standards = rawItems.map(normalizeStandard);
    const units = countUnits(standards);

    // An empty result is not an error, but it must be visible: six sessions in
    // May 2026 generated with no learning-science context and nothing recorded it.
    const matched = standards.length > 0;
    if (!matched) {
      console.warn('[GetLearningScience] NO MATCH — graph returned zero standards', {
        timestamp: new Date().toISOString(),
        ...requestContext,
      });
    }

    console.log('[GetLearningScience] result', {
      timestamp: new Date().toISOString(),
      ...requestContext,
      matched,
      units,
      codes: standards.map((s) => s.code),
      elapsedMs: Date.now() - startedAt,
    });

    const result = { ok: true, matched, standards };
    if (wantTrace) {
      result._trace = {
        ccss,
        sessionId,
        normalizedCodes: possibleCodes,
        endpointHost: (() => {
          try { return new URL(graphqlEndpoint).host; } catch { return null; }
        })(),
        httpStatus: response.status,
        matched,
        units,
        elapsedMs: Date.now() - startedAt,
        query: learningScienceDataQuery,
      };
    }
    return JSON.stringify(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[GetLearningScience] request failed', {
      timestamp: new Date().toISOString(),
      ...requestContext,
      error: message,
      stack: error instanceof Error ? error.stack : undefined,
      url: graphqlEndpoint || 'NOT PROVIDED',
      elapsedMs: Date.now() - startedAt,
    });

    // `standards: []` is kept for backward compatibility with existing callers,
    // but `ok: false` lets an orchestrator distinguish "the graph has nothing for
    // this standard" from "the call failed" — a distinction that was previously
    // impossible and hid a 404, three unresolved secrets and two 403s in May 2026.
    return JSON.stringify({
      ok: false,
      matched: false,
      standards: [],
      error: { message, ccss, sessionId },
    });
  }
};
