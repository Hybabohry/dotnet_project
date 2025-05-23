// src/app/Component/create-survey/create-survey.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/services/survey.service'; 
import { Router } from '@angular/router';
import { SurveyCreateDto,SurveyQuestionDto } from '../../services/models/survey-create-dto'; 
import { SurveyDto } from '../../services/models/survey-dto'; 


@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent {
  survey: SurveyCreateDto = {
    Title: '', // Initialiser le titre
    Questions: []
  };
  questionTypes = ['text', 'radio', 'checkbox', 'rating'];

  constructor(private surveyService: SurveyService, private router: Router) {}

  addQuestion(type: string) {
    const newQuestion: SurveyQuestionDto = {
      Type: type,
      Text: '',
      Options: undefined,
      Required: false
    };
    this.survey.Questions.push(newQuestion);
  }

  removeQuestion(index: number) {
    this.survey.Questions.splice(index, 1);
  }

  onQuestionTypeChange(questionIndex: number) {
    const question = this.survey.Questions[questionIndex];
    if (question.Type === 'text' || question.Type === 'rating') {
      question.Options = undefined;
    }
  }

  createSurvey() {
    console.log('Payload envoyé :', this.survey);

    this.survey.Questions.forEach((question: SurveyQuestionDto) => {
      if (question.Type === 'text' || question.Type === 'rating') {
        question.Options = undefined;
      } else if (question.Options && typeof question.Options === 'string') {
        question.Options = question.Options.trim();
      }
    });

    this.surveyService.apiSurveyPost$Json({ body: this.survey }).subscribe({
      next: (response: SurveyDto) => {
        console.log('Sondage créé avec succès', response);
        this.router.navigate(['/survey-list']);
      },
      error: (error: any) => {
        console.error('Erreur lors de la création du sondage', error);
      }
    });
  }
}