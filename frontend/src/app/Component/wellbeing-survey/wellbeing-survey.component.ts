import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/services/survey.service';
import { SurveyDto } from '../../services/models/survey-dto';

@Component({
  selector: 'app-wellbeing-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wellbeing-survey.component.html',
  styleUrls: ['./wellbeing-survey.component.css']
})
export class WellbeingSurveyComponent implements OnInit {
  wellbeingSurveys: SurveyDto[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private surveyService: SurveyService,
    private router: Router
  ) {
    console.log('WellbeingSurveyComponent initialized');
  }

  ngOnInit(): void {
    console.log('WellbeingSurveyComponent: ngOnInit called');
    this.loadWellbeingSurveys();
  }

  loadWellbeingSurveys(): void {
    console.log('WellbeingSurveyComponent: loadWellbeingSurveys called');
    this.isLoading = true;
    this.errorMessage = null;
    this.wellbeingSurveys = [];
    console.log('Début de la récupération des sondages...');
    this.surveyService.apiSurveyGetSurveysForEmployeeGet$Json().subscribe({
      next: (surveys: SurveyDto[]) => {
        console.log('Sondages renvoyés par l’API :', surveys);
        this.wellbeingSurveys = surveys || [];
        console.log('wellbeingSurveys après assignation :', this.wellbeingSurveys);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des sondages bien-être :', error);
        this.errorMessage = `Erreur lors du chargement des sondages : ${error.status} - ${error.statusText || 'Erreur inconnue'}`;
        this.isLoading = false;
      },
      complete: () => {
        console.log('Requête API terminée.');
      }
    });
  }

  respondToSurvey(surveyId: string): void {
    console.log('Navigation vers le formulaire pour le sondage ID :', surveyId);
    this.router.navigate(['/survey-form', surveyId]);
  }

  isNewSurvey(createdAt: string): boolean {
    const creationDate = new Date(createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - creationDate.getTime()) / (1000 * 3600 * 24);
    return diffDays < 7;
  }
}