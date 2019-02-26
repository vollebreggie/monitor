import { HttpXSRFInterceptor } from './inteceptors/XSRFInterceptor';

import { AlertComponent } from './Components/Alert/alert.component';
import { LoginComponent } from './Components/Login/login.component';
import { ConfigureSystemComponent } from './Components/ConfigureSystem/configure-system.component';
import { LineChartComponent } from './Components/Chart/chart.component';
import { SystemTabComponent } from './Components/System_Tab/system-tab.component';
import { ErrorComponent } from './Components/Error_Page/error-page.component';
import { DashboardComponent } from './Components/Dashboard/dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {NgxPaginationModule} from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TimeAgoPipe} from 'time-ago-pipe';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material';
import { Router } from '@angular/router';
import { SystemComponent } from './Components/System/system.component';
import { ChartsModule } from 'ng2-charts';
import { RegisterComponent } from './Components/Register/register.component';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TimeAgoPipe,
    ErrorComponent,
    SystemTabComponent,
    SystemComponent,
    LineChartComponent,
    ConfigureSystemComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule, 
    NgxPaginationModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    ChartsModule,
    NotifierModule.withConfig( {
      position: {
        horizontal: {
          position: 'middle',
          distance: 12      
        },      
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10       
        }      
      },
      behaviour: {
        autoHide: false,
        onClick: 'hide',
        onMouseover: false,
        showDismissButton: false,
        stacking: 3
      }

    } )
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // )
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [CookieService],
  bootstrap: [
    AppComponent
    ]
})
export class AppModule { }
