import { TestBed } from '@angular/core/testing';

import { MealserviceService } from './mealplan.service';

describe('MealplanService', () => {
  let service: MealserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
