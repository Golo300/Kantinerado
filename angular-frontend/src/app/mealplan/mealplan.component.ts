import { Component, OnInit } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Day, Mealplan } from '../Interfaces';
import { addDays, format, getISOWeek, lastDayOfWeek, setWeek, subDays } from 'date-fns';
import { AuthService } from '../services/auth.service';
import { de } from 'date-fns/locale';

@Component({
  selector: 'app-mealplan',
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css']
})
export class MealplanComponent implements OnInit {
  selectedKW!: number;
  currentKW!: number;
  selectedYear!: number;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  startDate!: Date;
  endDate!: Date;
  limitNextKW!: number;
  days!: Day[];

  constructor(private mealService: MealserviceService) { }

  ngOnInit(): void {
    this.setCurrentKW();
    this.limitNextKW = 0;
    this.calculateWeekRange(this.getDateFromMondayOfKW(this.selectedKW));
    this.getMealplan();
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

    this.calculateWeekRange(resultDate);
    this.getMealplan();
  }

  lastWeek(): void {
    const mondayOfSelectedKW = this.startDate;

    // Berechnung des Montags der letzten Woche
    const resultDate = subDays(mondayOfSelectedKW, 7);

    // current kw, year und limit ändern
    this.selectedKW = getISOWeek(resultDate);
    this.selectedYear = resultDate.getFullYear();
    this.limitNextKW--;

    this.calculateWeekRange(resultDate);
    this.getMealplan();
  }

  getDateFromMondayOfKW(kw: number): Date {
    const monday = setWeek(new Date(this.selectedYear, 0, 1), kw, { weekStartsOn: 1 }); // Erster Tag (Montag) der Kalenderwoche
    return monday;
  }
  calculateWeekRange(mondayOfSelectedKW: Date): void {
    const monday = mondayOfSelectedKW;
    const sunday = lastDayOfWeek(monday, { weekStartsOn: 1 });

    this.startDate = monday;
    this.endDate = sunday;
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
    this.mealService.getMealplan(this.startDate, this.endDate)
      .subscribe((days:Day[]) => {
        this.days = days
        this.days.forEach(element => {
        console.log("days:" + element.date);

        });
      });
  }

  getWeekDayByDate(date: Date): string {
    return format(date, 'EEEE', { locale: de });
  }

  getDishes(category: string, day: string) {
    if (this.days == undefined) return [];

    const selectedDay = this.days.find(d => this.getWeekDayByDate(d.date) === day);
    if (selectedDay) {
      return selectedDay.dishes.filter(dish => dish.dishCategory.name === category);
    }
  return [];
}
}
