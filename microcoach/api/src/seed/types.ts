// Seed configuration types

export interface ClassroomConfig {
  key: string;           // "Classroom1", "Classroom2", "Classroom3"
  name: string;
  grade: number;
  subject: string;
  state: string;
  schoolYear: string;
  cohortSize: number;
  sessions: SessionConfig[];
}

export interface SessionConfig {
  label: string;         // "Session1"
  weekNumber: number;
  topic: string;
  ccssStandards: string[];
  ppqFile: string;       // relative path from DATA_ROOT
  postPpqFile: string;   // relative path from DATA_ROOT
  nextStepFile: string | null; // null if no next step doc for this classroom
  misconceptions?: MisconceptionPlaceholder[];  // optional; primary source is Data/{key}/{label}/misconceptions.json
}

export interface MisconceptionPlaceholder {
  title: string;
  description: string;
  ccssStandard: string;
  severity: 'high' | 'medium' | 'low';
  priority: '1' | '2' | '3' | '4';
  occurrence: 'first' | 'recurring';
  successIndicators: string[];
}

export interface ReferenceConfig {
  file: string;          // relative path from DATA_ROOT
  title: string;
  gradeLevel: number;
  ccssStandards: string[];
  weekNumber?: number;
}

// Parsed Excel data structures

export interface ParsedAssessmentData {
  assessmentCode: string;
  ccssStandards: string[];
  weekNumber: number;
  topic: string;
  classPercentCorrect: number;
  questionMeta: ParsedQuestionMeta[];
  students: ParsedStudentRow[];
}

export interface ParsedQuestionMeta {
  questionNumber: number;
  correctAnswer: string;
  classPercentCorrect: number;
  ccssStandard: string;
}

export interface ParsedStudentRow {
  name: string;
  externalId: string;
  totalScore: number;
  questionResponses: ParsedQuestionResponse[];
}

export interface ParsedQuestionResponse {
  questionNumber: number;
  response: string;
  isCorrect: boolean;
  pointsEarned: number;
}

// AppSync record IDs returned after creation

export interface CreatedClassroom {
  id: string;
  key: string;
}

export interface CreatedSession {
  id: string;
  classroomId: string;
}

export interface CreatedAssessment {
  id: string;
  type: string;
  classroomId: string;
  sessionId: string;
}

export interface CreatedStudent {
  id: string;
  name: string;
  externalId: string;
  classroomId: string;
}

export interface CreatedMisconception {
  id: string;
  sessionId: string;
  classroomId: string;
}
