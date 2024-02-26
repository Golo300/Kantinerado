import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealplanComponent } from './mealplan/mealplan.component';
import { MealplanOrderComponent } from './mealplan-order/mealplan-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth.guard.service';

const routes: Routes = [
  { path: '', component: MealplanComponent },
  { path: 'login', component: LoginComponent },
  { path: 'order', component: MealplanOrderComponent, canActivate: [AuthGuardService], data: { allowedRoles: ['ADMIN', 'USER', 'KANTEEN'] }},
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService], data: { allowedRoles: ['ADMIN', 'USER', 'KANTEEN'] }},
  { path: '**', component: LoginComponent },
  // Weitere Routen können hier hinzugefügt werden
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
