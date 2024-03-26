import { Component, OnInit, inject } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { DishService } from '../services/dish.service';
import { Day, Dish, Mealplan, DishCategory, sendDish } from '../Interfaces';
import { addDays, format, getISOWeek, lastDayOfWeek, setWeek, subDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Title } from '@angular/platform-browser';
import { OrderService } from '../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  dishesMenu1: Dish[] = [];
  dishesMenu2: Dish[] = [];
  dishesDessert: Dish[] = [];
  dishesSoup: Dish[] = [];

  showMenu1Selection!: boolean;
  showMenu2Selection!: boolean;
  showDessertSelection!: boolean;
  showSoupSelection!: boolean;

  selectedDish!: number;
  selectedDay!: string;

  newDishTitle!: string;
  newDishCategory!: string;
  newDishDescription!: string;
  newDishPrice!: number;

  private route = inject(ActivatedRoute);

  constructor(private mealService: MealserviceService, private dishService: DishService, private router: Router) { }

  ngOnInit(): void {

    const kw = this.route.snapshot.paramMap.get('kw');

    if (kw) {
      this.selectedKW = +kw;
    } else {
      this.setCurrentKW();
    }
   
    this.limitNextKW = 0;
    this.getMealplan();
    this.calculateWeekRange(this.getDateFromMondayOfKW(this.selectedKW));
    this.getDishLists();
    this.newDishPrice = 0;
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
        if (this.mealplan.days == undefined) return;
        this.mealplan.days.forEach(day => {
          day.dayofWeek = this.getWeekDayByDate(day.date);
        });
      });
  }

  getWeekDayByDate(date: Date): string {
    return format(date, 'EEEE', { locale: de });
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
        this.dishesMenu1 = dishes;
        console.log("Dishes Menü1:", this.dishesMenu1);
      });

    this.dishService.getDishesByCategory("Menü2")
      .subscribe((dishes: any[]) => {
        this.dishesMenu2 = this.dishesMenu2.concat(dishes);
        console.log("Dishes Menü2:", this.dishesMenu2);
      });

    this.dishService.getDishesByCategory("Dessert")
      .subscribe((dishes: any[]) => {
        this.dishesDessert = dishes;
        console.log("Dishes Dessert:", this.dishesDessert);
      });

    this.dishService.getDishesByCategory("Soup")
      .subscribe((dishes: any[]) => {
        this.dishesSoup = dishes;
        console.log("Dishes Soup:", this.dishesSoup);
      });
  }

  planDish(): void {
    const dayAsDate = this.getDateFromDayOfWeekAndKW(this.selectedDay, this.selectedKW);
    console.log(dayAsDate);

    // Bereist vorhandes Gericht
    if (this.selectedDish > 0) {
      const dish: sendDish = {
        id: this.selectedDish
      };

      console.log(this.selectedDish);

      this.mealService.addMealToDay(this.selectedDish, this.selectedKW, dayAsDate.getDay()).subscribe(() => {
        this.neuLaden();
      });
    }
    // Neues Gericht
    else {
      const category: DishCategory = {
        name: this.newDishCategory,
        canVeggie: false
      };

      const dish: Dish = {
        id: -1,
        dishCategory: category,
        title: this.newDishTitle,
        description: this.newDishDescription,
        price: this.newDishPrice
      };

      console.log(this.newDishCategory);
      console.log(this.newDishTitle)
      console.log(this.newDishDescription);
      console.log(this.newDishPrice);

      this.newDishCategory = '';
      this.newDishTitle = '';
      this.newDishDescription = '';
      this.newDishPrice = 0;

      this.mealService.postNewDish(dish).subscribe(
        (createdDish) => {
          console.log('New dish created:', createdDish);
          this.mealService.addMealToDay(createdDish.id, this.selectedKW, dayAsDate.getDay()).subscribe(() => {
            this.neuLaden();
          });
        },
        (error) => {
          console.error('Error creating new dish:', error);
          // Handle error if needed
        }
      );
    }
  }

  neuLaden(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url + '/dashboard/mealplan/' + this.selectedKW]);
    });
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
