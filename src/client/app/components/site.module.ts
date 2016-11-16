// angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// libs
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MultilingualModule, translateFactory } from '../frameworks/i18n/multilingual.module';
import { SampleModule } from '../frameworks/sample/sample.module';
// app
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MealListComponent } from './meal-list/meal-list.component';
import {NameListEffects, NameListService } from './home/name-list.service';
import {MealListEffects, MealListService} from './meal-list/meal-list.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,    
    StoreModule,
    MultilingualModule,
    SampleModule,
    EffectsModule.run(NameListEffects),
    EffectsModule.run(MealListEffects)    
  ],
  declarations: [
    HomeComponent,
    AboutComponent,
    MealListComponent,
    AppComponent
  ],
  providers: [        
    NameListService,
    MealListService
  ],
  exports: [
    HomeComponent,
    AboutComponent,
    MealListComponent,
    AppComponent
  ]
})
export class SiteModule {

  constructor(@Optional() @SkipSelf() parentModule: SiteModule) {
    if (parentModule) {
      throw new Error('SiteModule already loaded; Import in root module only.');
    }
  }
}
