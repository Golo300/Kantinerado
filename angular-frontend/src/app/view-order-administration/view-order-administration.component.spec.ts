import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderAdministrationComponent } from './view-order-administration.component';

describe('ViewOrderAdministrationComponent', () => {
  let component: ViewOrderAdministrationComponent;
  let fixture: ComponentFixture<ViewOrderAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOrderAdministrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewOrderAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
