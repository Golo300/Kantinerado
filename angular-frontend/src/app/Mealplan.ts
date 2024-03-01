export interface Mealplan {
    id: number;
    calendarWeek: number;
    planned: boolean;
    days: Day[];
  }

  export interface Day {
    id: number;
    dayofWeek: string;
    noFood: boolean;
    dishes: Dish[];
  }

  export interface Dish {
    id: number;
    dishCategory: DishCategory;
    title: string;
    description: string;
    price: number;
  }

  export interface DishCategory {
    name: string;
    canVeggie: boolean;
  }

  export interface Order {
  date: Date;
  dish_id: number;
  veggie: boolean;
  }
