import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../services/services/survey.service'; 
import { SurveyDto  } from '../services/models/survey-dto'; 
import { SurveyCreateDto } from '../services/models/survey-create-dto';
import { SurveyQuestionDto } from '../services/models/survey-dto';

@Component({
  selector: 'app-edit-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.css']
})
export class EditSurveyComponent implements OnInit {
  survey: SurveyCreateDto = { Title: '', Questions: [] };
  surveyId: string | null = null;

  constructor(
    private surveyService: SurveyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id');
    if (this.surveyId) {
      this.surveyService.apiSurveyGetById$Json({ id: this.surveyId }).subscribe({
        next: (survey: SurveyDto) => {
          this.survey = {
            Title: survey.Title || '',
            Questions: survey.Questions.map((q: SurveyQuestionDto) => ({
              Type: q.Type,
              Text: q.Text,
              Options: q.Options ? q.Options.join(',') : '',
              Required: q.Required
            }))
          };
        },
        error: (error: any) => {
          console.error('Erreur lors de la récupération du sondage', error);
          alert('Une erreur est survenue lors de la récupération du sondage.');
          this.router.navigate(['/survey-list']);
        }
      });
    } else {
      this.router.navigate(['/survey-list']);
    }
  }

  addQuestion(type: string): void {
    this.survey.Questions.push({
      Type: type,
      Text: '',
      Options: '',
      Required: false
    });
  }

  removeQuestion(index: number): void {
    this.survey.Questions.splice(index, 1);
  }

  onQuestionTypeChange(index: number): void {
    const question = this.survey.Questions[index];
    if (question.Type === 'text' || question.Type === 'rating') {
      question.Options = '';
    }
  }

  updateSurvey(): void {
    if (this.surveyId) {
      this.surveyService.apiSurveyUpdate$Json({ id: this.surveyId, body: this.survey }).subscribe({
        next: () => {
          alert('Sondage mis à jour avec succès.');
          this.router.navigate(['/survey-list']);
        },
        error: (error: any) => {
          console.error('Erreur lors de la mise à jour du sondage', error);
          alert('Une erreur est survenue lors de la mise à jour du sondage.');
        }
      });
    }
  }
}