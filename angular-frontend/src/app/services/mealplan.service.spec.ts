import { TestBed } from '@angular/core/testing';

import { MealplanService } from './mealplan.service';

describe('MealplanService', () => {
  let service: MealplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealplanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
