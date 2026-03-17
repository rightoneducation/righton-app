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
// Shared session config for all 4 pilot classrooms (same W27 Algebra assessment)
const PILOT_CCSS = ['A.REI.3', 'A.REI.12', '8.EE.C.8'];
const PILOT_TOPIC = 'Linear Equations and Systems of Inequalities';
const PILOT_WEEK = 27;
exports.CLASSROOMS = [
    {
        key: 'Classroom1',
        name: 'Classroom 1',
        grade: 8,
        subject: 'Math',
        state: 'NJ',
        schoolYear: '2025-26',
        cohortSize: 28,
        sessions: [
            {
                label: 'Session1',
                weekNumber: PILOT_WEEK,
                topic: PILOT_TOPIC,
                ccssStandards: PILOT_CCSS,
                ppqFile: 'Classroom1/Session1/PPQ-StudentData.xlsx',
                postPpqFile: null,
                nextStepFile: null,
                misconceptions: [
                    {
                        title: 'Sign Errors in Distribution',
                        description: 'Students drop or flip negative signs when distributing a negative coefficient across parentheses, causing systematic errors in equation solving.',
                        ccssStandard: 'A.REI.3',
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
                        title: 'Incorrect Graphing of Inequalities',
                        description: 'Students use a solid boundary line for strict inequalities (< or >) or a dashed line for non-strict (≤ or ≥), and confuse shading direction.',
                        ccssStandard: 'A.REI.12',
                        severity: 'high',
                        priority: '2',
                        occurrence: 'first',
                        successIndicators: [
                            'Student uses dashed line for strict inequalities and solid line for non-strict',
                            'Student shades the correct half-plane by testing a point',
                            'Student correctly graphs systems of inequalities showing the intersection region',
                        ],
                    },
                    {
                        title: 'Errors Solving Systems by Substitution or Elimination',
                        description: 'Students make arithmetic errors when substituting or fail to multiply all terms when eliminating a variable in a system of equations.',
                        ccssStandard: '8.EE.C.8',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly substitutes the solved variable into the other equation',
                            'Student multiplies all terms (including constants) when scaling an equation',
                            'Student checks the solution in both original equations',
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
        cohortSize: 25,
        sessions: [
            {
                label: 'Session1',
                weekNumber: PILOT_WEEK,
                topic: PILOT_TOPIC,
                ccssStandards: PILOT_CCSS,
                ppqFile: 'Classroom2/Session1/PPQ-StudentData.xlsx',
                postPpqFile: null,
                nextStepFile: null,
                misconceptions: [
                    {
                        title: 'Sign Errors in Distribution',
                        description: 'Students drop or flip negative signs when distributing a negative coefficient across parentheses, causing systematic errors in equation solving.',
                        ccssStandard: 'A.REI.3',
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
                        title: 'Incorrect Graphing of Inequalities',
                        description: 'Students use a solid boundary line for strict inequalities (< or >) or a dashed line for non-strict (≤ or ≥), and confuse shading direction.',
                        ccssStandard: 'A.REI.12',
                        severity: 'high',
                        priority: '2',
                        occurrence: 'first',
                        successIndicators: [
                            'Student uses dashed line for strict inequalities and solid line for non-strict',
                            'Student shades the correct half-plane by testing a point',
                            'Student correctly graphs systems of inequalities showing the intersection region',
                        ],
                    },
                    {
                        title: 'Errors Solving Systems by Substitution or Elimination',
                        description: 'Students make arithmetic errors when substituting or fail to multiply all terms when eliminating a variable in a system of equations.',
                        ccssStandard: '8.EE.C.8',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly substitutes the solved variable into the other equation',
                            'Student multiplies all terms (including constants) when scaling an equation',
                            'Student checks the solution in both original equations',
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
        state: 'NJ',
        schoolYear: '2025-26',
        cohortSize: 20,
        sessions: [
            {
                label: 'Session1',
                weekNumber: PILOT_WEEK,
                topic: PILOT_TOPIC,
                ccssStandards: PILOT_CCSS,
                ppqFile: 'Classroom3/Session1/PPQ-StudentData.xlsx',
                postPpqFile: null,
                nextStepFile: null,
                misconceptions: [
                    {
                        title: 'Sign Errors in Distribution',
                        description: 'Students drop or flip negative signs when distributing a negative coefficient across parentheses, causing systematic errors in equation solving.',
                        ccssStandard: 'A.REI.3',
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
                        title: 'Incorrect Graphing of Inequalities',
                        description: 'Students use a solid boundary line for strict inequalities (< or >) or a dashed line for non-strict (≤ or ≥), and confuse shading direction.',
                        ccssStandard: 'A.REI.12',
                        severity: 'high',
                        priority: '2',
                        occurrence: 'first',
                        successIndicators: [
                            'Student uses dashed line for strict inequalities and solid line for non-strict',
                            'Student shades the correct half-plane by testing a point',
                            'Student correctly graphs systems of inequalities showing the intersection region',
                        ],
                    },
                    {
                        title: 'Errors Solving Systems by Substitution or Elimination',
                        description: 'Students make arithmetic errors when substituting or fail to multiply all terms when eliminating a variable in a system of equations.',
                        ccssStandard: '8.EE.C.8',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly substitutes the solved variable into the other equation',
                            'Student multiplies all terms (including constants) when scaling an equation',
                            'Student checks the solution in both original equations',
                        ],
                    },
                ],
            },
        ],
    },
    {
        key: 'Classroom4',
        name: 'Classroom 4',
        grade: 8,
        subject: 'Math',
        state: 'NJ',
        schoolYear: '2025-26',
        cohortSize: 22,
        sessions: [
            {
                label: 'Session1',
                weekNumber: PILOT_WEEK,
                topic: PILOT_TOPIC,
                ccssStandards: PILOT_CCSS,
                ppqFile: 'Classroom4/Session1/PPQ-StudentData.xlsx',
                postPpqFile: 'Classroom4/Session1/post/RTD_ClearingTheFraction_Data_Walsh.xlsx',
                nextStepFile: null,
                misconceptions: [
                    {
                        title: 'Sign Errors in Distribution',
                        description: 'Students drop or flip negative signs when distributing a negative coefficient across parentheses, causing systematic errors in equation solving.',
                        ccssStandard: 'A.REI.3',
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
                        title: 'Incorrect Graphing of Inequalities',
                        description: 'Students use a solid boundary line for strict inequalities (< or >) or a dashed line for non-strict (≤ or ≥), and confuse shading direction.',
                        ccssStandard: 'A.REI.12',
                        severity: 'high',
                        priority: '2',
                        occurrence: 'first',
                        successIndicators: [
                            'Student uses dashed line for strict inequalities and solid line for non-strict',
                            'Student shades the correct half-plane by testing a point',
                            'Student correctly graphs systems of inequalities showing the intersection region',
                        ],
                    },
                    {
                        title: 'Errors Solving Systems by Substitution or Elimination',
                        description: 'Students make arithmetic errors when substituting or fail to multiply all terms when eliminating a variable in a system of equations.',
                        ccssStandard: '8.EE.C.8',
                        severity: 'medium',
                        priority: '3',
                        occurrence: 'first',
                        successIndicators: [
                            'Student correctly substitutes the solved variable into the other equation',
                            'Student multiplies all terms (including constants) when scaling an equation',
                            'Student checks the solution in both original equations',
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
