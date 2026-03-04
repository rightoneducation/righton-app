import { loadSecret } from './util/loadsecrets.mjs';
import { createAndSignRequest } from './util/request.mjs';
import { normalizeCCSSCode } from './util/normalizeCCSS.mjs';

export const handler = async (event) => {
    const endpointSecretName = process.env.ENDPOINT_SECRET_NAME;
    if (!endpointSecretName) throw new Error('SECRET_NAME environment variable is required');
    const apiSecretName = process.env.API_SECRET_NAME;
    if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

    const ccss = event?.arguments?.input?.ccss ?? event?.input?.ccss ?? '';
    if (!ccss) throw new Error('ccss is required');

    const apiSecret = await loadSecret(apiSecretName);
    const apiKey = JSON.parse(apiSecret)['API'];
    const endpointSecret = await loadSecret(endpointSecretName);
    const graphqlEndpoint = JSON.parse(endpointSecret)['ext-endpoint'];

    const possibleCodes = normalizeCCSSCode(ccss) ?? [ccss];
  
    // Build OR condition for all possible code formats
    const whereConditions = possibleCodes
      .map(code => `{ statementCode: "${code}" }`)
      .join(', ');
    
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
  
    try {
      const variables = { 
        ccss
      };
      console.log('[Ext-MCPServerFunctions] getLearningComponentsByCCSS starting request', {
        timestamp: new Date().toISOString(),
        ccss,
        normalizedCodes: normalizeCCSSCode(ccss),
        url: graphqlEndpoint || 'NOT PROVIDED'
      });
      
      const { url: requestUrl, options } = await createAndSignRequest(learningScienceDataQuery, variables, apiKey, graphqlEndpoint);
      if (!requestUrl || !options) throw new Error('createAndSignRequest did not return url/options');
      
      console.log(' Making fetch request', {
        timestamp: new Date().toISOString(),
        url: requestUrl,
        method: options.method,
        hasAPIKeyHeader: !!options.headers['x-api-key'],
        headerCount: Object.keys(options.headers).length
      });
      
      const response = await fetch(requestUrl, options);
      
      console.log('[Ext-MCPServerFunctions] Fetch response received', {
        timestamp: new Date().toISOString(),
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Ext-MCPServerFunctions] HTTP error response', {
          timestamp: new Date().toISOString(),
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText.substring(0, 1000)
        });
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 500)}`);
      }
      
      const data = await response.json();

      console.log('[Ext-MCPServerFunctions] GraphQL response parsed', {
        timestamp: new Date().toISOString(),
        hasData: !!data?.data,
        hasErrors: !!data?.errors,
        errors: data?.errors,
        dataKeys: data ? Object.keys(data) : [],
        responsePreview: JSON.stringify(data).substring(0, 500)
      });

      console.log('[LVN] Raw GraphQL response:', JSON.stringify(data, null, 2));

      if (data?.errors) {
        console.error('GraphQL errors in response', {
          timestamp: new Date().toISOString(),
          errors: data.errors,
          errorCount: Array.isArray(data.errors) ? data.errors.length : 0
        });
      }

      // Normalize field names before returning.
      // Field name semantics:
      //   standardsFrameworkItemsbuildsTowards  = "these items build towards THIS standard"
      //                                         → they come BEFORE this standard = prerequisites
      //   buildsTowardsStandardsFrameworkItems  = "THIS standard builds towards these items"
      //                                         → they come AFTER this standard = future/downstream
      const rawItems = data?.data?.standardsFrameworkItems ?? [];
      const normalized = {
        standards: rawItems.map((item) => ({
          code: item.statementCode,
          description: item.description,
          // Topics students must master first — items that build toward this standard
          prerequisiteStandards: (item.standardsFrameworkItemsbuildsTowards ?? []).map((r) => ({
            code: r.statementCode,
            description: r.description,
          })),
          // Topics that depend on this standard — items this standard builds toward
          futureDependentStandards: (item.buildsTowardsStandardsFrameworkItems ?? []).map((r) => ({
            code: r.statementCode,
            description: r.description,
          })),
          learningComponents: (item.learningComponentssupports ?? []).map((c) => ({
            description: c.description,
          })),
          // LVN: research-backed factors linked to this standard via relevantToStandard
          lvnFactors: (item.factorsrelevantToStandard ?? []).map((f) => ({
            id: f.identifier,
            name: f.name,
            description: f.description,
            category: f.category,
            content: f.content ?? null,
            gradeLevel: f.gradeLevel ?? [],
            academicSubject: f.academicSubject ?? null,
            citations: f.citations ?? [],
            strategies: (f.strategiestargetsFactor ?? []).map((s) => ({
              id: s.identifier,
              name: s.name,
              description: s.description,
              category: s.category ?? null,
              content: s.content ?? null,
              citations: s.citations ?? [],
            })),
            learnerModels: (f.learnerModelshasFactor ?? []).map((m) => ({
              id: m.identifier,
              name: m.name,
              gradeLevel: m.gradeLevel ?? [],
              academicSubject: m.academicSubject ?? null,
            })),
            interactsWith: (f.interactsWithFactorFactors ?? []).map((i) => ({
              id: i.identifier,
              name: i.name,
              category: i.category ?? null,
            })),
          })),
        })),
      };

      return JSON.stringify(normalized);
    } catch (error) {
      console.error('Error making GraphQL request', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ccss,
        url: graphqlEndpoint || 'NOT PROVIDED'
      });
      return JSON.stringify({ data: null, errors: [{ message: error instanceof Error ? error.message : String(error) }] });
    }
}
