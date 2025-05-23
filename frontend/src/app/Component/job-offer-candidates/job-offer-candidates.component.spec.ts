import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferCandidatesComponent } from './job-offer-candidates.component';

describe('JobOfferCandidatesComponent', () => {
  let component: JobOfferCandidatesComponent;
  let fixture: ComponentFixture<JobOfferCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOfferCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOfferCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
