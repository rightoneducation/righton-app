// Plain-language CCSS domain names, flattened from networking's CCSS dictionary
// (src/Models/CCSSDictionary.ts). Mirrors microcoach_v2 src/lib/ccssDomains.ts —
// regenerate both together. HS codes take the domain-and-cluster level
// (HSA-REI → Reasoning with Equations and Inequalities); grade codes take the
// domain (7.EE → Expressions and Equations).

const CCSS_DOMAINS = {
  'HSN-RN': 'The Real Number System',
  'HSN-Q': 'Quantities',
  'HSN-CN': 'The Complex Number System',
  'HSN-VM': 'Vector and Matrix Quantities',
  'HSA-SSE': 'Seeing Structure in Expressions',
  'HSA-APR': 'Arithmetic with Polynomials and Rational Expressions',
  'HSA-CED': 'Creating Equations',
  'HSA-REI': 'Reasoning with Equations and Inequalities',
  'HSF-IF': 'Interpreting Functions',
  'HSF-BF': 'Building Functions',
  'HSF-LE': 'Linear, Quadratic, and Exponential Models',
  'HSF-TF': 'Trigonometric Functions',
  'HSG-CO': 'Congruence',
  'HSG-SRT': 'Similarity, Right Triangles, and Trigonometry',
  'HSG-C': 'Circles',
  'HSG-GPE': 'Expressing Geometric Properties with Equations',
  'HSG-GMD': 'Geometric Measurement and Dimension',
  'HSG-MG': 'Modeling with Geometry',
  'HSS-ID': 'Interpreting Categorical and Quantitative Data',
  'HSS-IC': 'Making Inferences and Justifying Conclusions',
  'HSS-CP': 'Conditional Probability and the Rules of Probability',
  'HSS-MD': 'Using Probability to Make Decisions',
  '8.NS': 'The Number System',
  '8.EE': 'Expressions and Equations',
  '8.F': 'Functions',
  '8.G': 'Geometry',
  '8.SP': 'Statistics and Probability',
  '7.RP': 'Ratios and Proportional Relationships',
  '7.NS': 'The Number System',
  '7.EE': 'Expressions and Equations',
  '7.G': 'Geometry',
  '7.SP': 'Statistics and Probability',
  '6.RP': 'Ratios and Proportional Relationships',
  '6.NS': 'The Number System',
  '6.EE': 'Expressions and Equations',
  '6.G': 'Geometry',
  '6.SP': 'Statistics and Probability',
  '5.OA': 'Operations and Algebraic Thinking',
  '5.NBT': 'Number and Operations in Base Ten',
  '5.NF': 'Number and Operations—Fractions',
  '5.MD': 'Measurement and Data',
  '5.G': 'Geometry',
  '4.OA': 'Operations and Algebraic Thinking',
  '4.NBT': 'Number and Operations in Base Ten',
  '4.NF': 'Number and Operations—Fractions',
  '4.MD': 'Measurement and Data',
  '4.G': 'Geometry',
  '3.OA': 'Operations and Algebraic Thinking',
  '3.NBT': 'Number and Operations in Base Ten',
  '3.NF': 'Number and Operations—Fractions',
  '3.MD': 'Measurement and Data',
  '3.G': 'Geometry',
  '2.OA': 'Operations and Algebraic Thinking',
  '2.NBT': 'Number and Operations in Base Ten',
  '2.MD': 'Measurement and Data',
  '2.G': 'Geometry',
  '1.OA': 'Operations and Algebraic Thinking',
  '1.NBT': 'Number and Operations in Base Ten',
  '1.MD': 'Measurement and Data',
  '1.G': 'Geometry',
  'K.CC': 'Counting and Cardinality',
  'K.OA': 'Operations and Algebraic Thinking',
  'K.NBT': 'Number and Operations in Base Ten',
  'K.MD': 'Measurement and Data',
  'K.G': 'Geometry',
};

/** "HSA-REI.D.12", "A-REI.12", "CCSS.Math.Content.7.EE.B.4" → "HSA-REI" / "7.EE". */
export function ccssDomainKey(code) {
  if (!code) return null;
  const normalized = String(code).trim().replace(/^CCSS\.MATH\.CONTENT\./i, '').toUpperCase();
  const grade = normalized.match(/^(K|\d{1,2})\.([A-Z]+)/);
  if (grade) return `${grade[1]}.${grade[2]}`;
  const highSchool = normalized.match(/^(?:HS)?([NAFGS])[-.]([A-Z]+)/);
  if (highSchool) return `HS${highSchool[1]}-${highSchool[2]}`;
  return null;
}

export function ccssDomainName(code) {
  const key = ccssDomainKey(code);
  return key ? CCSS_DOMAINS[key] ?? null : null;
}
