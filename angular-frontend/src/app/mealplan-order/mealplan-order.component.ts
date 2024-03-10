import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Day, Dish, Mealplan } from '../Mealplan';
import { getISOWeek, lastDayOfWeek, setWeek, subDays } from 'date-fns';
import {Order} from "../Mealplan";
import {OrderService} from '../services/order.service';
import {HttpErrorResponse} from "@angular/common/http";
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-mealplan-order',
  templateUrl: './mealplan-order.component.html',
  styleUrls: ['./mealplan-order.component.css']
})
export class MealplanOrderComponent implements OnInit {

  kw!: number;
  mealplan!: Mealplan | null;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  startDate!: Date;
  endDate!: Date;

  isBreakfastOpen: boolean = false;
  isLunchOpen: boolean = true;

  selectedDishes: Order[] = [];
  message : String = "";

  //orderedDishes: FullOrder[] = [];

  constructor(private mealService: MealserviceService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.setCurrentKW();
    this.getMealplan();
    this.calculateWeekRange();
  }
  setCurrentKW() {
    const currentDate = new Date();
    this.kw = getISOWeek(currentDate);
  }

  nextWeek(): void {
    this.kw++;
    this.getMealplan();
    this.calculateWeekRange();
    this.getPriviousOrder();
  }

  lastWeek(): void {
    this.kw--;
    this.getMealplan();
    this.calculateWeekRange();
  }

  getMealplan(): void {
    this.mealplan = null;
    this.mealService.getMealplan(this.kw)
      .subscribe((meaplan: Mealplan) => {
        this.mealplan = meaplan;
        console.log(this.mealplan); // Debugging-Information
      });
  }

  getDishes(category: string, day: string) {
    if (this.mealplan != null) {
      const selectedDay = this.mealplan.days.find(d => d.dayofWeek === day);
      if (selectedDay) {
        return selectedDay.dishes.filter(dish => dish.dishCategory.name === category);
      }
    }
    return [];
  }
  

  calculateWeekRange(): void {
    const currentYear = new Date().getFullYear();

    const monday = setWeek(new Date(currentYear, 0, 1), this.kw, { weekStartsOn: 1 });
    const sunday = lastDayOfWeek(monday, { weekStartsOn: 1 });
    const saturday = subDays(sunday, 1);

    this.startDate = monday;
    this.endDate = saturday;
  }

  toggleCollapse(collapseId: string): void {
    if (collapseId === 'collapseBreakfast') {
      this.isBreakfastOpen = !this.isBreakfastOpen; // Toggle breakfast collapse
    } else if (collapseId === 'collapseLunch') {
      this.isLunchOpen = !this.isLunchOpen; // Toggle lunch collapse
    }
  }

  checkboxChanged(event: any, dish: Dish): void {
    console.log(dish.title);
    if (event.target.checked) {
      const order: Order = {
        date: new Date(),
        dish: dish,
        veggie: false //TODO: User muss angeben ob er veggie will oder nicht
      };

      this.selectedDishes.push(order)

    } else {
      this.selectedDishes.filter(item => item.dish !== dish)
      
    }
    console.log(this.selectedDishes);
    const shopping_cart = JSON.stringify(this.selectedDishes);
    localStorage.setItem('shopping_cart', shopping_cart);
  }

  addToCart(): void {
    console.log(this.selectedDishes);
    const shopping_cart = JSON.stringify(this.selectedDishes);
    localStorage.setItem('shopping_cart', shopping_cart);
  }
}
