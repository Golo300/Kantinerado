/**
 * Provides interfaces for the application.
 */

/**
 * Data structure for a meal plan.
 */
export interface Mealplan {
  /** Unique identifier of the meal plan. */
  id: number;
  /** Calendar week of the meal plan. */
  calendarWeek: number;
  /** Indicates whether the meal plan is planned or not. */
  planned: boolean;
  /** Array of days in the week. */
  days: Day[];
}

/**
* Data structure for a day.
*/
export interface Day {
  /** Unique identifier of the day. */
  id: number;
  /** Date of the day. */
  date: Date;
  /** Day of the week. */
  dayofWeek: string;
  /** Indicates if there is no food planned for the day. */
  noFood: boolean;
  /** Array of dishes planned for the day. */
  dishes: Dish[];
}

export interface DayDishDTO
{
    dishId: number;
    date: Date;
}

/**
* Data structure for a single dish.
*/
export interface Dish {
  /** Unique identifier of the dish. */
  id: number;
  /** Category of the dish. */
  dishCategory: DishCategory;
  /** Title of the dish. */
  title: string;
  /** Description of the dish. */
  description: string;
  /** Price of the dish. */
  price: number;
}

export interface sendDish {
  id: number;
}

/**
* Data structure for dish category.
*/
export interface DishCategory {
  /** Name of the dish category. */
  name: string;
  /** Indicates if the dish category can be vegetarian. */
  canVeggie: boolean;
}

/**
* Order created in the frontend.
*/
export interface Order {
  /** Date of the order. */
  date: Date;
  /** The dish being ordered. */
  dish: Dish;
  /** Indicates if the dish is vegetarian. */
  veggie: boolean;
}

/**
* Interface for sending new orders to the backend.
*/
export interface SendOrder {
  /** Date of the order. */
  date: Date;
  /** ID of the dish being ordered. */
  dish_id: number;
  /** Indicates if the dish is vegetarian. */
  veggie: boolean;
}

/**
* Order received from the backend.
*/
export interface FullOrder {
  /** Unique identifier of the order. */
  id: number;
  /** Date of the order. */
  date: Date;
  /** Date the order was placed. */
  ordered: Date;
  /** The dish ordered. */
  dish: Dish;
  /** Indicates if the dish is vegetarian. */
  veggie: boolean;
}

/**
 * Data structure for an application user.
 */
export interface ApplicationUser {
  /** Unique identifier of the user. */
  userId: number;
  /** Username of the user. */
  username: string;
  /** Employee ID of the user. */
  employeeiD: number;
  /** Email of the user. */
  email: string;
  /** Roles assigned to the user. */
  authorities: Role;
}

/**
 * Data structure for a role.
 */
export interface Role {
  /** Unique identifier of the role. */
  roleId: number;
  /** The authority granted by the role. */
  authority: string;
}
