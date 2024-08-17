import { Component, OnInit, inject } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Dish, FullOrder} from '../Interfaces';
import { addDays, addWeeks, getISOWeek, getYear, isBefore, subDays } from 'date-fns';
import { Order } from "../Interfaces";
import { OrderService } from '../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MealplanComponent } from '../mealplan/mealplan.component';

@Component({
  selector: 'app-mealplan-order',
  templateUrl: './mealplan-order.component.html',
  styleUrls: ['./mealplan-order.component.css']
})
export class MealplanOrderComponent extends MealplanComponent implements OnInit {


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

  constructor(mealService: MealserviceService, private orderService: OrderService, private router: Router) {
    super(mealService);
  }

  override ngOnInit(): void {
    const kw = this.route.snapshot.paramMap.get('kw');

    if (kw) {
      this.selectedKW = +kw;
    } else {
      this.setCurrentKW();
    }

    this.limitNextKW = 0;

    this.calculateWeekRange(this.getDateFromMondayOfKW(this.selectedKW));
    this.getMealplan();
    this.getPreviousOrder();
  }

  override nextWeek(): void {
    const mondayOfSelectedKW = this.startDate;

    // Berechnung des Montags der nächsten Woche
    const resultDate = addDays(mondayOfSelectedKW, 7);

    // current kw, year und limit ändern
    this.selectedKW = getISOWeek(resultDate);
    this.selectedYear = resultDate.getFullYear();
    this.limitNextKW++;

    this.calculateWeekRange(resultDate);
    this.getMealplan();
    this.getPreviousOrder();
  }

  override lastWeek(): void {
    const mondayOfSelectedKW = this.startDate;

    // Berechnung des Montags der letzten Woche
    const resultDate = subDays(mondayOfSelectedKW, 7);

    // current kw, year und limit ändern
    this.selectedKW = getISOWeek(resultDate);
    this.selectedYear = resultDate.getFullYear();
    this.limitNextKW--;

    this.calculateWeekRange(resultDate);
    this.getMealplan();
    this.getPreviousOrder();
  }

  getDateFromDayOfWeekAndKW(dayOfWeek: string): Date {
    const weekdayIndex = this.getWeekdayIndex(dayOfWeek);
    if (weekdayIndex === -1) {
      throw new Error('Invalid weekday provided');
    }

    const daysToAdd = weekdayIndex;
    return addDays(this.startDate, daysToAdd);
  }

  private getWeekdayIndex(weekday: string): number {
    const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    return weekdays.findIndex(day => day === weekday);
  }

  toggleCollapse(collapseId: string): void {
    if (collapseId === 'collapseBreakfast') {
      this.isBreakfastOpen = !this.isBreakfastOpen; // Toggle breakfast collapse
    } else if (collapseId === 'collapseLunch') {
      this.isLunchOpen = !this.isLunchOpen; // Toggle lunch collapse
    }
  }

  checkboxChanged(event: any, dish: Dish, dayOfWeek: string): void {

      if (event.target.checked) {
        // Anlegen einer neuen Order
        const order: Order = {
          date: this.getDateFromDayOfWeekAndKW(dayOfWeek),
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
      } else {
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
  }

  isKWValid(selected_kw: number): boolean {
    let valid = false;

    const currentDate = new Date();
    const currentYear = getYear(currentDate);

    // Nächste KW und Jahr
    const nextWeek = addWeeks(currentDate, 1);
    const nextKW = getISOWeek(nextWeek);
    const nextYear = getYear(nextWeek);

    const thursday = this.donnerstagVorherigeKW(selected_kw);

    if (nextYear === currentYear) {
      if (selected_kw >= nextKW) {
        valid = isBefore(currentDate, thursday);
      }
    } else if (nextYear === currentYear + 1) {
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


        this.selectedDishes = this.selectedDishes.filter(order => { console.log(getISOWeek(order.date), getISOWeek); return getISOWeek(order.date) === this.selectedKW; });
        this.orderedDishes = this.orderedDishes.filter(order => { console.log(getISOWeek(order.date), this.selectedKW); return getISOWeek(order.date) === this.selectedKW; });

        this.orderReady = true;
      });
  }

  checkIfOrdered(dish: Dish, day: string): boolean {

    while (!this.orderReady) {
    }

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

    while (!this.orderReady) {
    }

    let isNewSelected: boolean = false;

    this.newSelectedDishes.forEach(element => {
      if (dish === element.dish) {
        isNewSelected = true;
      }
    });
    return isNewSelected;
  }

  checkIfDeleted(dish: Dish, day: string): boolean {

    while (!this.orderReady) {
    }

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

    while (!this.orderReady) {
    }

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

    this.selectedDishes.forEach(order => {
      var date = new Date(order.date)
        if (this.weekDays[date.getDay() - 1] == currentDay)
          {
            totalPrice += order.dish.price
          }
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  setSelectionType(dish: Dish, day: string): string {
    if (this.checkIfNewSelected(dish)) {
      return 'blue-text';
    } else if (this.checkIfDeleted(dish, day)) {
      return 'red-text';
    } else if (this.checkIfOrdered(dish, day)) {
      return 'green-text';
    } else {
      return 'black-text';
    }
  }


}
