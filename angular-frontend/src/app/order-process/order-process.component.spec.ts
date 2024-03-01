import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProcessComponent } from './order-process.component';

describe('OrderProcessComponent', () => {
  let component: OrderProcessComponent;
  let fixture: ComponentFixture<OrderProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
