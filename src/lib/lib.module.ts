import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangeComponent } from './lib.component';
import { CalendarDailyComponent } from './resources/components/calendar-daily/calendar-daily.component';
import { CalendarMonthlyComponent } from './resources/components/calendar-monthly/calendar-monthly.component';
import { CalendarYearlyComponent } from './resources/components/calendar-yearly/calendar-yearly.component';
import { DataInterface } from './core/interfaces/DataInterface';

export function HttpLoaderFactory(http: HttpClient) {
}

@NgModule({
  declarations: [
    DateRangeComponent,
    CalendarDailyComponent,
    CalendarMonthlyComponent,
    CalendarYearlyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [DateRangeComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }],
})
export class DateRangePickerModule {}
export { DataInterface };
