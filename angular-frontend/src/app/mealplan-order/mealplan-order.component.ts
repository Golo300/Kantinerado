import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Day, Dish, FullOrder, Mealplan } from '../Interfaces';
import { addDays, addWeeks, format, getISOWeek, getYear, isBefore, lastDayOfWeek, setDay, setHours, setMinutes, setWeek, subDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Order } from "../Interfaces";
import { OrderService } from '../services/order.service';
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mealplan-order',
  templateUrl: './mealplan-order.component.html',
  styleUrls: ['./mealplan-order.component.css']
})
export class MealplanOrderComponent implements OnInit {

  selectedKW!: number;
  currentKW!: number;
  selectedYear!: number;
  mealplan!: Mealplan | null;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  startDate!: Date;
  endDate!: Date;
  limitNextKW!: number;

  private route = inject(ActivatedRoute);

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

  constructor(private mealService: MealserviceService, private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    const kw = this.route.snapshot.paramMap.get('kw');

    if (kw) {
      this.selectedKW = +kw;
    } else {
      this.setCurrentKW();
    }

    this.limitNextKW = 0;

    this.getMealplan();
    this.getPreviousOrder();
    this.calculateWeekRange(this.getDateFromMondayOfKW(this.selectedKW));
  }

  setCurrentKW() {
    const currentDate = new Date();
    this.selectedKW = getISOWeek(currentDate);
    this.currentKW = this.selectedKW;
    this.selectedYear = currentDate.getFullYear();
  }

  nextWeek(): void {
    const mondayOfSelectedKW = this.startDate;

    // Berechnung des Montags der nächsten Woche
    const resultDate = addDays(mondayOfSelectedKW, 7);

    // current kw, year und limit ändern
    this.selectedKW = getISOWeek(resultDate);
    this.selectedYear = resultDate.getFullYear();
    this.limitNextKW++;

    this.getMealplan();
    this.getPreviousOrder();
    this.calculateWeekRange(resultDate);
  }

  lastWeek(): void {
    const mondayOfSelectedKW = this.startDate;

    // Berechnung des Montags der letzten Woche
    const resultDate = subDays(mondayOfSelectedKW, 7);

    // current kw, year und limit ändern
    this.selectedKW = getISOWeek(resultDate);
    this.selectedYear = resultDate.getFullYear();
    this.limitNextKW--;

    this.getMealplan();
    this.getPreviousOrder();
    this.calculateWeekRange(resultDate);
  }

  getDateFromMondayOfKW(kw: number): Date {
    const monday = setWeek(new Date(this.selectedYear, 0, 1), kw, { weekStartsOn: 1 }); // Erster Tag (Montag) der Kalenderwoche
    return monday;
  }
  calculateWeekRange(mondayOfSelectedKW: Date): void {
    const monday = mondayOfSelectedKW;
    const sunday = lastDayOfWeek(monday, { weekStartsOn: 1 });
    const saturday = subDays(sunday, 1);

    this.startDate = monday;
    this.endDate = saturday;
  }

  isLastKWSwitchPossible(): boolean {
    if (this.selectedKW != this.currentKW) {
      return true;
    }
    return false;
  }

  isNextKWSwitchPossible(): boolean {
    // Maximal 2 kommende Wochen
    if (this.limitNextKW < 2) {
      return true;
    }
    return false;
  }

