import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/services';
import { ApplicationResponseDto } from '../../services/models/application-response-dto';
import { TokenService } from '../../services/services/token.service';
import { UserType } from '../../services/models/UserType';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.css'
})
export class MyApplicationsComponent implements OnInit{
  isLoading: boolean = false;
  candidateApplications: ApplicationResponseDto[] = [];
  candidateId: string | null = null;
  usertype: UserType | null = null;
  errorMessage: string | null = null;

  constructor(
    private applicationService: ApplicationService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.candidateId = localStorage.getItem('candidateId');
    this.usertype = this.tokenService.user?.UserType as UserType;
    if (this.usertype === UserType.CANDIDATE) {
      this.fetchApplications();
    }
  }

  fetchApplications(): void {
    if (!this.candidateId) {
      this.errorMessage = 'No candidate ID found. Please log in.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.candidateApplications = [];

    this.applicationService.apiApplicationGetApplicationCandidat().subscribe({
      next: (response: ApplicationResponseDto[]) => {
        this.candidateApplications = response || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load applications: ' + (error.message || 'Unknown error');
      }
    });
  }
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'en attente':
        return 'pending';
      case 'accepté':
        return 'accepted';
      case 'rejeté':
        return 'rejected';
      default:
        return 'pending';
    }
}

}
