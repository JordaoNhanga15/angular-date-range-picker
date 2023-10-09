import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { calendarType } from "../../../core/interfaces/DataInterface";

@Component({
  selector: "calendar-year",
  template: `
    <div class="year-container" [ngClass]="{ show: isYearly }">
      <div class="year-pickers calendar-header">
        <span
          class="year-change"
          id="prev-pagination"
          (click)="handleCalendarNormalize('prevPagination')"
        >
          <div><</div>
        </span>
        <span id="year-array">2021 - 2028</span>
        <span
          class="year-change"
          id="next-pagination"
          (click)="handleCalendarNormalize('nextPagination')"
        >
          <div>></div>
        </span>
      </div>
      <div class="year-list"></div>
    </div>
  `,
  styles: [],
})
export class CalendarYearComponent implements OnInit {
  @Output() click: EventEmitter<string> = new EventEmitter<any>();
  @Input() row: calendarType;
  constructor() {}

  ngOnInit(): void {}

  handleCalendarNormalize(type: string) {
    this.click.emit(type);
  }

  get isYearly() {
    return this.row.type == "year";
  }
}
