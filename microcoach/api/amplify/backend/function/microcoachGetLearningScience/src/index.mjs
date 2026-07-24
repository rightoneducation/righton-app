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
    const RESTEndpoint = JSON.parse(endpointSecret)['ext-endpoint'];

    try {
      // first step is to return CASE UUID from CCSS 
      // normalizeCCSS returns an array based on inconsistent HS CCSS
      
      const possibleCodes = normalizeCCSSCode(ccss) ?? [ccss];
      let correctCode = null;
      for (const code of possibleCodes){
        const searchUrl = new URL(`${RESTEndpoint}/academic-standards/search`);
        searchUrl.searchParams.set('statementCode', ccss);
        searchUrl.searchParams.set('normalizedStatementType', 'Standard');
        searchUrl.searchParams.set('jurisdiction', 'Multi-State');
        searchUrl.searchParams.set('limit', '1')

        const { url: requestUrl, options } = await createAndSignRequest(searchUrl, apiKey);
        if (!requestUrl || !options) throw new Error('createAndSignRequest did not return url/options');
        const response = await fetch(requestUrl, options);
      

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 500)}`);
        }

        const searchResults = await response.json();
        if (Array.isArray(searchResults) && searchResults.length > 0){
          correctCode = searchResults[0];
          break;
        }
      }

      if (!correctCode){
        console.error('Error: no standard found');
        return (JSON.stringify({standards: []}));
      }
      
      const caseUUID = correctCode.caseIdentifierUUID;

      const base = `${RESTEndpoint}/academic-standards/${caseUUID}`;

      const [prereqRes, buildsTowardsRes, relatedRes, lcRes, childrenRes] = await Promise.all([
        fetch(`${base}/prerequisites?limit=100`,    { headers: { 'x-api-key': apiKey } }),
        fetch(`${base}/builds-towards?limit=100`,   { headers: { 'x-api-key': apiKey } }),
        fetch(`${base}/related-standards?limit=100`,{ headers: { 'x-api-key': apiKey } }),
        fetch(`${base}/learning-components?limit=100`, { headers: { 'x-api-key': apiKey } }),
        fetch(`${base}/children?limit=100`,         { headers: { 'x-api-key': apiKey } }), // optional
      ]);

      const [prereq, buildsTowards, related, lcs, children] = await Promise.all([
        prereqRes.json(),
        buildsTowardsRes.json(),
        relatedRes.json(),
        lcRes.json(),
        childrenRes.json(),
      ]);

      // Normalize field names before returning.
      const match = correctCode;
      const normalized = {
        standards: [{
          code: match.statementCode,
          description: match.description,
          // Topics students must master first — items that build toward this standard
          prerequisiteStandards: (prereq?.data ?? []).map((r) => ({
            code: r.statementCode,
            description: r.description,
          })),
          // Topics that depend on this standard — items this standard builds toward
          futureDependentStandards: (buildsTowards?.data ?? []).map((r) => ({
            code: r.statementCode,
            description: r.description,
          })),
          learningComponents: (lcs?.data ?? []).map((c) => ({
            description: c.description,
          })),
          // LVN: research-backed factors linked to this standard.
          lvnFactors: [],
        }],
      };

      console.log('[GetLearningScience] Normalized result:', JSON.stringify({
        standardCount: normalized.standards.length,
        standards: normalized.standards.map(s => ({
          code: s.code,
          prerequisiteCount: s.prerequisiteStandards.length,
          prerequisiteStandards: s.prerequisiteStandards,
          futureDependentCount: s.futureDependentStandards.length,
          futureDependentStandards: s.futureDependentStandards,
        })),
      }, null, 2));

      return JSON.stringify(normalized);
    } catch (error) {
      console.error('Error making request', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ccss,
        url: RESTEndpoint || 'NOT PROVIDED'
      });
      return JSON.stringify({ data: null, errors: [{ message: error instanceof Error ? error.message : String(error) }] });
    }
}
