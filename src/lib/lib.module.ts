import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangeComponent } from './lib.component';
import { CalendarDailyComponent } from './resources/components/calendar-daily/calendar-daily.component';
import { CalendarMonthlyComponent } from './resources/components/calendar-monthly/calendar-monthly.component';
import { CalendarYearlyComponent } from './resources/components/calendar-yearly/calendar-yearly.component';
import { calendarType } from './core/interfaces/DataInterface';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/components/shared.module';

@NgModule({
  declarations: [
    DateRangeComponent,
    CalendarDailyComponent,
    CalendarMonthlyComponent,
    CalendarYearlyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  exports: [DateRangeComponent],
})
export class DateRangePickerModule {}
export { calendarType };
