import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealplanComponent } from './mealplan/mealplan.component';
import { MealplanOrderComponent } from './mealplan-order/mealplan-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth.guard.service';
import { RegisterComponent } from './register/register.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  { path: '', component: MealplanComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'order', component: MealplanOrderComponent, canActivate: [AuthGuardService], data: { allowedRoles: ['ADMIN', 'USER', 'KANTEEN'] }},
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService], data: { allowedRoles: ['ADMIN', 'USER', 'KANTEEN'] }},
  { path: 'mealplan', component: MealplanComponent },
  { path: 'view', component: ViewOrderComponent },
  { path: 'detailview/:kw/:day', component: DetailViewComponent },
  { path: '**', component: LoginComponent },
  // Weitere Routen können hier hinzugefügt werden
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
