import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { calendarType } from "../../../core/interfaces/DataInterface";
import { isBefore, splitDate } from "../../../shared/utils/formatDate";
import { isInvalid } from "../../utils/detectDateFormats";
import { DateService } from "../../../core/services/date.service";
import { FormControlInterface } from "../../../core/interfaces/FormControlInterface";

@Component({
  selector: "calendar-month",
  template: `
    <div
      [ngClass]="{
        'month-containers show': isMonthly,
        'month-container': !isMonthly
      }"
    >
      <div
        class="d-flex align-items-center justify-content-between w-100 event-hover"
      >
        <span
          class="year-change font-weight-600 font-size-25 text-color"
          id="prev-year"
          (click)="handleCalendarBuildForm('prevYear')"
        >
          <div><</div>
        </span>
        <div
          class="year-picker month-picker calendar-header"
          id="year-picker"
          (click)="eventYearClick()"
        >
          {{ f.year.value }}
        </div>

        <span
          class="year-change font-weight-600 font-size-25 text-color"
          id="next-pagination"
          (click)="handleCalendarBuildForm('nextYear')"
        >
          <div>></div>
        </span>
      </div>
      <div class="month-list">
        <div
          class="month-element"
          *ngFor="let item of monthNames; let i = index"
          [ngClass]="handleMonthClass(i)"
          (click)="eventMonthClick(i)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CalendarMonthComponent implements OnInit {
  @Output() pagination: EventEmitter<string> = new EventEmitter<any>();
  @Output() yearClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() monthClick: EventEmitter<number> = new EventEmitter<any>();
  @Input() row: calendarType;
  @Input() f: FormControlInterface;
  @Input() monthNames: string[];
  constructor(private date: DateService) {}

  ngOnInit(): void {}

  handleCalendarBuildForm(type: string) {
    if (!isInvalid(type)) return;
    this.pagination.emit(type);
  }

  eventMonthClick(index: number) {
    this.monthClick.emit(index);
  }

  eventYearClick() {
    this.yearClick.emit(true);
  }

  handleMonthClass(month: number): any {
    const { dateRange, monthIndex, year } = this.f;
    const innerMonth = month + 1;
    const { maxDate, minDate } = this.row;

    const checkDate = (date: Date, condition: Function, isMin: boolean) => {
      const checkDate = new Date(year.value, innerMonth, 1);
      return isMin ? condition(checkDate, date) : condition(date, checkDate);
    };

    if (maxDate && checkDate(maxDate, isBefore, false)) return "isDisabled";
    if (minDate && checkDate(minDate, isBefore, true)) return "isDisabled";
    if (!dateRange.value) return "";

    return {
      month: () => {
        const [firstDate, secondDate] = dateRange.value.split(" - ");
        const [firstDateMonth, firstDateYear] = splitDate(firstDate, this.row);

        if (!firstDateMonth || !firstDateYear) return "";

        const isTheSameMonth = Number(firstDateMonth) == innerMonth;
        const isTheSameYear = Number(firstDateYear) == this.calendarHeaderYear;
        const isTheSameDate = isTheSameMonth && isTheSameYear;

        if (isTheSameDate) return "selected";
        if (!secondDate) return "";

        const [secondDateMonth, secondDateYear] = splitDate(
          secondDate,
          this.row
        );

        if (!secondDateMonth || !secondDateYear) return "";
        const isTheSameMonthSecondDate = Number(secondDateMonth) == innerMonth;
        const isTheSameYearSecondDate =
          Number(secondDateYear) === this.calendarHeaderYear;
        const isTheSameDateSecondDate =
          isTheSameMonthSecondDate && isTheSameYearSecondDate;

        if (secondDate && isTheSameDateSecondDate) return "selected";

        const parseDayInnerText = this.date.transformPipeInDate(
          1,
          monthIndex.value - 1,
          this.calendarHeaderYear
        );

        if (!parseDayInnerText) return "";

        if (!isTheSameYear && !isTheSameYearSecondDate) return "";

        const isTheSameYears = isTheSameYear && isTheSameYearSecondDate;
        const isWithinTheRange = (
          month: any,
          compare: any,
          isBigger: boolean
        ) =>
          isBigger
            ? Number(month) >= Number(compare)
            : Number(month) <= Number(compare);

        if (isTheSameYears)
          return isWithinTheRange(innerMonth, firstDateMonth, true) &&
            isWithinTheRange(innerMonth, secondDateMonth, false)
            ? "interval"
            : "";
        if (isTheSameYear)
          return isWithinTheRange(innerMonth, firstDateMonth, true)
            ? "interval"
            : "";
        if (isTheSameYearSecondDate)
          return isWithinTheRange(innerMonth, secondDateMonth, false)
            ? "interval"
            : "";

        return "";
      },
      year: () => {
        return "";
      },
      day: () => {
        return "";
      },
    }[this.row.type]();
  }

  get calendarHeaderYear(): number {
    if (!this.calendarHeader) return 0;
    return Number(this.calendarHeader.innerHTML);
  }

  get calendarHeader(): HTMLElement {
    return this.calendar.querySelector("#year-picker");
  }

  get calendar(): any {
    return document.querySelector(".calendar");
  }

  get isMonthly() {
    return this.row.type == "month";
  }
}
