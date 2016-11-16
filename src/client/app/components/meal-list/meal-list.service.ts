import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// libs
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

// app
import { Config } from '../../frameworks/core/index';
import { Analytics, AnalyticsService } from '../../frameworks/analytics/index';

// analytics
const CATEGORY: string = 'MealList';

/**
 * ngrx setup start --
 */
interface IMealListActions {
  INIT: string;
  INITIALIZED: string;
  INIT_FAILED: string;
  ADD: string;
  NAME_ADDED: string;
}

export const MEAL_LIST_ACTIONS: IMealListActions = {
  INIT: `${CATEGORY}_INIT`,
  INITIALIZED: `${CATEGORY}_INITIALIZED`,
  INIT_FAILED: `${CATEGORY}_INIT_FAILED`,
  ADD: `${CATEGORY}_ADD`,
  NAME_ADDED: `${CATEGORY}_NAME_ADDED`
};

export function mealListReducerFn(state: any = [], action: Action) {
  switch (action.type) {
    case MEAL_LIST_ACTIONS.INITIALIZED:
      return [...action.payload];
    case MEAL_LIST_ACTIONS.NAME_ADDED:
      return [...state, action.payload];
    default:
      return state;
  }
};

export const mealListReducer: ActionReducer<any> = mealListReducerFn;
/**
 * ngrx end --
 */

@Injectable()
export class MealListService extends Analytics {

  constructor(public analytics: AnalyticsService, private store: Store<any>) {
    super(analytics);
    this.category = CATEGORY;

    this.store.dispatch({ type: MEAL_LIST_ACTIONS.INIT });
  }
}

@Injectable()
export class MealListEffects {

  @Effect() init$ = this.actions$
    .ofType(MEAL_LIST_ACTIONS.INIT)
    .switchMap(action => {
      let path = `${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/data.json`;
      return this.http.get(path);
    })
    .map(res => (res.json().map(x => ({ name: x, time: new Date() }))))
    .map(res => ({ type: MEAL_LIST_ACTIONS.INITIALIZED, payload: res }))
    // nothing reacting to failure at moment but you could if you want (here for example)
    .catch(() => Observable.of({ type: MEAL_LIST_ACTIONS.INIT_FAILED }));

  @Effect() add$ = this.actions$
    .ofType(MEAL_LIST_ACTIONS.ADD)
    .map(action => {
      let name = action.payload;
      // analytics
      this.MealList.track(MEAL_LIST_ACTIONS.NAME_ADDED, { label: name });
      return ({ type: MEAL_LIST_ACTIONS.NAME_ADDED, payload: { name: name, time: new Date() } });
    });

  constructor(private store: Store<any>, private actions$: Actions, private MealList: MealListService, private http: Http) { }

}
