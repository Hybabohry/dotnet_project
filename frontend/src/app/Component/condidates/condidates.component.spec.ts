import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondidatesComponent } from './condidates.component';

describe('CondidatesComponent', () => {
  let component: CondidatesComponent;
  let fixture: ComponentFixture<CondidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
