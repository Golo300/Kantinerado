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
    const year = this.route.snapshot.paramMap.get('year');

    if (kw && year) {
      this.selectedKW = +kw;
      this.selectedYear = +year;
    } else {
      this.setCurrentKW();
    }

    this.limitNextKW = 0;

    this.calculateWeekRange(this.getDateFromMondayOfKW(this.selectedKW));
    this.getMealplan();
    this.getPreviousOrder();
    this.getCheckoutItems();
  }

  getCheckoutItems() {
    const shoppingCart = this.orderService.getCart();
    this.newSelectedDishes = shoppingCart.newSelectedDishes;
    this.newSelectedDishes = this.newSelectedDishes.filter(order => getISOWeek(order.date) === this.selectedKW);
    this.selectedDishes.push(...this.newSelectedDishes)
    this.deletedDishes = shoppingCart.deletedDishes;
    this.deletedDishes = this.deletedDishes.filter(order => getISOWeek(order.date) === this.selectedKW);
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
    this.getCheckoutItems();
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
    this.getCheckoutItems();
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

  checkboxChanged(event: any, dish: Dish, dayOfWeek: string, isVeggie: boolean = false): void {
    if (event.target.checked) {
      // Anlegen einer neuen Order
      const order: Order = {
        date: this.getDateFromDayOfWeekAndKW(dayOfWeek),
        dish: dish,
        veggie: isVeggie
      };
      // Hinzufügen zu selectedDishes
      this.selectedDishes.push(order);
  
      // Wenn Dish noch nicht in orderedDishes --> Zusätzlich hinzufügen zu newSelectedDishes
      if (!this.checkIfOrdered(dish, dayOfWeek)) {
        this.newSelectedDishes.push(order);
      }
  
      // Wenn Dish in orderedDishes und deletedDishes ist --> Zusätzlich entfernen aus deletedDishes
      else {
        // Spezialfall: Menü 2 war bereits bestellt, wurde abgewählt und wird nun erneut ausgewählt --> NUR zu newSelectedDishes hinzufügen, damit die Veggie Eigenschaft neu gesetzt werden kann (2 separate Bestellungen)
        if (dish.dishCategory.name == "Menü2") {
          this.newSelectedDishes.push(order);
        }
        else {
          this.deletedDishes = this.deletedDishes.filter(element => {
            const orderedDay = this.getWeekDayByDate(element.date);
            return !(dish.id === element.dish.id && orderedDay === dayOfWeek);
          });
        }
      }
    } else {
      // Entfernen aus selectedDishes
      this.selectedDishes = this.selectedDishes.filter(order => {
        return order.dish.id !== dish.id || this.getWeekDayByDate(order.date) !== dayOfWeek;
      });
  
      // Wenn Dish noch nicht in orderedDishes also in newSelectedDishes ist --> Zusätzlich entfernen aus newSelectedDishes
      this.newSelectedDishes = this.newSelectedDishes.filter(order => {
        return dish.id !== order.dish.id || this.getWeekDayByDate(order.date) !== dayOfWeek
      });

      this.orderedDishes.forEach(element => {
        const orderedDay = this.getWeekDayByDate(element.date);
        if (dish.id === element.dish.id && orderedDay === dayOfWeek) {
          // Füge das Gericht nur einmal zu deletedDishes hinzu
          if (!this.deletedDishes.some(deletedOrder => deletedOrder.dish.id === dish.id && this.getWeekDayByDate(deletedOrder.date) === dayOfWeek)) {
            this.deletedDishes.push(element);
          }
        }
      });
    }
  }  

  toggleVegetarianOption(event: any, dish: Dish, dayOfWeek: string): void {
    const isVeggie = event.target.checked;
  
    // Finde die bestehende Bestellung für das Gericht
    let existingOrderIndex = this.selectedDishes.findIndex(order => 
      order.dish.id === dish.id && this.getWeekDayByDate(order.date) === dayOfWeek
    );
  
    if (existingOrderIndex !== -1) {
      // Wenn die Bestellung existiert, aktualisiere nur die veggie-Option
      this.selectedDishes[existingOrderIndex].veggie = isVeggie;
    }

    existingOrderIndex = this.newSelectedDishes.findIndex(order => 
      order.dish.id === dish.id && this.getWeekDayByDate(order.date) === dayOfWeek
    );
  
    if (existingOrderIndex !== -1) {
      this.newSelectedDishes[existingOrderIndex].veggie = isVeggie;
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
  
        this.selectedDishes = this.selectedDishes.filter(order => getISOWeek(order.date) === this.selectedKW);
        this.orderedDishes = this.orderedDishes.filter(order => getISOWeek(order.date) === this.selectedKW);
  
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

  checkIfNewSelected(dish: Dish, day:string): boolean {

    while (!this.orderReady) {
    }

    let isNewSelected: boolean = false;

    this.newSelectedDishes.forEach(element => {
      const orderedDay = this.getWeekDayByDate(element.date);
      if (dish.id === element.dish.id && orderedDay === day) {
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
      if (JSON.stringify(dish) === JSON.stringify(element.dish)) {
        isSelected = true;
      }
    });
    return isSelected;
  }

  checkIfVegetarian(dish: Dish, day: string): boolean {
    let isVegetarian = false;
  
    this.selectedDishes.forEach(order => {
      const orderedDay = this.getWeekDayByDate(order.date);
      if (order.dish.id === dish.id && orderedDay === day) {
        isVegetarian = order.veggie;
      }
    });

    this.newSelectedDishes.forEach(order => {
      const orderedDay = this.getWeekDayByDate(order.date);
      if (order.dish.id === dish.id && orderedDay === day) {
        isVegetarian = order.veggie;
      }
    });
  
    return isVegetarian;
  }  

  calculateTotalPricePerDay(currentDay: string): number {
    let totalPrice = 0;

    this.selectedDishes.forEach(order => {
      let date = new Date(order.date)
        if (this.weekDays[date.getDay() - 1] == currentDay)
          {
            totalPrice += order.dish.price
          }
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  setSelectionType(dish: Dish, day: string): string {
    if (this.checkIfNewSelected(dish, day)) {
      return 'blue-text';
    } else if (this.checkIfDeleted(dish, day)) {
      return 'red-text';
    } else if (this.checkIfOrdered(dish, day)) {
      return 'green-text';
    } else {
      return 'black-text';
    }
  }

  addToDate(i: number): Date {
    const result = new Date(this.startDate);
    result.setDate(result.getDate() + i);
    return result ;
  }
}
