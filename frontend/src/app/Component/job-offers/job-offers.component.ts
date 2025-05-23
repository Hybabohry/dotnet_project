import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { JobOfferService } from '../../services/services/job-offer.service';
import { JobOfferDtoCreate } from '../../services/models/job-offer-dto-create';
import { Competence } from '../../services/models/competence';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CompetenceService } from '../../services/services';
import { HttpClient } from '@angular/common/http';
import { apiApplicationOfferJobOfferIdCandidatesGet, ApiApplicationOfferJobOfferIdCandidatesGet$Params } from '../../services/fn/application/api-application-offer-job-offer-id-candidates-get';
import { CandidatDto } from '../../services/models/candidat-dto';
import { environment } from '../../services/environment';
import { StrictHttpResponse } from '../../services/strict-http-response';
import { Observable } from 'rxjs';

interface JobOffer {
  id: string;
  posted: string;
  candidates: CandidatDto[];
  competences?: Competence[];
  description?: string;
  experience?: number;
  location?: string;
  salary?: number;
  title?: string;
  filteredCandidates?: CandidatDto[];
}

@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterOutlet],
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.css']
})
export class JobOffersComponent implements OnInit {
  showJobForm: boolean = false;
  loading: boolean = false;
  jobs: JobOffer[] = [];
  filteredJobs: JobOffer[] = [];
  newJobForm: FormGroup;
  selectedJobId: string | null = null;
  searchQuery: string = '';
  sortOption: string = 'newest';
  formErrors: string[] = [];
  isEditing: boolean = false;
  competences: Competence[] = [];

  // Pagination properties for candidates
  candidateCurrentPage: number = 1;
  candidatePageSize: number = 5;
  candidatePageSizeOptions: number[] = [5, 10, 20];
  apiUrl!: string;

  constructor(
    private router: Router,
    private jobOfferService: JobOfferService,
    private competenceService: CompetenceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.newJobForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      experience: [0, [Validators.required, Validators.min(0)]],
      salary: [0, [Validators.required, Validators.min(0)]],
      competences: ['', Validators.required]

    });
  }

  ngOnInit() {
    this.loadCompetences();
    this.loadJobs();
  }

  loadCompetences() {
    this.route.data.subscribe(data => {
      if (data['competences']) {
        this.competences = data['competences'];
      } else {
        console.error('No competences data found in route');
        this.formErrors.push('Failed to load competences');
      }
    });
  }

  loadJobs() {
    this.loading = true;
    this.jobOfferService.apiJobOfferGet().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.jobs = response.map((job: any) => ({
            id: job.Id || job.id || '',
            posted: job.Posted || job.posted || new Date().toISOString(),
            candidates: [],
            competences: job.Competences || job.competences || [],
            description: job.Description || job.description || '',
            experience: job.Experience || job.experience || 0,
            location: job.Location || job.location || '',
            salary: job.Salary || job.salary || 0,
            title: job.Title || job.title || ''
          }));
          this.filteredJobs = [...this.jobs];
          this.sortJobs();
        } else {
          this.formErrors.push('Invalid jobs data format');
          this.jobs = [];
          this.filteredJobs = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.formErrors.push('Failed to load job offers');
        this.loading = false;
      }
    });
  }
  getCandidatesForJobOffer(jobOfferId: string): Observable<CandidatDto[]> {
    const url = `${this.apiUrl}/api/application/offer/${jobOfferId}/candidates`;
    return this.http.get<CandidatDto[]>(url);
  }
  onCompetenceSelected(event: Event) {
    const select = event.target as HTMLSelectElement;
    const competenceId = select.value;
    const competencesArray = this.newJobForm.get('competences') as FormArray;

    if (!competencesArray.value.includes(competenceId)) {
      competencesArray.push(this.fb.control(competenceId));
    }
  }

  addJobOffer() {
    if (this.newJobForm.invalid) {
      this.formErrors.push('Please fill in all required fields.');
      return;
    }

    const jobOfferData: JobOfferDtoCreate = {
      Title: this.newJobForm.value.title,
      Location: this.newJobForm.value.location,
      Description: this.newJobForm.value.description,
      Experience: this.newJobForm.value.experience,
      Salary: this.newJobForm.value.salary,
      Competences: this.newJobForm.value.competences.map((id: string) =>
        this.competences.find(c => c.Id === id)
      )
    };

    const request = this.isEditing && this.selectedJobId
      ? this.jobOfferService.apiJobOfferIdGet({ id: this.selectedJobId})
      : this.jobOfferService.apiJobOfferCreatePost({ body: jobOfferData });

    request.subscribe({
      next: (response: any) => {
        console.log(this.isEditing ? 'Job offer updated successfully:' : 'Job offer created successfully:', response);
        this.resetForm();
        this.loadJobs();
        document.querySelector('.job-grid')?.scrollIntoView({ behavior: 'smooth' });

      },
      error: (error) => {
        console.error('Error creating/updating job offer:', error);
        this.formErrors.push('Failed to create/update job offer');
      }
    });
  }

  resetForm() {
    this.newJobForm.reset({
      title: '',
      location: '',
      description: '',
      experience: 0,
      salary: 0,
      competences: []
    });
    this.formErrors = [];
    this.isEditing = false;
    this.selectedJobId = null;
    this.showJobForm = false;
  }


  private navigating = false;

