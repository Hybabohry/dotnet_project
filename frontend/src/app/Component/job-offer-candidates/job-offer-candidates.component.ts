import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../services/services/job-offer.service';
import { ApplicationService } from '../../services/services';
import { ApplicationResponseDto } from '../../services/models/application-response-dto';
import { CandidatDto } from '../../services/models/candidat-dto';
import { Competence } from '../../services/models/competence';
import { environment } from '../../services/environment';
import { CommonModule } from '@angular/common';
import { InterviewService } from '../../services/services/interview.service';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface JobOffer {
  id: string;
  posted: string;
  description?: string;
  experience?: number;
  location?: string;
  salary?: number;
  title?: string;
  competences?: Competence[];
}
interface InterviewDtoCreate {
  ApplicationId: string;
  ScheduledDate: string;
  Location: string;
}
interface InterviewResponse {
  Message: string;
  InterviewId: string;
  MeetLink?: string;
}
@Component({
  selector: 'app-job-offer-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-offer-candidates.component.html',
  styleUrls: ['./job-offer-candidates.component.css']
})
export class JobOfferCandidatesComponent implements OnInit {
  job: JobOffer | null = null;
  applications: ApplicationResponseDto[] = []; 
  filteredApplications: ApplicationResponseDto[] = []; 
  loading: boolean = false;
  formErrors: string[] = [];
  currentSort: string = 'dateDesc';
  candidateCurrentPage: number = 1;
  candidatePageSize: number = 5;
  candidatePageSizeOptions: number[] = [5, 10, 20];
  percentageQualified: any;
  mostQualifiedCandidate: any;
  selectedApplication: ApplicationResponseDto | null = null;
  interviews: any[] = [];
  isLoadingInterviews: boolean = false;
  hasLoadedInterviews: boolean = false;
  today: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private applicationService: ApplicationService,
    private http: HttpClient,
    private interviewService: InterviewService
  ) {
    const now = new Date();
    this.today = now.toISOString().slice(0, 16);
  }

  ngOnInit() {
    const jobId = this.route.snapshot.paramMap.get('id');
    console.log('Job ID from route:', jobId);
    if (jobId) {
      this.loadJobDetails(jobId).subscribe({
        next: () => {
          this.loadCandidates(jobId);
        },
        error: (error) => {
          console.error('Failed to load job details:', error);
          this.router.navigate(['/JobOffers']);
        }
      });
    } else {
      this.formErrors.push('Invalid job offer ID');
      this.router.navigate(['/JobOffers']);
    }
  }

  loadCandidates(jobId: string) {
    this.loading = true;
    this.applicationService.apiApplicationOfferJobOfferIdCandidatesGet({ jobOfferId: jobId }).subscribe({
      next: (response: any) => { // Temporarily use 'any' to inspect the raw response
        console.log('Raw response:', response); // Log the raw response
        console.log('Applications received:', response);
        this.applications = response.Candidates;
        this.filteredApplications = [...response.Candidates];
        this.percentageQualified = response.PercentageQualified;
        this.mostQualifiedCandidate = response.MostQualifiedCandidate;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
        this.formErrors.push('Failed to load candidates: ' + (error.error?.Message || error.message));
        this.loading = false;
      }
    });
  }
  loadJobDetails(jobId: string) {
    this.loading = true;
    return this.jobOfferService.apiJobOfferIdGet({ id: jobId }).pipe(
      tap({
        next: (response: any) => {
          console.log('Job details response:', response);
          const jobData = response.body || response;
          this.job = {
            id: jobData.Id || jobData.id || '',
            posted: jobData.Posted || jobData.posted || new Date().toISOString(),
            description: jobData.Description || jobData.description || '',
            experience: jobData.Experience || jobData.experience || 0,
            location: jobData.Location || jobData.location || '',
            salary: jobData.Salary || jobData.salary || 0,
            title: jobData.Title || jobData.title || '',
            competences: jobData.Competences || jobData.competences || []
          };
          console.log('Job details loaded:', this.job);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading job details:', error);
          this.formErrors.push('Failed to load job details');
          this.loading = false;
          throw error;
        }
      })
    );
  }

  goBack() {
    this.router.navigate(['/JobOffers']);
  }

  paginatedApplications(): ApplicationResponseDto[] {
    const startIndex = (this.candidateCurrentPage - 1) * this.candidatePageSize;
    const endIndex = startIndex + this.candidatePageSize;
    return this.filteredApplications.slice(startIndex, endIndex);
  }

  candidateTotalPages(): number {
    return Math.ceil(this.filteredApplications.length / this.candidatePageSize);
  }

  goToCandidatePage(page: number) {
    if (page >= 1 && page <= this.candidateTotalPages()) {
      this.candidateCurrentPage = page;
    }
  }

  changeCandidatePageSize(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.candidatePageSize = +select.value;
    this.candidateCurrentPage = 1;
  }

  getPageNumbers(): number[] {
    const totalPages = this.candidateTotalPages();
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.candidateCurrentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  filterCandidates(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    console.log('application',this.applications)
    this.filteredApplications = this.applications.filter(app =>
      (app.Candidate.Firstname?.toLowerCase().includes(query) || false) ||
      (app.Candidate.Lastname?.toLowerCase().includes(query) || false) ||
      (app.Candidate.Email?.toLowerCase().includes(query) || false)
    );
    this.candidateCurrentPage = 1;
  }

  sortCandidatesBy(sortOption: string) {
    this.currentSort = sortOption;
    this.filteredApplications.sort((a, b) => {
      if (sortOption === 'nameAsc') {
        return (a.Candidate.Firstname || '').localeCompare(b.Candidate.Firstname || '');
      } else if (sortOption === 'nameDesc') {
        return (b.Candidate.Firstname || '').localeCompare(a.Candidate.Firstname || '');
      } else if (sortOption === 'dateAsc') {
        return new Date(a.ApplicationDate).getTime() - new Date(b.ApplicationDate).getTime();
      } else if (sortOption === 'dateDesc') {
        return new Date(b.ApplicationDate).getTime() - new Date(a.ApplicationDate).getTime();
      }
      return 0;
    });
    this.filteredApplications = [...this.filteredApplications]; 
    this.candidateCurrentPage = 1;
  }

  formatCompetences(competences: Competence[] | null | undefined, limit: number = 3, isExpanded: boolean = false): string {
    if (!competences || competences.length === 0) {
      return 'N/A';
    }

    // Normalize case and remove duplicates
    const uniqueCompetences = [...new Set(
      competences.map(c => {
        const titleCase = (c.Titre ?? '').toLowerCase()
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return titleCase;
      })
    )];

    if (isExpanded || uniqueCompetences.length <= limit) {
      return uniqueCompetences.join(', ') || 'N/A';
    }

    return uniqueCompetences.slice(0, limit).join(', ') + ` (+${uniqueCompetences.length - limit} more)`;
  }

  getStatusClass(app: ApplicationResponseDto): string {
    const status = app.Status?.toLowerCase() || 'pending'; 
    switch (status) {
      case 'shortlisted':
        return 'status-shortlisted';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }

  shortlistCandidate(app: ApplicationResponseDto) {
    console.log(`Shortlisting candidate: ${app.Candidate.Firstname} ${app.Candidate.Lastname}`);
    app.Status = 'Shortlisted'; // Add status to ApplicationResponseDto if needed
    this.formErrors.push(`Candidate ${app.Candidate.Firstname} ${app.Candidate.Lastname} shortlisted.`);
  }

  rejectCandidate(app: ApplicationResponseDto) {
    console.log(`Rejecting candidate: ${app.Candidate.Firstname} ${app.Candidate.Lastname}`);
    app.Status = 'Rejected'; // Add status to ApplicationResponseDto if needed
    this.formErrors.push(`Candidate ${app.Candidate.Firstname} ${app.Candidate.Lastname} rejected.`);
  }

  viewCv(cvFile?: any) {
    console.log(cvFile)
    if (!cvFile || !cvFile.Content) {
      this.formErrors.push('No CV available for this candidate.');
      return;
    }

    const byteCharacters = atob(cvFile.Content);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: cvFile.ContentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
    window.URL.revokeObjectURL(url);
  }
  openScheduleInterviewModal(app: ApplicationResponseDto) {
    this.selectedApplication = app;
    this.loadInterviews(app.ApplicationId);
  }

  loadInterviews(applicationId: string) {
    this.isLoadingInterviews = true;
    this.interviewService.apiApplicationInterviewsApplicationIdGet({ applicationId }).subscribe({
      next: (response: any) => {
        this.interviews = response || [];
        this.isLoadingInterviews = false;
        this.hasLoadedInterviews = true;
      },
      error: (error) => {
        console.error('Error fetching interviews:', error);
        this.formErrors.push('Failed to load interviews: ' + (error.error?.Message || error.message));
        this.isLoadingInterviews = false;
      }
    });
  }

  
  scheduleInterview(interviewData: { date: string; location: string }) {
    if (!this.selectedApplication) {
        this.formErrors.push('No application selected for interview.');
        return;
    }

    const payload: InterviewDtoCreate = {
        ApplicationId: this.selectedApplication.ApplicationId,
        ScheduledDate: new Date(interviewData.date).toISOString(),
        Location: interviewData.location
    };

    console.log('Sending interview data:', JSON.stringify(payload));
    this.interviewService.apiApplicationInterviewsPost({ body: payload }).subscribe({
        next: (response: InterviewResponse) => {
            console.log('Interview scheduled:', response);
            this.formErrors.push(`Interview scheduled successfully. ${response.MeetLink ? 'Google Meet Link: ' + response.MeetLink : ''}`);
            this.loadInterviews(this.selectedApplication!.ApplicationId);
            this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
            console.error('Error scheduling interview:', err);
            this.formErrors.push(`Failed to schedule interview: ${err.error?.Message || 'An unexpected error occurred.'}`);
        }
    });
}
displayMessage(message: string) {
  alert(message); 
}


  closeModal() {
    this.selectedApplication = null;
    this.interviews = [];
    this.isLoadingInterviews = false;
    this.hasLoadedInterviews = false;
  }
}