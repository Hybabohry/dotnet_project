import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApplicationDtoPost } from '../../services/models/application-dto-post';
import { JobOfferService } from '../../services/services';
import { ApplicationService } from '../../services/services';
import { LoginService } from '../../services/services/login.service';
import { TokenService } from '../../services/services/token.service';
import { JobOffer } from '../../services/models/job-offer';
import { UserType } from '../../services/models/UserType';
import { ChatbotComponent } from '../shared/chatbot/chatbot.component';
import { ApplicationResponseDto } from '../../services/models/application-response-dto';
import { StrictHttpResponse } from '../../services/strict-http-response';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chatbotStatus = true;
  UserType = UserType;
  jobs: JobOffer[] = [];
  filteredJobs: JobOffer[] = [];
  searchTitle: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  candidateId: string | null = null;
  selectedJob: JobOffer | null = null;
  cvFile: File | null = null;
  isLoggedIn: boolean = false;
  usertype: UserType | null = null;
  applications: ApplicationResponseDto[] = [];
  candidateApplications: ApplicationResponseDto[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenservice: TokenService,
    private jobOfferService: JobOfferService,
    private loginService: LoginService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.fetchJobOffers();
    this.isLoggedIn = !!localStorage.getItem('token') || !!this.tokenservice.user;
    this.candidateId = localStorage.getItem('candidateId');
    this.usertype = this.tokenservice.user?.UserType as UserType;
    console.log('Is CANDIDATE?', this.usertype === UserType.CANDIDATE);
    console.log('User type:', this.usertype);
    console.log('Is logged in:', this.isLoggedIn);
  }

  fetchJobOffers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.jobOfferService.apiJobOfferGet(this.http).subscribe({
      next: (response: JobOffer[]) => {
        this.jobs = response || [];
        this.filteredJobs = [...this.jobs];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load job offers: ' + (error.message || 'Unknown error');
      }
    });
  }

  startApplication(job: JobOffer): void {
    this.selectedJob = job;
    this.cvFile = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  onCvFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
    
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        input.value = '';
        return;
      }
      this.cvFile = input.files[0];
    }
  }


  applyForJob(): void {
    if (!this.candidateId || !this.selectedJob?.Id || !this.cvFile) {
      this.errorMessage = 'All fields are required';
      return;
    }
  
    // Verify the file is a PDF
    if (this.cvFile.type !== 'application/pdf') {
      this.errorMessage = 'Only PDF files are accepted';
      return;
    }
  
    // Create a new File instance to ensure fresh metadata
    let cvFile = new File(
      [this.cvFile], 
      this.cvFile.name || 'cv.pdf', 
      { type: this.cvFile.type || 'application/pdf' }
    );
  
    const applicationDto: ApplicationDtoPost = {
      CandidatId: this.candidateId,

      JobOfferId: this.selectedJob.Id.toString(),
    };
   
  
    console.log('Submitting application with:', {
      CandidatId: applicationDto.CandidatId,
      JobOfferId: applicationDto.JobOfferId,
      CvFile: this.cvFile
    });
  
    this.applicationService.apiApplicationApplyPost$Response({ body: applicationDto }).subscribe({
      next: (response) => {
        this.successMessage = response.body.Message;
        this.selectedJob = null;
        this.cvFile = null;
      },
      error: (error) => {
        console.error('Full error:', error);
        
        let errorMessage = 'Failed to submit application';
        if (error.error) {
          if (error.error.errors) {
            errorMessage = Object.entries(error.error.errors)
              .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
              .join('\n');
          } else if (error.error.Message) {
            errorMessage = error.error.Message;
          } else if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
        }
        
        this.errorMessage = errorMessage;
      }
    });
  }

  cancelApplication(): void {
    this.selectedJob = null;
    this.cvFile = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  logout(): void {
    this.loginService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('candidateId');
    this.tokenservice.clear();
    this.candidateId = null;
    this.isLoggedIn = false;
    this.usertype = null;
    this.jobs = [];
    this.successMessage = 'Logged out successfully!';
    this.router.navigate(['/login']);
  }

  onSearch(): void {
    if (!this.searchTitle.trim()) {
      this.filteredJobs = [...this.jobs];
      return;
    }
    
    const searchTerm = this.searchTitle.toLowerCase().trim();
    this.filteredJobs = this.jobs.filter(job => 
      job.Title?.toLowerCase().includes(searchTerm) ?? false
    );
  }

  clearSearch(): void {
    this.searchTitle = '';
    this.filteredJobs = [...this.jobs];
  }
}