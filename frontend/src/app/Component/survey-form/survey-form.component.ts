import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/services/survey.service';
import { TokenService } from '../../services/services/token.service';
import { SurveyDto, SurveyQuestionDto } from '../../services/models/survey-dto';
import { SubmitSurveyResponseDto } from '../../services/models/submit-survey-response-dto';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <nav class="mini-navbar">
      <a [routerLink]="['/surveys']" class="back-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Back to Surveys
      </a>
    </nav>

    <section id="survey-form" class="applications-section">
      <header class="section-header">
        <div class="header-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <h2>{{ survey?.Title || 'Loading Survey...' }}</h2>
      </header>

      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading survey...</p>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ errorMessage }}
      </div>

      <div *ngIf="successMessage" class="success-message">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        {{ successMessage }}
      </div>

      <div *ngIf="!isLoading && !errorMessage && survey" class="survey-form-container">
        <div class="survey-info">
          <p class="creator-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Created by: {{ survey.CreatorName }}
          </p>
          <p class="date-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Created on: {{ survey.CreatedAt | date:'medium' }}
          </p>
        </div>

        <form (ngSubmit)="submitSurvey()" #surveyForm="ngForm" class="survey-form">
          <div *ngFor="let question of survey.Questions; let i = index" class="question-container">
            <div class="question-header">
              <label [for]="'question-' + i" class="question-label">
                {{ question.Text }}
                <span *ngIf="question.Required" class="required-mark">*</span>
              </label>
            </div>

            <!-- Text input -->
            <div *ngIf="question.Type === 'text'" class="input-container">
              <input type="text"
                     class="form-input"
                     [id]="'question-' + i"
                     [(ngModel)]="answers[i]"
                     [name]="'question-' + i"
                     [required]="question.Required"
                     placeholder="Enter your answer">
            </div>

            <!-- Radio buttons -->
            <div *ngIf="question.Type === 'radio'" class="radio-container">
              <div *ngFor="let option of question.Options; let j = index" class="radio-option">
                <input type="radio"
                       class="radio-input"
                       [id]="'question-' + i + '-option-' + j"
                       [name]="'question-' + i"
                       [value]="option"
                       [(ngModel)]="answers[i]"
                       [required]="question.Required">
                <label class="radio-label" [for]="'question-' + i + '-option-' + j">
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Checkboxes -->
            <div *ngIf="question.Type === 'checkbox'" class="checkbox-container">
              <div *ngFor="let option of question.Options; let j = index" class="checkbox-option">
                <input type="checkbox"
                       class="checkbox-input"
                       [id]="'question-' + i + '-option-' + j"
                       [name]="'question-' + i"
                       [value]="option"
                       [(ngModel)]="checkboxAnswers[i][j]"
                       [required]="question.Required">
                <label class="checkbox-label" [for]="'question-' + i + '-option-' + j">
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Rating -->
            <div *ngIf="question.Type === 'rating'" class="rating-container">
              <div class="rating-buttons">
                <button *ngFor="let rating of [1,2,3,4,5]"
                        type="button"
                        class="rating-button"
                        [class.active]="answers[i] === rating"
                        (click)="answers[i] = rating">
                  {{ rating }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" 
                    class="submit-button" 
                    [disabled]="!surveyForm.form.valid || isSubmitting">
              <svg *ngIf="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
              </svg>
              {{ isSubmitting ? 'Submitting...' : 'Submit Survey' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [`
    /* Mini-navbar */
    .mini-navbar {
      background: linear-gradient(to right, #667eea, #0056b3);
      padding: 1rem 2rem;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ffffff;
      font-weight: 600;
      text-decoration: none;
      padding: 10px 16px;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .back-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      color: #ffffff;
    }

    .back-link svg {
      stroke: #ffffff;
      width: 24px;
      height: 24px;
      transition: transform 0.3s ease;
    }

    .back-link:hover svg {
      transform: translateX(-6px);
    }

    /* Section principale */
    .applications-section {
      max-width: 1100px;
      margin: 2.5rem auto;
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
      backdrop-filter: blur(4px);
    }

    /* En-tête */
    .section-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid rgba(102, 126, 234, 0.2);
    }

    .section-header h2 {
      font-size: 2rem;
      color: #2d3748;
      font-weight: 700;
      background: linear-gradient(to right, #667eea,#0056b3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-icon svg {
      stroke: #0056b3;
      width: 40px;
      height: 40px;
      transition: all 0.3s ease;
    }

    .header-icon:hover svg {
      transform: rotate(20deg) scale(1.2);
    }

    /* Loading */
    .loading-container {
      text-align: center;
      padding: 4rem 1rem;
      color: #7f9cf5;
    }

    .spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 1.5rem;
      border: 4px solid rgba(102, 126, 234, 0.2);
      border-top-color: #0056b3;
      border-radius: 50%;
      animation: spin 0.8s ease-in-out infinite;
    }

    /* Messages */
    .error-message,
    .success-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
    }

    .error-message {
      background: #fee2e2;
      color: #ef4444;
    }

    .success-message {
      background: #d1fae5;
      color: #10b981;
    }

    /* Survey Info */
    .survey-info {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 10px;
    }

    .creator-info,
    .date-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 0.95rem;
    }

    /* Form */
    .survey-form-container {
      background: #ffffff;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .question-container {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .question-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .question-header {
      margin-bottom: 1rem;
    }

    .question-label {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .required-mark {
      color: #ef4444;
      margin-left: 4px;
    }

    /* Inputs */
    .input-container {
      margin-top: 0.5rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #0056b3;
      box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
    }

    /* Radio & Checkbox */
    .radio-container,
    .checkbox-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .radio-option,
    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .radio-input,
    .checkbox-input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .radio-label,
    .checkbox-label {
      font-size: 1rem;
      color: #4b5563;
      cursor: pointer;
    }

    /* Rating */
    .rating-container {
      margin-top: 0.5rem;
    }

    .rating-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .rating-button {
      width: 40px;
      height: 40px;
      border: 2px solid #e2e8f0;
      border-radius: 50%;
      background: #ffffff;
      color: #4b5563;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .rating-button:hover {
      border-color: #0056b3;
      color: #0056b3;
    }

    .rating-button.active {
      background: #0056b3;
      border-color: #0056b3;
      color: #ffffff;
    }

    /* Submit Button */
    .form-actions {
      margin-top: 2rem;
      text-align: center;
    }

    .submit-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0.75rem 2rem;
      background: linear-gradient(to right, #0056b3, #2a0b9b);
      color: #ffffff;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Animation */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .mini-navbar {
        padding: 0.8rem 1.2rem;
      }

      .applications-section {
        margin: 1.5rem;
        padding: 1.8rem;
      }

      .section-header {
        flex-direction: column;
        text-align: center;
      }

      .section-header h2 {
        font-size: 1.75rem;
      }

      .survey-info {
        flex-direction: column;
        gap: 1rem;
      }

      .question-container {
        padding: 1rem;
      }
    }
  `]
})
export class SurveyFormComponent implements OnInit {
  survey: SurveyDto | null = null;
  answers: any[] = [];
  checkboxAnswers: boolean[][] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private surveyService: SurveyService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const surveyId = this.route.snapshot.paramMap.get('id');
    if (surveyId) {
      this.loadSurvey(surveyId);
    } else {
      this.errorMessage = 'Survey ID not provided.';
    }
  }

  loadSurvey(surveyId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.surveyService.apiSurveyGetById$Json({ id: surveyId }).subscribe({
      next: (survey: SurveyDto) => {
        this.survey = survey;
        this.answers = new Array(survey.Questions.length).fill('');
        this.checkboxAnswers = survey.Questions.map(q => 
          q.Type === 'checkbox' ? new Array(q.Options?.length || 0).fill(false) : []
        );
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading survey:', error);
        this.errorMessage = 'Failed to load survey. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  submitSurvey(): void {
    if (!this.survey) return;

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Get the current user's ID
    const user = this.tokenService.user;
    if (!user) {
      this.errorMessage = 'User not authenticated. Please log in again.';
      this.isSubmitting = false;
      return;
    }

    // Prepare responses
    const answers: string[] = this.survey.Questions.map((question, index) => {
      if (question.Type === 'checkbox') {
        // For checkboxes, return a comma-separated string of selected options
        const selectedOptions = this.checkboxAnswers[index]
          .map((checked, i) => checked ? question.Options![i] : null)
          .filter(a => a !== null);
        return selectedOptions.length > 0 ? selectedOptions.join(',') : '';
      } else if (question.Type === 'rating') {
        // For ratings, convert the number to string
        return this.answers[index]?.toString() || '';
      } else {
        // For text and radio, return the answer directly
        return this.answers[index] || '';
      }
    });

    const response: SubmitSurveyResponseDto = {
      surveyId: this.survey.Id,
      employeeId: user.id?.toString() || '',
      answers: answers
    };

    this.surveyService.apiSurveyRespondPost$Json({ body: [response] }).subscribe({
      next: () => {
        this.successMessage = 'Survey submitted successfully!';
        this.isSubmitting = false;
        setTimeout(() => this.goBack(), 2000);
      },
      error: (error: any) => {
        console.error('Error submitting survey:', error);
        this.errorMessage = 'Failed to submit survey. Please try again later.';
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/surveys']);
  }
}