viewCandidates(job: JobOffer) {
  if (this.navigating) return;
  this.navigating = true;
  this.router.navigate(['/JobOffers', job.id, 'candidates']).finally(() => {
    this.navigating = false;
  });
}
  hideCandidatesAndRedirect() {
    this.selectedJobId = null;
    this.router.navigate(['/dashboard']);
  }


  filterCandidates(event: Event, job: JobOffer) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    job.filteredCandidates = job.candidates.filter((candidate: CandidatDto) =>
      (candidate.Firstname?.toLowerCase().includes(query) || false) ||
      (candidate.Lastname?.toLowerCase().includes(query) || false) ||
      (candidate.Email?.toLowerCase().includes(query) || false)
    );
    this.candidateCurrentPage = 1;
  }

  sortCandidates(event: Event, job: JobOffer) {
    const sortOption = (event.target as HTMLSelectElement).value;
    const candidates = job.filteredCandidates || job.candidates;

    candidates.sort((a: CandidatDto, b: CandidatDto) => {
      if (sortOption === 'nameAsc') {
        return (a.Firstname || '').localeCompare(b.Firstname || '');
      } else if (sortOption === 'nameDesc') {
        return (b.Firstname || '').localeCompare(a.Firstname || '');
      } else if (sortOption === 'dateAsc') {
        return new Date(a.AppliedDate || '').getTime() - new Date(b.AppliedDate || '').getTime();
      } else if (sortOption === 'dateDesc') {
        return new Date(b.AppliedDate || '').getTime() - new Date(a.AppliedDate || '').getTime();
      }
      return 0;
    });

    job.filteredCandidates = [...candidates];
    this.candidateCurrentPage = 1;
  }

  // Format competences as a comma-separated string
  formatCompetences(competences: Competence[] | null | undefined): string {
    if (!competences || competences.length === 0) {
      return 'No competences specified.';
    }
    return competences.map(c => c.Titre || 'Unknown competence').join(', ');
  }

  viewCv(cvUrl: string) {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    } else {
      this.formErrors.push('No CV available for this candidate.');
    }
  }

  shortlistCandidate(candidate: CandidatDto) {
    console.log(`Shortlisting candidate: ${candidate.Firstname} ${candidate.Lastname}`);
    this.formErrors.push(`Candidate ${candidate.Firstname} ${candidate.Lastname} shortlisted.`);
  }

  rejectCandidate(candidate: CandidatDto) {
    console.log(`Rejecting candidate: ${candidate.Firstname} ${candidate.Lastname}`);
    this.formErrors.push(`Candidate ${candidate.Firstname} ${candidate.Lastname} rejected.`);
  }

  updateJob(job: JobOffer) {
    this.loading = true;
    this.jobOfferService.apiJobOfferIdGet({ id: job.id.toString() }).subscribe({
      next: (response: any) => {
        const jobData: JobOfferDtoCreate = response.body || response;
        this.newJobForm.patchValue({
          title: jobData.Title || jobData.Title,
          location: jobData.Location || jobData.Location,
          description: jobData.Description || jobData.Description,
          experience: jobData.Experience || jobData.Experience || 0,
          salary: jobData.Salary || jobData.Salary || 0
        });

        const competencesArray = this.newJobForm.get('competences') as FormArray;
        competencesArray.clear();
        if (jobData.Competences && jobData.Competences.length > 0) {
          jobData.Competences.forEach((competence: Competence) => {
            competencesArray.push(this.fb.control(competence.Id));
          });
        }

        this.showJobForm = true;
        this.isEditing = true;
        this.selectedJobId = job.id;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching job details', error);
        this.formErrors.push('Failed to load job details');
        this.loading = false;
      }
    });
  }

  deleteJob(job: JobOffer) {
    if (confirm('Are you sure you want to delete this job offer?')) {
      this.loading = true;
      this.jobOfferService.apiJobOfferIdDelete({ id: job.id.toString() }).subscribe({
        next: () => {
          this.loadJobs();
        },
        error: (error) => {
          console.error('Error deleting job offer:', error);
          this.formErrors.push('Failed to delete job offer');
          this.loading = false;
        }
      });
    }
  }

  filterJobs(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.filteredJobs = this.jobs.filter(job =>
      (job.title?.toLowerCase().includes(this.searchQuery) || false) ||
      (job.location?.toLowerCase().includes(this.searchQuery) || false) ||
      (job.description?.toLowerCase().includes(this.searchQuery) || false)
    );
    this.sortJobs();
  }

  sortJobs(event?: Event) {
    if (event) {
      const select = event.target as HTMLSelectElement;
      this.sortOption = select.value;
    }

    this.filteredJobs.sort((a, b) => {
      const dateA = new Date(a.posted).getTime();
      const dateB = new Date(b.posted).getTime();
      return this.sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }
}