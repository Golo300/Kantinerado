import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Day, Dish, Mealplan } from '../Mealplan';
import { lastDayOfWeek, setWeek, subDays } from 'date-fns';
import { Order } from '../OrderProcess';

@Component({
  selector: 'app-mealplan-order',
  templateUrl: './mealplan-order.component.html',
  styleUrls: ['./mealplan-order.component.css']
})
export class MealplanOrderComponent implements OnInit {
  @Output() selectedDishesChanged = new EventEmitter<any[]>();

  kw: number = 10;
  mealplan!: Mealplan;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  startDate!: Date;
  endDate!: Date;

  isBreakfastOpen: boolean = false;
  isLunchOpen: boolean = true;

  selectedDishes: Order[] = [];

  constructor(private mealService: MealserviceService) { }

  ngOnInit(): void {
    this.getMealplan();
    this.calculateWeekRange();
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
    this.mealService.getMealplan(this.kw)
      .subscribe(meaplan => {
        this.mealplan = meaplan;
        console.log(this.mealplan); // Debugging-Information
      });
  }

  getDishes(category: string, day: string) {
    const selectedDay = this.mealplan.days.find(d => d.dayofWeek === day);
    if (selectedDay) {
      return selectedDay.dishes.filter(dish => dish.dishCategory.name === category);
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
        dish_id: dish.id,
        // day: selectedDay, // Verwendung des Day-Objekts
        //ordered: 0
      };
      this.selectedDishes.push(order);
    } else {
      this.selectedDishes = this.selectedDishes.filter(order => {
        return order.dish_id !== dish.id;
    });
    }
    console.log(this.selectedDishes);
  }
}
