"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFERENCE_NEXT_STEPS = exports.CLASSROOMS = exports.DATA_ROOT = void 0;
const path = __importStar(require("path"));
// Root of the Data/ folder: api/src/seed/ → api/src/ → api/ → microcoach/ → Data/
exports.DATA_ROOT = path.resolve(__dirname, '../../../Data');
exports.CLASSROOMS = [
    {
        key: 'Classroom1',
        name: 'Classroom 1',
        grade: 6,
        subject: 'Math',
        state: 'NJ',
        schoolYear: '2025-26',
        cohortSize: 60,
        sessions: [
            {
                label: 'Session1',
                weekNumber: 19,
                topic: 'Dividing Fractions',
                ccssStandards: ['6.NS.A.1'],
                ppqFile: 'Classroom1/Session1/PPQ-StudentData.xlsx',
                postPpqFile: 'Classroom1/Session1/PostPPQ-StudentData.xlsx',
                nextStepFile: 'Classroom1/Session1/RTD.docx',
                misconceptions: [
                    {
                        title: 'Inverting the Wrong Fraction',
                        description: 'Students invert the dividend (first fraction) instead of the divisor (second fraction) when applying the Keep-Change-Flip strategy for fraction division.',
                        ccssStandard: '6.NS.A.1',
                        severity: 'high',
                        priority: '1',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly identifies which fraction to invert',
                            'Student writes the reciprocal of the divisor (second fraction)',
                            'Student solves ÷ b/c = a × c/b accurately',
                        ],
                    },
                    {
                        title: 'Skipping Mixed Number Conversion',
                        description: 'Students attempt to divide fractions without first converting mixed numbers to improper fractions, leading to computational errors.',
                        ccssStandard: '6.NS.A.1',
                        severity: 'high',
                        priority: '2',
                        occurrence: 'first',
                        successIndicators: [
                            'Student converts all mixed numbers to improper fractions before dividing',
                            'Student applies the whole-number × denominator + numerator formula correctly',
                        ],
                    },
                    {
                        title: 'Incorrect Simplification After Division',
                        description: 'Students fail to simplify fractions to lowest terms after completing the division operation, or simplify incorrectly by dividing numerator and denominator by different values.',
                        ccssStandard: '6.NS.A.1',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'first',
                        successIndicators: [
                            'Student finds the GCF of numerator and denominator',
                            'Student simplifies both by dividing by the same factor',
                            'Final answer is in simplest form',
                        ],
                    },
                ],
            },
            {
                label: 'Session2',
                weekNumber: 20,
                topic: 'Dividing Fractions',
                ccssStandards: ['6.NS.A.1'],
                ppqFile: 'Classroom1/Session2/PPQ-StudentData.xlsx',
                postPpqFile: 'Classroom1/Session2/PostPPQ-StudentData.xlsx',
                nextStepFile: null,
                misconceptions: [
                    {
                        title: 'Inverting the Wrong Fraction',
                        description: 'Students invert the dividend (first fraction) instead of the divisor (second fraction) when applying the Keep-Change-Flip strategy for fraction division.',
                        ccssStandard: '6.NS.A.1',
                        severity: 'high',
                        priority: '1',
                        occurrence: 'recurring',
                        successIndicators: [
                            'Student correctly identifies which fraction to invert',
                            'Student writes the reciprocal of the divisor (second fraction)',
                            'Student solves ÷ b/c = a × c/b accurately',
                        ],
                    },
                    {
                        title: 'Skipping Mixed Number Conversion',
                        description: 'Students attempt to divide fractions without first converting mixed numbers to improper fractions, leading to computational errors.',
                        ccssStandard: '6.NS.A.1',
                        severity: 'high',
                        priority: '2',
                        occurrence: 'recurring',
                        successIndicators: [
                            'Student converts all mixed numbers to improper fractions before dividing',
                            'Student applies the whole-number × denominator + numerator formula correctly',
                        ],
                    },
                    {
                        title: 'Incorrect Simplification After Division',
                        description: 'Students fail to simplify fractions to lowest terms after completing the division operation, or simplify incorrectly by dividing numerator and denominator by different values.',
                        ccssStandard: '6.NS.A.1',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'recurring',
                        successIndicators: [
                            'Student finds the GCF of numerator and denominator',
                            'Student simplifies both by dividing by the same factor',
                            'Final answer is in simplest form',
                        ],
                    },
                ],
            },
        ],
    },
    {
        key: 'Classroom2',
        name: 'Classroom 2',
        grade: 8,
        subject: 'Math',
        state: 'NJ',
        schoolYear: '2025-26',
        cohortSize: 79,
        sessions: [
            {
                label: 'Session1',
                weekNumber: 15,
                topic: 'Linear Equations and Systems',
                ccssStandards: ['8.EE.C.7', '8.EE.C.8'],
                ppqFile: 'Classroom2/Session1/PPQ-StudentData.xlsx',
                postPpqFile: 'Classroom2/Session1/PostPPQ-StudentData.xlsx',
                nextStepFile: 'Classroom2/Session1/RTD.docx',
                misconceptions: [
                    {
                        title: 'Sign Errors in Distribution',
                        description: 'Students drop or flip negative signs when distributing a negative coefficient across parentheses, causing systematic errors in equation solving.',
                        ccssStandard: '8.EE.C.7',
                        severity: 'high',
                        priority: '1',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly distributes negative coefficients',
                            'Student checks each term after distribution',
                            'Student solves multi-step equations without sign errors',
                        ],
                    },
                    {
                        title: 'Combining Unlike Terms',
                        description: 'Students add or subtract variable terms with different exponents (e.g., treating x² and x as like terms), violating rules of polynomial arithmetic.',
                        ccssStandard: '8.EE.C.7',
                        severity: 'medium',
                        priority: '2',
                        occurrence: 'first',
                        successIndicators: [
                            'Student identifies like terms correctly (same variable, same exponent)',
                            'Student only combines like terms',
                            'Student keeps unlike terms separate',
                        ],
                    },
                    {
                        title: 'Incorrect Slope Calculation from Tables',
                        description: 'Students calculate slope as Δx/Δy (inverted) or use non-adjacent rows inconsistently when finding slope from a table of values.',
                        ccssStandard: '8.EE.C.8',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly identifies rise over run (Δy/Δx)',
                            'Student uses any two consistent points from the table',
                            'Student verifies slope is constant across all pairs of points',
                        ],
                    },
                ],
            },
        ],
    },
    {
        key: 'Classroom3',
        name: 'Classroom 3',
        grade: 8,
        subject: 'Math',
        state: 'NY',
        schoolYear: '2025-26',
        cohortSize: 478,
        sessions: [
            {
                label: 'Session1',
                weekNumber: 10,
                topic: 'Functions and Rate of Change',
                ccssStandards: ['8.F.A.1', '8.F.B.4'],
                ppqFile: 'Classroom3/Session1/PPQ-StudentData.xlsx',
                postPpqFile: 'Classroom3/Session1/PostPPQ-StudentData.xlsx',
                nextStepFile: null, // no RTD.docx for Classroom3
                misconceptions: [
                    {
                        title: 'Confusing Linear and Non-Linear Functions',
                        description: 'Students misidentify non-linear functions as linear (or vice versa) based on superficial features rather than checking constant rate of change.',
                        ccssStandard: '8.F.A.1',
                        severity: 'high',
                        priority: '1',
                        occurrence: 'first',
                        successIndicators: [
                            'Student checks whether rate of change is constant across all intervals',
                            'Student distinguishes linear graphs (straight line) from curved graphs',
                            'Student correctly classifies given functions as linear or non-linear',
                        ],
                    },
                    {
                        title: 'Swapping Input and Output in Function Notation',
                        description: 'Students reverse the meaning of f(x): treating the output as the input or misreading f(3) = 5 as "input is 5, output is 3".',
                        ccssStandard: '8.F.A.1',
                        severity: 'high',
                        priority: '2',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly reads f(x) as "f of x" where x is input',
                            'Student evaluates f(a) by substituting a for x',
                            'Student interprets f(3) = 5 as: input 3 gives output 5',
                        ],
                    },
                    {
                        title: 'Misinterpreting Slope as Rate of Change in Context',
                        description: 'Students calculate slope correctly but fail to interpret its meaning in real-world contexts (e.g., stating units incorrectly or confusing per-unit rate).',
                        ccssStandard: '8.F.B.4',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'first',
                        successIndicators: [
                            'Student states the slope with correct units (e.g., miles per hour)',
                            'Student explains what one unit change in x means for y in context',
                            'Student connects slope to the real-world scenario described',
                        ],
                    },
                ],
            },
        ],
    },
];
// Reference next step files from Data/References/RTD/
// Metadata derived from filenames since we don't parse docx content
exports.REFERENCE_NEXT_STEPS = [
    {
        file: 'References/RTD/Gr6_Math_PPQ_W19_RTD_6NS1_FractionDivision.USI_v2.docx',
        title: 'Gr6 Math PPQ W19 RTD 6NS1 Fraction Division',
        gradeLevel: 6,
        ccssStandards: ['6.NS.A.1'],
        weekNumber: 19,
    },
    {
        file: 'References/RTD/Gr8 Algebra Week 15 RTD Lesson and Reassessment.docx',
        title: 'Gr8 Algebra Week 15 RTD Lesson and Reassessment',
        gradeLevel: 8,
        ccssStandards: ['8.EE.C.7', '8.EE.C.8'],
        weekNumber: 15,
    },
    {
        file: 'References/RTD/G6_WriteExpressionsWithVariables.docx',
        title: 'Write Expressions With Variables (Grade 6)',
        gradeLevel: 6,
        ccssStandards: ['6.EE.A.2'],
    },
    {
        file: 'References/RTD/G7_IdentifyCOPTables.docx',
        title: 'Identify Constant of Proportionality Tables (Grade 7)',
        gradeLevel: 7,
        ccssStandards: ['7.RP.A.2'],
    },
    {
        file: 'References/RTD/G7_IdentifyCOP_Worksheets Streamlined.docx',
        title: 'Identify Constant of Proportionality Worksheets (Grade 7)',
        gradeLevel: 7,
        ccssStandards: ['7.RP.A.2'],
    },
];
