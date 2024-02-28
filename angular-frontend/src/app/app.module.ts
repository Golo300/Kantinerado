import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MealplanComponent } from './mealplan/mealplan.component';
import { MealplanOrderComponent } from './mealplan-order/mealplan-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { OrderProcessComponent } from './order-process/order-process.component';

@NgModule({
  declarations: [
    AppComponent,
    MealplanComponent,
    MealplanOrderComponent,
    CheckoutComponent,
    LoginComponent,
    OrderProcessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
