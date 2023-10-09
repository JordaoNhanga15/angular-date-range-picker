import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarFooterComponent } from "./calendar-footer/calendar-footer.component";
import { CalendarYearComponent } from "./calendar-year/calendar-year.component";
import { CalendarMonthComponent } from './calendar-month/calendar-month.component';

@NgModule({
  declarations: [CalendarFooterComponent, CalendarYearComponent, CalendarMonthComponent],
  imports: [CommonModule],
  exports: [CalendarFooterComponent, CalendarYearComponent, CalendarMonthComponent],
})
export class SharedModule {}
