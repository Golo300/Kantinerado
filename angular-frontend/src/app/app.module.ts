import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MealplanComponent } from './mealplan/mealplan.component';
import { MealplanOrderComponent } from './mealplan-order/mealplan-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JwtInterceptor } from './helper/jwt.interceptor';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { MealplanAdministrationComponent } from './mealplan-administration/mealplan-administration.component';
import { ViewOrderAdministrationComponent } from './view-order-administration/view-order-administration.component';
import { AccountManagementAdminComponent } from './account-management-admin/account-management-admin.component';
import { AccountViewComponent } from './account-view/account-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MealplanComponent,
    MealplanOrderComponent,
    CheckoutComponent,
    LoginComponent,
    RegisterComponent,
    DetailViewComponent,
    ViewOrderComponent,
    MealplanAdministrationComponent,
    ViewOrderAdministrationComponent,
    AccountManagementAdminComponent,
    AccountViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [  
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
