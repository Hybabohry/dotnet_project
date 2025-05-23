export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewDate: Date;
  
  // Quantitative Metrics
  TasksCompleted: number;
  OnTimeCompletionRate: number; // Percentage (0-100)
  ProcessImprovementIdeas: number;
  Absences: number;
  LateArrivals: number;
  
  // Qualitative Scores (1-10 scale)
  OutputQualityScore: number;
  InitiativeScore: number;
  CommunicationScore: number;
  
  // Calculated Field
  OverallScore: number;
  
  // Manager Feedback
  managerComment: string;
  
  ClientSatisfactionScore : number; // 1-10 scale
  
  // Employee Details (for display purposes)
  employee?: {
    id: string;
    firstname: string;
    lastname: string;
    poste: string;
    department: string;
  };
}

export interface CreatePerformanceReviewDto {
  employeeId: string;
  tasksCompleted: number;
  onTimeCompletionRate: number;
  processImprovementIdeas: number;
  absences: number;
  lateArrivals: number;
  outputQualityScore: number;
  initiativeScore: number;
  communicationScore: number;
  managerComment: string;

}

export interface PerformanceReviewSummary {
  averageScore: number;
  totalReviews: number;
  lastReviewDate: Date;
  strongestCategory: string;
  weakestCategory: string;
}