// Types for the learning science data response
export interface LearningComponent {
  description: string;
}

export interface RelatedStandard {
  statementCode: string;
  description: string;
}

export interface StandardsFrameworkItem {
  description: string;
  learningComponentssupports: LearningComponent[];
  standardsFrameworkItemsbuildsTowards: RelatedStandard[];
  relatesToStandardsFrameworkItems: RelatedStandard[];
}

export interface LearningScienceDataResponse {
  data: {
    standardsFrameworkItems: StandardsFrameworkItem[];
  };
}