// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
// app
import { BaseComponent, RouterExtensions } from '../../frameworks/core/index';
import { MEAL_LIST_ACTIONS, MealListService } from './meal-list.service';

@BaseComponent({
  moduleId: module.id,
  selector: 'sd-meal-list',
  templateUrl: 'meal-list.component.html',
  styleUrls: ['meal-list.component.css'],
  providers: [MealListService]
})
export class MealListComponent {
  public mealList: Observable<any>;
  public dataList: Observable<any>;
  public newMeal: string = '';

  constructor(private store: Store<any>, public routerext: RouterExtensions, private http: Http) {
    this.mealList = store.select('mealList');
    http.get('/assets/data1.json').map(res => {
      return this.dataList = res.json(); 
    });
    //.catch(() => console.log("Error request"));    

    this.dataList
  }

  /*
   * @param newMeal  any text as input.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  addMeal(): boolean {
    this.store.dispatch({ type: MEAL_LIST_ACTIONS.ADD, payload: this.newMeal });
    this.newMeal = '';
    return false;
  }  
}
