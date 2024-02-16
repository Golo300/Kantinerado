import { Component, OnInit } from '@angular/core';
import { MealserviceService } from '../mealplan.service';
import { Mealplan } from '../Mealplan';

@Component({
  selector: 'app-mealplan',
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css']
})
export class MealplanComponent implements OnInit {

  kw : number = 10;
  mealplan!: Mealplan;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  constructor(private mealService: MealserviceService) 
  {
   }

  ngOnInit(): void {
    this.getMealplan();
  }

  nextWeek(): void {
    this.kw++;
    this.getMealplan();
  }

  lastWeek(): void {
    this.kw--;
    this.getMealplan();
  }

  getMealplan(): void {
    this.mealService.getMealplan(this.kw)
      .subscribe(meaplan => this.mealplan = meaplan);
      console.log(this.mealplan);
  }

  getDishes(category: string, day: string) {
    const selectedDay = this.mealplan.days.find(d => d.dayofWeek === day);
    if (selectedDay) {
      return selectedDay.dishes.filter(dish => dish.dishCategory === category);
    }
    return [];
  }

}
