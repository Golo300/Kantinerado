import { Component, OnInit, inject } from '@angular/core';
import { MealserviceService } from '../services/mealplan.service';
import { DishService } from '../services/dish.service';
import { Dish, DayDishDTO, DishCategory } from '../Interfaces';
import { addDays } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';
import { MealplanComponent } from '../mealplan/mealplan.component';

@Component({
  selector: 'app-mealplan-administration',
  templateUrl: './mealplan-administration.component.html',
  styleUrls: ['./mealplan-administration.component.css']
})
export class MealplanAdministrationComponent extends MealplanComponent implements OnInit {
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
  mealServiceLocal!: MealserviceService;

  constructor(mealService: MealserviceService, private dishService: DishService, private router: Router)
  {
    super(mealService);
    this.mealServiceLocal = mealService;
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
    this.getDishLists();
    this.newDishPrice = 0;
  }

  getDishLists(): void {
    this.dishService.getDishesByCategory("Menü1")
      .subscribe((dishes: any[]) => {
        this.dishesMenu1 = dishes;
      });

    this.dishService.getDishesByCategory("Menü2")
      .subscribe((dishes: any[]) => {
        this.dishesMenu2 = this.dishesMenu2.concat(dishes);
      });

    this.dishService.getDishesByCategory("Dessert")
      .subscribe((dishes: any[]) => {
        this.dishesDessert = dishes;
      });

    this.dishService.getDishesByCategory("Soup")
      .subscribe((dishes: any[]) => {
        this.dishesSoup = dishes;
      });
  }

  planDish(): void {
    const dayAsDate = this.getDateFromDayOfWeekAndKW(this.selectedDay);

      const ddDTO: DayDishDTO = {
        dishId: this.selectedDish,
        date: dayAsDate
      };

    // Bereist vorhandes Gericht
    if (this.selectedDish > 0) {

      this.mealServiceLocal.addDish(ddDTO).subscribe(() => {
            this.getMealplan();
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

      this.dishService.createDish(dish).subscribe(
        (dishId) => {
          ddDTO.dishId = dishId;
          this.mealServiceLocal.addDish(ddDTO).subscribe(() => {
              this.dishesMenu1 = [];
              this.dishesMenu2 = [];
              this.dishesSoup = [];
              this.dishesDessert = [];
              this.getDishLists();
              this.getMealplan();
      });
        },
        (error) => {
          this.getMealplan();
          this.dishesMenu1 = [];
          this.dishesMenu2 = [];
          this.dishesSoup = [];
          this.dishesDessert = [];
          this.getDishLists();
        }
      );
      this.newDishCategory = '';
      this.newDishTitle = '';
      this.newDishDescription = '';
      this.newDishPrice = 0;

    }
  }

  override isLastKWSwitchPossible(): boolean {
    return true;
  }

  override isNextKWSwitchPossible(): boolean {
    return true;
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
}
