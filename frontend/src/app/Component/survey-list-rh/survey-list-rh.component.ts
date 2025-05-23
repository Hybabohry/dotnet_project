import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SurveyService } from '../../services/services/survey.service';
import { SurveyDto } from '../../services/models/survey-dto';
import { TokenService } from '../../services/services/token.service';
import { UserType } from '../../services/models/UserType';

@Component({
  selector: 'app-survey-list-rh',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <!-- Header with title and "Add Survey" button -->
      <div class="header">
        <h2>Surveys Management</h2>
        <button class="add-survey" (click)="navigateToCreateSurvey()">
          <i class="fas fa-plus"></i> Add New Survey
        </button>
      </div>

      <!-- Loading indicator -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading surveys...</p>
      </div>

      <!-- Error message -->
      <div *ngIf="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>

      <!-- Main content -->
      <div *ngIf="!isLoading && !errorMessage" class="survey-list">
        <div *ngIf="surveys.length === 0" class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <p>No surveys available. Create a new survey to get started!</p>
          <button class="create-btn" (click)="navigateToCreateSurvey()">
            Create Survey
          </button>
        </div>

        <div *ngFor="let survey of surveys" class="survey-card">
          <div class="survey-content">
            <!-- Icon and title -->
            <div class="survey-icon">
              <i class="fas fa-poll"></i>
            </div>
            <div class="survey-info">
              <h3>{{ survey.Title || 'Untitled Survey' }}</h3>
              <div class="survey-details">
                <span><i class="fas fa-calendar"></i> Created: {{ survey.CreatedAt | date:'mediumDate' }}</span>
                <span><i class="fas fa-user"></i> By: {{ survey.CreatorName }}</span>
                <span><i class="fas fa-list"></i> Questions: {{ survey.Questions.length || 0 }}</span>
              </div>
            </div>
          </div>
          <!-- Action buttons -->
          <div class="action-buttons">
            <button class="action-btn edit-btn" (click)="editSurvey(survey.Id)" title="Edit Survey">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" (click)="deleteSurvey(survey.Id)" title="Delete Survey">
              <i class="fas fa-trash"></i>
            </button>
            <button class="action-btn responses-btn" (click)="viewResponses(survey.Id)" title="View Responses">
              <i class="fas fa-chart-bar"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      font-size: 2rem;
      color: #1a1a1a;
      font-weight: 700;
      margin: 0;
    }

    .add-survey {
      background: #F59E0B;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .add-survey:hover {
      background: #D97706;
      transform: translateY(-2px);
    }

    .loading-container {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #F59E0B;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .survey-list {
      display: grid;
      gap: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 2px dashed #e2e8f0;
    }

    .empty-state i {
      font-size: 3rem;
      color: #94a3b8;
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    .create-btn {
      background: #F59E0B;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .create-btn:hover {
      background: #D97706;
      transform: translateY(-2px);
    }

    .survey-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .survey-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
    }

    .survey-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .survey-icon {
      width: 48px;
      height: 48px;
      background: #fff7ed;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .survey-icon i {
      font-size: 1.5rem;
      color: #F59E0B;
    }

    .survey-info h3 {
      font-size: 1.25rem;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .survey-details {
      display: flex;
      gap: 1.5rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .survey-details span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .edit-btn {
      background: #e0f2fe;
      color: #0284c7;
    }

    .delete-btn {
      background: #fee2e2;
      color: #dc2626;
    }

    .responses-btn {
      background: #f0fdf4;
      color: #16a34a;
    }

    .action-btn:hover {
      transform: translateY(-2px);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .survey-card {
        flex-direction: column;
        gap: 1rem;
      }

      .survey-content {
        flex-direction: column;
        text-align: center;
      }

      .survey-details {
        flex-direction: column;
        gap: 0.5rem;
      }

      .action-buttons {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class SurveyListRhComponent implements OnInit {
  surveys: SurveyDto[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  usertype: UserType | null = null;

  constructor(
    private surveyService: SurveyService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usertype = this.tokenService.user?.UserType as UserType;
    if (this.usertype === UserType.RH) {
      this.loadSurveys();
    }
  }

  loadSurveys(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.surveys = [];

    this.surveyService.apiSurveyGetSurveysForEmployeeGet$Json().subscribe({
      next: (response: SurveyDto[]) => {
        this.surveys = response || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load surveys: ' + (error.message || 'Unknown error');
      }
    });
  }

  navigateToCreateSurvey(): void {
    this.router.navigate(['/create-survey']);
  }

  editSurvey(id: string): void {
    this.router.navigate(['/edit-survey', id]);
  }

  deleteSurvey(id: string): void {
    if (confirm('Are you sure you want to delete this survey?')) {
      this.surveyService.apiSurveyDelete$Json({ id }).subscribe({
        next: () => {
          this.surveys = this.surveys.filter(survey => survey.Id !== id);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to delete survey: ' + (error.message || 'Unknown error');
        }
      });
    }
  }

  viewResponses(id: string): void {
    this.router.navigate(['/survey-responses', id]);
  }
} 