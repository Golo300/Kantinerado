import { Component, OnInit } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Mealplan } from '../Mealplan';
import { lastDayOfWeek, setWeek, subDays } from 'date-fns';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mealplan',
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css']
})
export class MealplanComponent implements OnInit {
  kw: number = 10;
  mealplan!: Mealplan;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  startDate!: Date;
  endDate!: Date;

  constructor(private mealService: MealserviceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getMealplan();
    this.calculateWeekRange();
    
    this.authService.test()
    .subscribe(response => {
      console.log(response); // Debugging-Information
    });
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
}
