import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelJourneyComponent } from './travel-journey.component';

describe('TravelJourneyComponent', () => {
  let component: TravelJourneyComponent;
  let fixture: ComponentFixture<TravelJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelJourneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
