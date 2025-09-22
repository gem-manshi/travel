import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelJouneryComponent } from './travel-jounery.component';

describe('TravelJouneryComponent', () => {
  let component: TravelJouneryComponent;
  let fixture: ComponentFixture<TravelJouneryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelJouneryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelJouneryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
