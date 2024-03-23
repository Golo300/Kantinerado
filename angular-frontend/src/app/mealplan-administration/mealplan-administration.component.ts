import { Component, OnInit } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { DishService } from '../services/dish.service';
import { Day, Dish, Mealplan } from '../Interfaces';
import { addDays, format, getISOWeek, lastDayOfWeek, setWeek, subDays } from 'date-fns';
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

  dishesMenu1And2: Dish[] = [];
  dishesDessert: Dish[] = [];
  dishesSoup: Dish[] = [];


  constructor(private mealService: MealserviceService, private dishService: DishService) { }

  ngOnInit(): void {
    this.setCurrentKW();
    this.limitNextKW = 0;
    this.getMealplan();
    this.calculateWeekRange(this.getDateFromMondayOfKW(this.selectedKW));
    this.getDishLists();
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

  getDishLists(): void {
    this.dishService.getDishesByCategory("Menü1")
      .subscribe((dishes: any[]) => {
        this.dishesMenu1And2 = dishes;
        console.log("Dishes Menü1 and Menü2:", this.dishesMenu1And2);
      });

    this.dishService.getDishesByCategory("Menü2")
      .subscribe((dishes: any[]) => {
        this.dishesMenu1And2 = this.dishesMenu1And2.concat(dishes);
        console.log("Dishes Menü1 and Menü2:", this.dishesMenu1And2);
      });

    this.dishService.getDishesByCategory("Dessert")
      .subscribe((dishes: any[]) => {
        this.dishesMenu1And2 = dishes;
        console.log("Dishes Dessert:", this.dishesDessert);
      });

    this.dishService.getDishesByCategory("Soup")
      .subscribe((dishes: any[]) => {
        this.dishesMenu1And2 = dishes;
        console.log("Dishes Soup:", this.dishesSoup);
      });
  }

  showDropdowns: { [key: string]: boolean } = {};

  toggleDropdown(day: string): void {
    this.showDropdowns[day] = !this.showDropdowns[day];
  }

  isDropdownVisible(day: string): boolean {
    return this.showDropdowns[day];
  }

  planDish(day: String, category: String): void {

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
}
