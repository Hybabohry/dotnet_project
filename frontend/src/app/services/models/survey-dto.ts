export interface SurveyDto {
  Id: string;
  Title: string;
  CreatedAt: string;
  CreatedBy: string;
  CreatorName: string;
  Questions: SurveyQuestionDto[];
}

export interface SurveyQuestionDto {
  Id: string;
  Type: string;
  Text: string;
  Options?: string[];
  Required: boolean;
}

export interface SubmitSurveyResponseDto {
  SurveyId: Guid;
  QuestionId: Guid;
  Answer: string;
}

export interface SurveyResponseViewDto {
  Id: string;
  SurveyId: Guid;
  EmployeeId: Guid;
  EmployeeName: string;
  QuestionId: Guid;
  Answer: string;
  RespondedAt: string;
}

export interface SurveyCreateDto {
  Title: string;
  Questions: SurveyQuestionCreateDto[];
}

export interface SurveyQuestionCreateDto {
  Type: string;
  Text: string;
  Options?: string;
  Required: boolean;
}

export type Guid = string;