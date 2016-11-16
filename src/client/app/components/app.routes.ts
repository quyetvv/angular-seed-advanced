// app
import { HomeRoutes } from './home/home.routes';
import { MealListRoutes } from './meal-list/meal-list.routes';
import { AboutRoutes } from './about/about.routes';

export const routes: Array<any> = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...MealListRoutes
];
