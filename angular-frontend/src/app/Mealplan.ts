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
    dishCategory: string;
    title: string;
    description: string;
    price: number;
  }
  