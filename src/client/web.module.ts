// angular
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Http } from '@angular/http';

// libs
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateLoader } from 'ng2-translate';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// app
import { AppComponent } from './app/components/app.component';
import { routes } from './app/components/app.routes';

// feature modules
import { CoreModule } from './app/frameworks/core/core.module';
import { AnalyticsModule } from './app/frameworks/analytics/analytics.module';
import { MultilingualModule, translateFactory } from './app/frameworks/i18n/multilingual.module';
import { SampleModule } from './app/frameworks/sample/sample.module';
import {SiteModule} from './app/components/site.module';
import {nameListReducer,NameListEffects, NameListService } from './app/components/home/name-list.service';
import {multilingualReducer} from './app/frameworks/i18n/services/multilingual.service';
import {mealListReducer} from './app/components/meal-list/meal-list.service';

// config
import { Config, WindowService, ConsoleService } from './app/frameworks/core/index';
Config.PLATFORM_TARGET = Config.PLATFORMS.WEB;
if (String('<%= BUILD_TYPE %>') === 'dev') {
  // only output console logging in dev mode
  Config.DEBUG.LEVEL_4 = true;
}

// sample config (extra)
import { AppConfig } from './app/frameworks/sample/services/app-config';
import { MultilingualService } from './app/frameworks/i18n/services/multilingual.service';
// custom i18n language support
MultilingualService.SUPPORTED_LANGUAGES = AppConfig.SUPPORTED_LANGUAGES;

let routerModule = RouterModule.forRoot(routes);

if (String('<%= TARGET_DESKTOP %>') === 'true') {
  Config.PLATFORM_TARGET = Config.PLATFORMS.DESKTOP;
  // desktop (electron) must use hash
  routerModule = RouterModule.forRoot(routes, {useHash: true});
}

declare var window, console;

// For AoT compilation to work:
export function win() {
  return window;
}
export function cons() {
  return console;
}

@NgModule({
  imports: [
    BrowserModule,
    CoreModule.forRoot([
      { provide: WindowService, useFactory: (win) },
      { provide: ConsoleService, useFactory: (cons) }
    ]),
    routerModule,
    AnalyticsModule,
    MultilingualModule.forRoot([{
      provide: TranslateLoader,
      deps: [Http],
      useFactory: (translateFactory)
    }]),
    SampleModule,
    SiteModule,
    StoreModule.provideStore({      
      i18n: multilingualReducer,
      names: nameListReducer,
      mealList: mealListReducer
    }),
    EffectsModule.run(NameListEffects)
    //StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  declarations: [
    
  ],
  providers: [    
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    }
  ],
  bootstrap: [AppComponent]
})

export class WebModule { }
