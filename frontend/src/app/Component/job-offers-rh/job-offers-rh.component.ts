import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// ... rest of imports ...

@Component({
  selector: 'app-job-offers-rh',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Job Offers Management</h2>
        <button class="add-offer" (click)="navigateToCreateOffer()">
          <i class="fas fa-plus"></i> Add New Offer
        </button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading job offers...</p>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>

      <div *ngIf="!isLoading && !errorMessage" class="job-offers-list">
        <div *ngIf="jobOffers.length === 0" class="empty-state">
          <i class="fas fa-briefcase"></i>
          <p>No job offers available. Create a new offer to get started!</p>
          <button class="create-btn" (click)="navigateToCreateOffer()">
            Create Offer
          </button>
        </div>

        <div *ngFor="let offer of jobOffers" class="job-offer-card">
          <div class="offer-content">
            <div class="offer-icon">
              <i class="fas fa-briefcase"></i>
            </div>
            <div class="offer-info">
              <h3>{{ offer.Title || 'Untitled Offer' }}</h3>
              <div class="offer-details">
                <span><i class="fas fa-map-marker-alt"></i> {{ offer.Location }}</span>
                <span><i class="fas fa-clock"></i> Posted: {{ offer.CreatedAt | date:'mediumDate' }}</span>
                <span><i class="fas fa-users"></i> Applications: {{ offer.Applications?.length || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button class="action-btn edit-btn" (click)="editOffer(offer.Id)" title="Edit Offer">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" (click)="deleteOffer(offer.Id)" title="Delete Offer">
              <i class="fas fa-trash"></i>
            </button>
            <button class="action-btn candidates-btn" (click)="viewCandidates(offer.Id)" title="View Candidates">
              <i class="fas fa-user-friends"></i>
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

    .add-offer {
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

    .add-offer:hover {
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

    .job-offers-list {
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

    .job-offer-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .job-offer-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
    }

    .offer-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .offer-icon {
      width: 48px;
      height: 48px;
      background: #fff7ed;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .offer-icon i {
      font-size: 1.5rem;
      color: #F59E0B;
    }

    .offer-info h3 {
      font-size: 1.25rem;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
    }

    .offer-details {
      display: flex;
      gap: 1.5rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .offer-details span {
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

    .candidates-btn {
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

      .job-offer-card {
        flex-direction: column;
        gap: 1rem;
      }

      .offer-content {
        flex-direction: column;
        text-align: center;
      }

      .offer-details {
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
export class JobOffersRhComponent implements OnInit {
  jobOffers: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadJobOffers();
  }

  loadJobOffers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    // Implement job offers loading logic here
  }

  navigateToCreateOffer(): void {
    // Implement navigation to create offer page
  }

  editOffer(id: string): void {
    // Implement edit offer logic
  }

  deleteOffer(id: string): void {
    // Implement delete offer logic
  }

  viewCandidates(id: string): void {
    // Implement view candidates logic
  }
} 