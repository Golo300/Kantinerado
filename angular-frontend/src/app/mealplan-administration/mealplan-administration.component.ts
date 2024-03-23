import { Component, OnInit } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { Day, Mealplan } from '../Interfaces';
import { addDays, format, getISOWeek, getYear, lastDayOfWeek, setWeek, subDays } from 'date-fns';
import { de } from 'date-fns/locale';

@Component({
  selector: 'app-mealplan-administration',
  templateUrl: './mealplan-administration.component.html',
  styleUrls: ['./mealplan-administration.component.css']
})
export class MealplanAdministrationComponent implements OnInit {
  selectedKW!: number;
  currentKW!: number;
  selectedYear!: number;
  mealplan!: Mealplan | null;
  weekDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  startDate!: Date;
  endDate!: Date;
  limitNextKW!: number;

  constructor(private mealService: MealserviceService,) { }

  ngOnInit(): void {
    this.setCurrentKW();
    this.limitNextKW = 0;
    this.getMealplan();
    this.calculateWeekRange(this.getDateFromMondayOfKW(this.selectedKW));
  }

  setCurrentKW() {
    const currentDate = new Date();
    this.selectedKW = getISOWeek(currentDate);
    this. currentKW = this.selectedKW;
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
    this.calculateWeekRange(resultDate);
  }

  getDateFromMondayOfKW(kw: number): Date {
    const monday = setWeek(new Date(this.selectedYear, 0, 1), kw, { weekStartsOn: 1 }); // Erster Tag (Montag) der Kalenderwoche
    return monday;
}

  getMealplan(): void {
    this.mealplan = null;
    this.mealService.getMealplan(this.selectedKW)
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

  getDishes(category: string, day: string) {
    if (this.mealplan != null) {
      const selectedDay = this.mealplan.days.find(d => d.dayofWeek === day);
      if (selectedDay) {
        return selectedDay.dishes.filter(dish => dish.dishCategory.name === category);
      }
    }
    return [];
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
    return true;
  }

  planDish(day: String): void {

  }
}
