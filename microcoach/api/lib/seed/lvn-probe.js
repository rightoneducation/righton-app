"use strict";
/**
 * lvn-probe.js — test LVN data coverage across the full CCSS dictionary
 *
 * Run from the api/ directory:
 *   APPSYNC_SECRET_NAME=microcoach node lib/seed/lvn-probe.js
 *
 * Optional: pass specific codes as args to test a subset:
 *   APPSYNC_SECRET_NAME=microcoach node lib/seed/lvn-probe.js 3.NBT.A.2 6.EE.A.1
 */
const fs = require('fs');
const path = require('path');
const { createGqlClient } = require('./appsync-config');

const CCSS_DICTIONARY_PATH = path.resolve(
  __dirname,
  '../../../../central/node_modules/@righton/networking/lib/src/Models/CCSSDictionary.js'
);

const CONCURRENCY = 5; // parallel requests at a time

const GET_LEARNING_SCIENCE = /* GraphQL */ `
  mutation GetLearningScience($input: GetLearningScienceInput!) {
    getLearningScience(input: $input)
  }
`;

// ── Extract all CCSS codes from the dictionary ────────────────────────────────

async function getAllCodes() {
  const { ccssDictionary } = await import(CCSS_DICTIONARY_PATH);
  const codes = [];
  for (const grade of ccssDictionary) {
    for (const domain of grade.domains ?? []) {
      for (const cluster of domain.clusters ?? []) {
        for (const standard of cluster.standards ?? []) {
          if (grade.key === 'HS') {
            codes.push(`HS${domain.key}-${cluster.key}.${standard.key}`);
          } else {
            codes.push(`${grade.key}.${domain.key}.${cluster.key}.${standard.key}`);
          }
        }
      }
    }
  }
  return codes.sort();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function filled(val) {
  if (val == null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return false;
}

async function runBatched(items, concurrency, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchCode(gql, code) {
  try {
    const raw = await gql(GET_LEARNING_SCIENCE, { input: { ccss: code } });
    const data = typeof raw.getLearningScience === 'string'
      ? JSON.parse(raw.getLearningScience)
      : raw.getLearningScience;
    return { code, data, error: null };
  } catch (err) {
    return { code, data: null, error: err.message };
  }
}

// ── Roll-up ───────────────────────────────────────────────────────────────────

function printRollup(results, totalCodes) {
  let noMatch = 0, matched = 0, withFactors = 0;
  let totalFactors = 0, totalStrategies = 0;
  let factorsWithContent = 0, factorsWithCitations = 0;
  let strategiesWithContent = 0, strategiesWithCitations = 0;
  let contextCount = 0, skillsCount = 0;
  const standardsWithFactors = [];

  for (const { code, data, error } of results) {
    if (error || !data?.standards?.length) { noMatch++; continue; }
    matched++;
    const standard = data.standards[0];
    const factors = standard.lvnFactors ?? [];
    if (factors.length) {
      withFactors++;
      standardsWithFactors.push({ code, factorCount: factors.length });
    }
    for (const f of factors) {
      totalFactors++;
      if (filled(f.content))   factorsWithContent++;
      if (filled(f.citations)) factorsWithCitations++;
      if (f.category === 'Context') contextCount++;
      if (f.category === 'Skills')  skillsCount++;
      for (const s of f.strategies ?? []) {
        totalStrategies++;
        if (filled(s.content))   strategiesWithContent++;
        if (filled(s.citations)) strategiesWithCitations++;
      }
    }
  }

  const withFactorsPct = matched ? ((withFactors / matched) * 100).toFixed(1) : 0;

  console.log(`\n${'═'.repeat(60)}`);
  console.log('LVN COVERAGE REPORT');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Total CCSS codes in dictionary : ${totalCodes}`);
  console.log(`Successfully queried           : ${matched}`);
  console.log(`No KG match                    : ${noMatch}`);
  console.log(`Standards with LVN factors     : ${withFactors}/${matched} (${withFactorsPct}%)`);
  console.log(`Standards with NO LVN factors  : ${matched - withFactors}/${matched} (${(100 - parseFloat(withFactorsPct)).toFixed(1)}%)`);

  if (withFactors > 0) {
    console.log(`\nFACTOR DETAIL`);
    console.log(`  Total factors found    : ${totalFactors} (avg ${(totalFactors / withFactors).toFixed(1)}/standard that has any)`);
    console.log(`  Context                : ${contextCount}`);
    console.log(`  Skills                 : ${skillsCount}`);
    console.log(`  w/ content field       : ${factorsWithContent}/${totalFactors}`);
    console.log(`  w/ citations           : ${factorsWithCitations}/${totalFactors}`);
    console.log(`\nSTRATEGY DETAIL`);
    console.log(`  Total strategies found : ${totalStrategies} (avg ${withFactors ? (totalStrategies / withFactors).toFixed(1) : 0}/standard that has factors)`);
    console.log(`  w/ content field       : ${strategiesWithContent}/${totalStrategies}`);
    console.log(`  w/ citations           : ${strategiesWithCitations}/${totalStrategies}`);
    console.log(`\nSTANDARDS WITH FACTORS:`);
    for (const { code, factorCount } of standardsWithFactors) {
      console.log(`  ${code} (${factorCount} factor${factorCount > 1 ? 's' : ''})`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== LVN Data Probe ===');

  let codes;
  if (process.argv.slice(2).length) {
    codes = process.argv.slice(2);
    console.log(`Codes: ${codes.join(', ')} (from args)`);
  } else {
    process.stdout.write('Loading CCSS dictionary...');
    codes = await getAllCodes();
    console.log(` ✓  ${codes.length} codes`);
  }

  const gql = await createGqlClient();

  console.log(`Querying LVN for ${codes.length} codes (${CONCURRENCY} at a time)...\n`);
  let done = 0;
  const results = await runBatched(codes, CONCURRENCY, async (code) => {
    const result = await fetchCode(gql, code);
    done++;
    const factors = result.data?.standards?.[0]?.lvnFactors?.length ?? 0;
    const mark = result.error ? '✗' : factors > 0 ? `✓ (${factors} factors)` : '·';
    process.stdout.write(`[${done}/${codes.length}] ${code} ${mark}\n`);
    return result;
  });

  printRollup(results, codes.length);

  const outFile = './lvn-probe-raw.json';
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log(`\nFull raw output written to ${outFile}`);
}

main().catch((err) => {
  console.error('\nFailed:', err);
  process.exit(1);
});
