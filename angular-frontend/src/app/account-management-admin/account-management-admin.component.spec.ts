import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementAdminComponent } from './account-management-admin.component';

describe('AccountManagementAdminComponent', () => {
  let component: AccountManagementAdminComponent;
  let fixture: ComponentFixture<AccountManagementAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountManagementAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountManagementAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