  getMealplan(): void {
    this.mealplan = null;
    this.mealService.getMealplan(this.selectedKW)
      .subscribe((meaplan: Mealplan) => {
        this.mealplan = meaplan;
        if (this.mealplan.days == undefined) return;
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

    // Setze die Stundenkomponente auf 12 Uhr mittags
    resultDate.setHours(12, 0, 0, 0);

    return resultDate;
}


  getDishes(category: string, day: string) {
    if (this.mealplan == undefined) return [];
    if (this.mealplan.days == undefined) return [];

    const selectedDay = this.mealplan.days.find(d => d.dayofWeek === day);
    if (selectedDay) {
      return selectedDay.dishes.filter(dish => dish.dishCategory.name === category);
    }
    return [];
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

    let kw = -1;
    if (this.mealplan) { kw = this.mealplan.calendarWeek; }

    if (this.isKWValid(kw)) {
      if (event.target.checked) {

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
  }

  isKWValid(selected_kw: number): boolean {
    let valid = false;

    const currentDate = new Date();

    // Aktuelle KW und Jahr
    const currentKW = getISOWeek(currentDate);
    const currentYear = getYear(currentDate);

    // Nächste KW und Jahr
    const nextWeek = addWeeks(currentDate, 1);
    const nextKW = getISOWeek(nextWeek);
    const nextYear = getYear(nextWeek);

    // Nächste KW und Jahr
    const lastWeekFromSelected = addWeeks(selected_kw, -1);
    const lastKWFromSelected = getISOWeek(lastWeekFromSelected);
    const lastYearFromSelected = getYear(lastWeekFromSelected);

    const thursday = this.donnerstagVorherigeKW(selected_kw);

    if (nextYear === currentYear) {
      if (selected_kw >= nextKW) {
        valid = isBefore(currentDate, thursday);
      }
    }
    else if (nextYear === currentYear + 1) {
      if (selected_kw - 52 >= nextKW) {
        valid = isBefore(currentDate, thursday);
      }
    }

    return valid;
  }

  donnerstagVorherigeKW(kw: number): Date {
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    // Datum des angegebenen Donnerstags in der Kalenderwoche
    const kwDate = new Date(year, 0, (kw - 1) * 7); // Der 1. Januar liegt normalerweise in der KW 1
    const dayOfWeek = kwDate.getDay(); // Tag der Woche (0 = Sonntag, 1 = Montag, ..., 6 = Samstag)

    // Subtrahiere die Tage bis zum Donnerstag (Tag 4)
    kwDate.setDate(kwDate.getDate() + (4 - dayOfWeek));

    // Subtrahiere 7 Tage, um den Donnerstag der vorherigen Woche zu erhalten
    kwDate.setDate(kwDate.getDate() - 7);

    kwDate.setHours(18);

    return kwDate;
  }

  addToCart(): void {
    console.log("New selected Dishes: ", this.newSelectedDishes);
    console.log("Deleted Dishes: ", this.deletedDishes);

    const shoppingCart = {
      newSelectedDishes: this.newSelectedDishes,
      deletedDishes: this.deletedDishes
    };

    const shoppingCartJSON = JSON.stringify(shoppingCart);
    localStorage.setItem('shopping_cart', shoppingCartJSON);

    this.router.navigate(["/checkout"]);

  }

  getPreviousOrder() {
    this.orderService.getAllOrders()
      .subscribe((orders: any[]) => {
        this.orderedDishes = orders;

        // Kopieren der bestellten Gerichte in selectedDishes
        this.selectedDishes = this.orderedDishes
          .map(order => ({
            date: order.date,
            dish: order.dish,
            veggie: order.veggie
          }));

        this.selectedDishes = this.selectedDishes.filter(order => { console.log(this.getWeekNumber(order.date), this.selectedKW); return this.getWeekNumber(order.date) === this.selectedKW; });
        this.orderedDishes = this.orderedDishes.filter(order => { console.log(this.getWeekNumber(order.date), this.selectedKW); return this.getWeekNumber(order.date) === this.selectedKW; });
        this.orderReady = true;
        console.log("Ordered Dishes:", this.orderedDishes); // Debugging-Information
      });
  }

  getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);
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

  checkIfSelected(dish: Dish): boolean {

    while (!this.orderReady) { }

    let isSelected: boolean = false;

    this.selectedDishes.forEach(element => {
      if (dish === element.dish) {
        isSelected = true;
      }
    });
    return isSelected;
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
    return parseFloat(totalPrice.toFixed(2));
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


