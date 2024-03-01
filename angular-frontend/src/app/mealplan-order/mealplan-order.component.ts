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
  @Output() selectedDishesChanged = new EventEmitter<any[]>();

  kw!: number;
  mealplan!: Mealplan | null;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  startDate!: Date;
  endDate!: Date;

  isBreakfastOpen: boolean = false;
  isLunchOpen: boolean = true;

  selectedDishes: Order[] = [

    {
      date: new Date(2024, 3, 1), // Monate werden von 0 bis 11 gezählt, daher 2 für März
      dish_id: 1,
      veggie: false
  }

  ];
  message : String = "";

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
  
  createOrder() {
      this.orderService.createOrder(this.selectedDishes[0]).pipe(
        tap((response: any) => {
          // Erfolgsfall
          this.message = "Bestellung erfolgreich";
          console.log(this.message); // Debugging-Information
        }),
        catchError(error => {
          console.error(error); // Fehler ausgeben
          return of(null); // Rückgabe eines Observable, um das Haupt-Observable fortzusetzen
        })
      ).subscribe();
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
        dish_id: dish.id,
        veggie: false //TODO: User muss angeben ob er veggie will oder nicht
      };
      this.selectedDishes.push(order);
    } else {
      const index = this.selectedDishes.findIndex(item => item.dish_id === dish.id);
      if (index !== -1) {
        this.selectedDishes.splice(index, 1);
      }
    }
    console.log(this.selectedDishes);
  }

  addToCart(): void {
    this.createOrder()
    this.selectedDishesChanged.emit(this.selectedDishes);
  }
}
