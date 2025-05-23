export interface TransformedSurvey {
  id: string;
  title: string; // Ajouter cette propriété
  questions: Array<{
    id: string;
    type: 'text' | 'radio' | 'checkbox' | 'rating';
    text: string;
    options?: string[];
    required: boolean;
  }>;
  createdAt: string;
  createdBy: string;
  creatorName: string; // Ajouter cette propriété
}