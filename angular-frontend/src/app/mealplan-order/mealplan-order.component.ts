import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Day, Dish, FullOrder, Mealplan } from '../Interfaces';
import { format, getISOWeek, lastDayOfWeek, setWeek, subDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Order } from "../Interfaces";
import { OrderService } from '../services/order.service';
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, firstValueFrom, of, tap } from 'rxjs';

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

  orderReady: boolean = true;

  // Alle im Frontend ausgewählten Dishes (enthält orderedDishes und newSelectedDishes)
  selectedDishes: Order[] = [];
  message: String = "";

  // Alle bereits bestellten Dishes aus dem Backend
  orderedDishes: FullOrder[] = [];

  // Alle NEU im Frontend ausgewählten Dishes 
  newSelectedDishes: Order[] = [];

  // Alle im Backend bestellten oder im Frontend wieder abgewählten Dishes 
  deletedDishes: FullOrder[] = [];

  constructor(private mealService: MealserviceService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.setCurrentKW();
    this.getMealplan();
    this.getPreviousOrder();
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
        this.mealplan.days.forEach(day => {
          day.dayofWeek = this.getWeekDayByDate(day.date);
        });
      });
  }

  getWeekDayByDate(date: Date): string {
    return format(date, 'EEEE', { locale: de });
  }

  getDateFromDayOfWeekAndKW(dayOfWeek: string, kw: number): Date {
    // Mapping der Wochentage auf entsprechende Zahlen
    const dayIndexMap: { [key: string]: number } = {
      'Montag': 1,
      'Dienstag': 2,
      'Mittwoch': 3,
      'Donnerstag': 4,
      'Freitag': 5,
      'Samstag': 6,
    };

    // Berechnung des Datums basierend auf der Kalenderwoche und dem Wochentag
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const monday = setWeek(new Date(currentYear, 0, 1), kw, { weekStartsOn: 1 }); // Erster Tag der Kalenderwoche
    const mondayDayOfWeek = monday.getDay(); // Wochentag des ersten Tages der Kalenderwoche

    // Differenz zwischen dem Montag der Kalenderwoche und dem gewünschten Wochentag
    const dayDifference = dayIndexMap[dayOfWeek] - mondayDayOfWeek;

    // Berechnung des gewünschten Datums
    const resultDate = new Date(monday);
    resultDate.setDate(monday.getDate() + dayDifference);

    return resultDate;
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

  checkboxChanged(event: any, dish: Dish, dayOfWeek: string): void {
    console.log(dish.title);

    if (event.target.checked) {
      let kw = -1;
      if (this.mealplan) { kw = this.mealplan.calendarWeek; }

      // Anlegen einer neuen Order
      const order: Order = {
        date: this.getDateFromDayOfWeekAndKW(dayOfWeek, kw),
        dish: dish,
        veggie: false //TODO: User muss angeben ob er veggie will oder nicht
      };
      // Hinzufügen zu selectedDishes
      this.selectedDishes.push(order);

      // Wenn Dish noch nicht in orderedDishes --> Zusätzlich hinzufügen zu newSelectedDishes
      if (!this.checkIfOrdered(dish, dayOfWeek)) {
        this.newSelectedDishes.push(order);
      }

      // Wenn Dish in orderedDishes und deletedDishes ist --> Zusätzlich entfernen aus deletedDishes
      else {
        this.deletedDishes = this.deletedDishes.filter(element => {
          const orderedDay = this.getWeekDayByDate(element.date);
          return !(dish.id === element.dish.id && orderedDay === dayOfWeek);
      });
      }
    }

    else {
      // Entfernen aus selectedDishes
      this.selectedDishes = this.selectedDishes.filter(order => {
        return order.dish.id !== dish.id || this.getWeekDayByDate(order.date) !== dayOfWeek;
      });

      // Wenn Dish noch nicht in orderedDishes also in newSelectedDishes ist --> Zusätzlich entfernen aus newSelectedDishes
      this.newSelectedDishes = this.newSelectedDishes.filter(order => order.dish !== dish);

      // Wenn Dish bereist in orderedDishes ist --> Zusätzlich hinzufügen zu deletedDishes
      this.orderedDishes.forEach(element => {
        const orderedDay = this.getWeekDayByDate(element.date);
        if (dish.id === element.dish.id && orderedDay === dayOfWeek) {
          this.deletedDishes.push(element);
        }
      });
    }
    console.log("---------------------");
    console.log("Selected Dishes:", this.selectedDishes);
    console.log("New Selected Dishes:", this.newSelectedDishes);
    console.log("Deleted Dishes:", this.deletedDishes);
    console.log("Ordered Dishes:", this.orderedDishes);
  }

  addToCart(): void {
    console.log(this.selectedDishes);
    const shopping_cart_new = JSON.stringify(this.newSelectedDishes);
    localStorage.setItem('shopping_cart_new', shopping_cart_new);

  }

  getPreviousOrder() {
    this.orderService.getAllOrders()
      .subscribe((orders: any[]) => {
        this.orderedDishes = orders;

        // Kopieren der bestellten Gerichte in selectedDishes
        this.selectedDishes = this.orderedDishes.map(order => ({
          date: order.date,
          dish: order.dish,
          veggie: order.veggie
        }));

        this.orderReady = true;
        console.log("Ordered Dishes:", this.orderedDishes); // Debugging-Information
      });
  }

  checkIfOrdered(dish: Dish, day: string): boolean {

    while (!this.orderReady) { }

    let isOrdered: boolean = false;

    this.orderedDishes.forEach(element => {
      const orderedDay = this.getWeekDayByDate(element.date);
      if (dish.id === element.dish.id && orderedDay === day) {
        isOrdered = true;
      }
    });
    return isOrdered;
  }

  checkIfNewSelected(dish: Dish): boolean {

    while (!this.orderReady) { }

    let isNewSelected: boolean = false;

    this.newSelectedDishes.forEach(element => {
      if (dish === element.dish) {
        isNewSelected = true;
      }
    });
    return isNewSelected;
  }

  checkIfDeleted(dish: Dish, day: string): boolean {

    while (!this.orderReady) { }

    let isDeleted: boolean = false;

    this.deletedDishes.forEach(element => {
      const orderedDay = this.getWeekDayByDate(element.date);
      if (dish.id === element.dish.id && orderedDay === day) {
        isDeleted = true;
      }
    });
    return isDeleted;
  }

  calculateTotalPricePerDay(currentDay: string): number {
    let totalPrice = 0;

    this.mealplan?.days.forEach(day => {
      if (day.dayofWeek === currentDay) {
        day.dishes.forEach(dish => {
          this.selectedDishes.forEach(selectedDish => {
            if (dish === selectedDish.dish) {
              totalPrice += selectedDish.dish.price;
            }
          });
          this.orderedDishes.forEach(ordered => {
            if (dish.id === ordered.dish.id && currentDay == this.getWeekDayByDate(ordered.date) && !(this.selectedDishes.find(ordered => ordered.dish === dish))) {
              totalPrice += ordered.dish.price;
            }
          });
          this.deletedDishes.forEach(deleted => {
            if (dish.id === deleted.dish.id && currentDay == this.getWeekDayByDate(deleted.date)) {
              totalPrice -= deleted.dish.price;
            }
          });
        });
      }
    });
    return totalPrice;
  }

  setSelectionType(dish: Dish, day: string): string {
    if (this.checkIfNewSelected(dish)) {
      return 'blue-text';
    }
    else if (this.checkIfDeleted(dish, day)) {
      return 'red-text';
    }
    else if (this.checkIfOrdered(dish, day)) {
      return 'green-text';
    }
    else {
      return 'black-text';
    }
  }
}


