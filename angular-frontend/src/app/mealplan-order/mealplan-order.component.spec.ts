import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealplanOrderComponent } from './mealplan-order.component';

describe('MealplanOrderComponent', () => {
  let component: MealplanOrderComponent;
  let fixture: ComponentFixture<MealplanOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MealplanOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealplanOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
