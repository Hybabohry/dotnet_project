
export interface SurveyCreateDto {
  Questions: SurveyQuestionDto[];
}

export interface SurveyQuestionDto {
  Type: string;
  Text: string;
  Options: string | null;
  Required: boolean;
}

export interface SurveyDto {
  Id: string;
  CreatedAt: string;
  CreatedBy: string;
  Questions: SurveyQuestionDto[];
}