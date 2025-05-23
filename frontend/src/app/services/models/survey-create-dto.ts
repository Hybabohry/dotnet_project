export interface SurveyCreateDto {
  Title: string; // Ajouter cette propriété
  Questions: SurveyQuestionDto[];
}

export interface SurveyQuestionDto {
  Type: string;
  Text: string;
  Options?: string;
  Required: boolean;
}