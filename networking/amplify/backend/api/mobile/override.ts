import { AmplifyApiGraphQlResourceStackTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

/**
 * WHY THIS OVERRIDE EXISTS
 * ------------------------
 * Transformer v2 compiles a GameSession <-> Question CloudFormation circular
 * dependency from this schema (GameSession.questions @hasMany Question, plus
 * @auth on both). The cycle is closed by ONE edge: the GameSession index-query
 * resolvers `gameSessionByCode` / `gameSessionByState` authorize via QUESTION's
 * auth function (a cross-stack reference) instead of GameSession's own.
 *
 * The deployed (working) prod stack authorizes those queries with GameSession's
 * OWN `getGameSession` auth function (same stack, no cross-stack edge). This
 * override restores exactly that wiring: it repoints slot 0 (the auth slot) of
 * those two resolvers back to GameSession's own getGameSession auth function,
 * severing GameSession -> Question and breaking the cycle.
 *
 * It changes NO schema directives and NO @auth rules. It only restores the
 * resolver-to-auth-function wiring that ran in production for the past year.
 * See: gamecode-expiry-and-amplify-cycle-handoff.md
 */
export function override(resources: AmplifyApiGraphQlResourceStackTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
  const gs: any = (resources as any).models?.['GameSession'];
  if (!gs) {
    console.log('OVERRIDE: GameSession model not found; skipping.');
    return;
  }

  const resolvers: Record<string, any> = gs.resolvers || {};
  const fns: Record<string, any> = gs.appsyncFunctions || {};

  // 1) Find GameSession's OWN getGameSession auth pipeline function.
  //    Its CFN name looks like "QuerygetGameSessionauth0Function".
  let getGameSessionAuthFn: any = undefined;
  let getGameSessionAuthKey = '';
  for (const [key, fn] of Object.entries(fns)) {
    const name: string = (fn && fn.name) || key;
    if (/getGameSession/i.test(name) && /auth/i.test(name)) {
      getGameSessionAuthFn = fn;
      getGameSessionAuthKey = key;
      break;
    }
  }
  if (!getGameSessionAuthFn) {
    console.log('OVERRIDE: could not locate getGameSession auth function; aborting. fn keys=', Object.keys(fns));
    return;
  }
  const replacementFunctionId = getGameSessionAuthFn.attrFunctionId;
  console.log(`OVERRIDE: using GameSession own auth fn "${getGameSessionAuthKey}" as replacement slot-0`);

  // 2) Repoint slot 0 of the two index-query resolvers to that same-stack auth fn.
  const targetFields = new Set(['gameSessionByCode', 'gameSessionByState', 'gameSessionByClassroomId']);
  for (const [key, resolver] of Object.entries(resolvers)) {
    const fieldName: string = resolver?.fieldName;
    const typeName: string = resolver?.typeName;
    if (typeName !== 'Query' || !targetFields.has(fieldName)) continue;

    const pc: any = resolver.pipelineConfig;
    const current: any[] = (pc && pc.functions) ? [...pc.functions] : [];
    if (current.length === 0) {
      console.log(`OVERRIDE: resolver ${key} (${typeName}.${fieldName}) had no pipeline functions; skipping.`);
      continue;
    }
    const before = String(current[0]);
    current[0] = replacementFunctionId; // swap ONLY the auth slot; keep slots 1..n intact
    resolver.pipelineConfig = { functions: current };
    console.log(`OVERRIDE: ${typeName}.${fieldName} slot0 repointed (was token ${before.slice(0, 40)}...) -> getGameSession auth fn`);
  }
}
