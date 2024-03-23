import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealplanAdministrationComponent } from './mealplan-administration.component';

describe('MealplanAdministrationComponent', () => {
  let component: MealplanAdministrationComponent;
  let fixture: ComponentFixture<MealplanAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MealplanAdministrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealplanAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
