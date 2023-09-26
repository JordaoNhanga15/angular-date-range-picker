import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarFooterComponent } from "./calendar-footer/calendar-footer.component";

@NgModule({
  declarations: [CalendarFooterComponent],
  imports: [CommonModule],
  exports: [CalendarFooterComponent],
})
export class SharedModule {}
