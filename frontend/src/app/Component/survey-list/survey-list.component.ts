import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SurveyService } from '../../services/services/survey.service';
import { SurveyDto } from '../../services/models/survey-dto';
import { TokenService } from '../../services/services/token.service';
import { UserType } from '../../services/models/UserType';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mini-navbar">
      <a [routerLink]="['/home']" class="back-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Back to Home
      </a>
    </nav>

    <section id="surveys" class="applications-section">
      <header class="section-header">
        <div class="header-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <h2>Available Surveys</h2>
      </header>

      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading surveys...</p>
      </div>

      <div class="applications-table-container" *ngIf="!isLoading && surveys.length > 0">
        <table class="applications-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Questions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let survey of surveys; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ survey.Title }}</td>
              <td>{{ survey.CreatorName }}</td>
              <td>{{ survey.CreatedAt | date:'medium' }}</td>
              <td>{{ survey.Questions.length }} questions</td>
              <td>
                <a [routerLink]="['/surveys', survey.Id]" class="action-button">
                  Take Survey
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!isLoading && surveys.length === 0" class="no-applications">
        <p>No surveys available at the moment.</p>
        <a [routerLink]="['/home']" class="explore-link">Return to Home</a>
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

    /* Tableau */
    .applications-table-container {
      overflow-x: auto;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }

    .applications-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.95rem;
    }

    .applications-table th,
    .applications-table td {
      padding: 14px 18px;
      text-align: left;
    }

    .applications-table th {
      background: #0056b3;
      color: #ffffff;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.9rem;
    }

    .applications-table td {
      color: #2d3748;
      border-bottom: 1px solid rgba(203, 213, 224, 0.3);
    }

    .applications-table tr:hover td {
      background: rgba(102, 126, 234, 0.05);
      transition: background 0.2s ease;
    }

    /* Action Button */
    .action-button {
      display: inline-flex;
      align-items: center;
      padding: 8px 16px;
      background: linear-gradient(to right, #0056b3, #2a0b9b);
      color: #ffffff;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    /* No surveys */
    .no-applications {
      text-align: center;
      padding: 4rem;
      background: rgba(246, 249, 252, 0.7);
      border-radius: 15px;
      margin-top: 2rem;
      border: 2px dashed #cbd5e0;
    }

    .no-applications p {
      font-size: 1.25rem;
      margin: 0 0 1.5rem;
      color: #64748b;
    }

    .explore-link {
      display: inline-flex;
      background: linear-gradient(to right, #0056b3, #2a0b9b);
      color: #ffffff;
      padding: 0.9rem 2rem;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .explore-link:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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

      .applications-table {
        min-width: 650px;
      }

      .no-applications {
        padding: 2.5rem;
      }
    }
  `]
})
export class SurveyListComponent implements OnInit {
  surveys: SurveyDto[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  usertype: UserType | null = null;

  constructor(
    private surveyService: SurveyService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.usertype = this.tokenService.user?.UserType as UserType;
    if (this.usertype === UserType.CANDIDATE) {
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
}