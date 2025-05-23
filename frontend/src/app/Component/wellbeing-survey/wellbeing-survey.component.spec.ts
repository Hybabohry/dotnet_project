import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellbeingSurveyComponent } from './wellbeing-survey.component';

describe('WellbeingSurveyComponent', () => {
  let component: WellbeingSurveyComponent;
  let fixture: ComponentFixture<WellbeingSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WellbeingSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellbeingSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
