import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealplanComponent } from './mealplan/mealplan.component';
import { MealplanOrderComponent } from './mealplan-order/mealplan-order.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  { path: '', component: MealplanComponent },
  { path: 'order', component: MealplanOrderComponent },
  { path: 'checkout', component: CheckoutComponent },
  // Weitere Routen können hier hinzugefügt werden
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
