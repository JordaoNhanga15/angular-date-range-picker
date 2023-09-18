import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  DoCheck,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  PaginationEnum,
  PaginationYearEnum,
} from "../../../shared/models/strategy.model";
import { DateContract } from "../../../core/contracts/index";
import { DateService } from "../../../core/services/date.service";
import { DataInterface } from "../../../core/interfaces/DataInterface";
import { FormControlInterface } from "../../../core/interfaces/FormControlInterface";
import { MessagesInterface } from "../../../core/interfaces/MessagesInterface";
import {
  formatDate,
  transformPipeInDate,
  splitDate,
  isBefore,
} from "../../../shared/utils/formatDate";

@Component({
  selector: "lib-calendar-daily [row] [format]",
  // templateUrl: "./calendar-daily.component.html",
  template: `
    <div class="calendar-complete" id="calendar-cmp">
      <div class="calendar-header" [formGroup]="formHeader">
        <span
          class="month-picker"
          id="month-picker"
          (click)="eventMonthClick()"
          >{{ month }}</span
        >
        <div class="year-picker">
          <span
            class="year-change"
            id="prev-year"
            (click)="handleCalendarBuildForm('prevYear')"
          >
            <div><</div>
          </span>
          <span id="year" class="year-value">{{ f.year.value }}</span>
          <span
            class="year-change"
            id="next-year"
            (click)="handleCalendarBuildForm('nextYear')"
          >
            <div>></div>
          </span>
        </div>
      </div>

      <div class="calendar-body">
        <div class="calendar-week-day">
          <div *ngFor="let day of daysOfWeek">{{ day }}</div>
        </div>
        <div class="calendar-days"></div>
      </div>
    </div>
    <div class="month-container">
      <div class="d-flex align-items-center justify-content-between w-100 event-hover">
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
          (click)="handleMonthClick(i)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div class="year-container">
      <div class="year-pickers calendar-header">
        <span
          class="year-change"
          id="prev-pagination"
          (click)="handleCalendarYearBuildForm('prevPagination')"
        >
          <div><</div>
        </span>
        <span id="year-array">2021 - 2028</span>
        <span
          class="year-change"
          id="next-pagination"
          (click)="handleCalendarYearBuildForm('nextPagination')"
        >
          <div>></div>
        </span>
      </div>
      <div class="year-list"></div>
    </div>

    <div
      class="calendar-footer"
      [ngClass]="{ 'justify-content-end': !dateRangeValue }"
    >
      <button
        (click)="clearForm()"
        class="trash-link-button"
        *ngIf="dateRangeValue"
      >
        <span class="fa fa-trash"></span>
      </button>
      <div
        class="toggle"
        (click)="handleDarkMode()"
        *ngIf="row.containDarkMode"
      >
        <span>{{ messages.dark }}</span>
        <div class="dark-mode-switch">
          <div class="dark-mode-switch-ident"></div>
        </div>
      </div>
    </div>
  `,
  // styleUrls: ["./calendar-daily.component.css"],
  styles: [
    `
      .calendar {
        height: max-content !important;
        width: max-content !important;
        background-color: var(--bg-main) !important;
        /* position: absolute !important; */
        z-index: 999 !important;
        overflow: hidden !important;
        display: none !important;
        width: 100% !important;
        max-width: -moz-available !important;
        /* transform: scale(1.25); */
      }

      .calendar.show {
        display: block !important;
      }

      .light .calendar {
        box-shadow: var(--shadow) !important;
      }

      .calendar-header {
        display: flex !important;
        justify-content: space-between !important;
        justify-items: center !important;
        align-items: center !important;
        font-size: 25px !important;
        font-weight: 600 !important;
        color: var(--color-txt) !important;
        padding: 10px !important;
      }

      .calendar-body {
        padding: 10px !important;
      }

      .calendar-week-day {
        height: 50px !important;
        display: grid !important;
        grid-template-columns: repeat(7, 1fr) !important;
        font-weight: 600 !important;
      }

      .calendar-week-day div {
        display: grid !important;
        place-items: center !important;
        color: var(--bg-second) !important;
      }

      .calendar-days {
        display: grid !important;
        grid-template-columns: repeat(7, 1fr) !important;
        gap: 2px !important;
        color: var(--color-txt) !important;
        text-align: center !important;
      }

      /deep/ .calendar-days div.curr-date {
        outline: 0 !important;
        color: var(--c-theme-primary) !important;
        border: 2px solid var(--c-theme-primary-accent) !important;
      }

      /deep/ .calendar-days div.curr-date:hover,
      .calendar-days div.curr-date:focus {
        background-color: var(--c-theme-primary-accent) !important;
      }

      /deep/ div.calendar-day-hover:hover {
        background-color: var(--c-theme-primary-accent) !important;
      }

      /deep/ .calendar-days div.curr-date span {
        display: none !important;
      }

      /deep/ .month-picker {
        padding: 5px 20px !important;
        border-radius: 10px !important;
        cursor: pointer !important;
      }

      /deep/ .month-element {
        border-radius: 10px !important;
      }

      /deep/ .month-picker:hover,
      .month-element:hover {
        background-color: var(--color-hover) !important;
      }

      .year-picker {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .year-change {
        width: 40px !important;
        max-height: 40px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        place-items: center !important;
        margin: 0 10px !important;
        cursor: pointer !important;
        transition: all 0.2s ease-in-out !important;
      }

      .year-change:hover {
        box-shadow: var(--shadow) !important;
        background-color: var(--color-hover) !important;
      }

      .month-container {
        display: none !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        position: relative !important;
        flex-direction: column !important;
        width: 100% !important;
        transform: scale(1.5) !important;
        pointer-events: none !important;
        // position: absolute !important;
        width: 100% !important;
        height: 100% !important;
        visibility: hidden !important;
        // top: 0 !important;
        // left: 0 !important;
        // background-color: var(--bg-main) !important;
        padding: 15px !important;
      }

      .year-container {
        display: none !important;
        justify-content: flex-start !important;
        position: relative !important;
        flex-direction: column !important;
        width: 100% !important;
        transform: scale(1.5) !important;
        visibility: hidden !important;
        pointer-events: none !important;
        // position: absolute !important;
        width: 100% !important;
        height: 100% !important;
        // top: 0 !important;
        // left: 0 !important;
        // background-color: var(--bg-main) !important;
        padding-top: 20px !important;
        padding-bottom: 20px !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
        align-items: center !important;
        transition: all 0.2s ease-in-out !important;
      }

      .year-container.show {
        display: flex !important;
        transform: scale(1) !important;
        visibility: visible !important;
        pointer-events: visible !important;
        transition: all 0.2s ease-in-out !important;
      }

      /deep/ .year-list {
        width: 100% !important;
        align-items: center !important;
        justify-content: space-between !important;
        justify-items: center !important;
        background-color: var(--bg-main) !important;
        // padding: 20px !important;
        grid-template-columns: 1fr 1fr 1fr 1fr !important;
        // gap: 10px 30px !important;
        display: grid !important;
        // margin-right: 17px !important;
      }

      /deep/ .year-list div {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        color: var(--color-txt) !important;
        height: 60px !important;
        cursor: pointer !important;
        font-size: 1.5rem !important;
      }

      /deep/ .year-list div:hover {
        background-color: var(--color-hover) !important;
        border-radius: 10px !important;
        transition: all 0.2s ease-in-out !important;
        cursor: pointer !important;
      }

      /deep/ .year-picker {
        padding: 5px 10px !important;
        // margin-left: 20px !important;
        border-radius: 10px !important;
        cursor: pointer !important;
      }

      /deep/ .year-pickers {
        border-radius: 10px !important;
        cursor: pointer !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
        transition: all 0.2s ease-in-out !important;
      }

      /deep/ .year-picker:hover {
        transition: all 0.2s ease-in-out !important;
        background-color: var(--color-hover) !important;
      }

      .month-container.show {
        display: flex !important;
        transform: scale(1) !important;
        visibility: visible !important;
        pointer-events: visible !important;
        transition: all 0.2s ease-in-out !important;
      }

      .month-list {
        /* position: absolute; */
        height: 100% !important;
        /* top: 0; */
        /* left: 0; */
        background-color: var(--bg-main) !important;
        padding: 20px !important;
        grid-template-columns: repeat(3, auto) !important;
        gap: 10px !important;
        display: grid !important;
        /* // font-size: 1rem; */
        width: 100% !important;
        /* transform: scale(1.5);
      visibility: hidden;
      pointer-events: none; */
      }

      .month-list.show {
        transform: scale(1) !important;
        visibility: visible !important;
        pointer-events: visible !important;
        transition: all 0.2s ease-in-out !important;
      }

      .month-list > div {
        display: grid !important;
        place-items: center !important;
      }

      .month-list > div > div {
        width: 100% !important;
        padding: 5px 20px !important;
        border-radius: 10px !important;
        text-align: center !important;
        cursor: pointer !important;
        color: var(--color-txt) !important;
      }

      .month-list > div > div:hover {
        background-color: var(--color-hover) !important;
      }

      .month-list .month-element {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        color: var(--color-txt) !important;
        height: 60px !important;
        cursor: pointer !important;
        font-size: 1.5rem !important;
      }

      .year-list .year-element {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        color: var(--color-txt) !important;
        height: 60px !important;
        cursor: pointer !important;
        font-size: 1.5rem !important;
      }

      .justify-content-end {
        justify-content: flex-end !important;
      }

      .twitter::before {
        content: "\f099";
      }

      /* Regular Icon */
      .user::before {
        content: "\f007";
      }

      .calendarr::before {
        content: "\f073";
      }

      @keyframes to-top {
        0% {
          transform: translateY(100%) !important;
          opacity: 0 !important;
        }
        100% {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }
      }

      /deep/ .calendar-day-hover {
        height: 50px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 5px !important;
        position: relative !important;
        cursor: pointer !important;
      }
    `,
  ],
})
export class CalendarDailyComponent implements OnInit, DoCheck {
  formHeader: FormGroup;
  @Input() row: DataInterface;
  @Input() format: string;
  @Input() messages: MessagesInterface;
  @Input() formControl: FormControl;
  @Output() dateRange: EventEmitter<{
    dateRange: Date;
  }> = new EventEmitter();
  dateContract: DateContract;
  private months: number[] = Array.from({ length: 12 }).fill(0) as number[];
  monthNames: string[] = [];
  daysOfWeek: string[] = [];

  constructor(private fb: FormBuilder, private dateService: DateService) {}

  protected buildForm(): void {
    this.formHeader = this.fb.group({
      year: [this.currentDate.getFullYear(), Validators.required],
      containDarkMode: [false, Validators.required],
      month: [
        this.cappitalizeFirstLetter(
          this.currentDate.toLocaleString(this.row.locale, { month: "long" })
        ),
        Validators.required,
      ],
      monthIndex: [this.currentDate.getMonth() + 1, Validators.required],
      dateRange: [null, Validators.required],
      firstDate: [null, Validators.required],
      secondDate: [null, Validators.required],
    });
  }

  private dayOfMonths = (year: number) => {
    return [31, this.getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  };

  cappitalizeFirstLetter(string: string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  protected get currentDate(): Date {
    return new Date();
  }

  get f(): FormControlInterface {
    return this.formHeader.controls as FormControlInterface;
  }

  private isLeapYear = (year: number) => {
    if (!year) return new Date().getFullYear();

    return (
      (year % 4 == 0 && year % 100 !== 0 && year % 400 !== 0) ||
      (year % 100 == 0 && year % 400 === 0)
    );
  };

  handleDarkMode() {
    this.f.containDarkMode.setValue(!!this.f.containDarkMode.value);

    const aside = document.querySelector("aside") as HTMLElement;

    if (!aside) return;

    const contain = aside.classList.contains("dark");

    switch (contain) {
      case true:
        aside.classList.remove("dark");
        aside.classList.add("light");
        break;
      case false:
        aside.classList.remove("light");
        aside.classList.add("dark");
        break;
    }
  }

  handleCalendarBuildForm(type: string): any {
    if (!type) return;

    return {
      prevYear: () => {
        const year = this.formHeader.controls.year.value - 1;
        this.formHeader.controls.year.setValue(year);
        this.generateCalendar(this.formHeader.controls.month.value, year);
      },
      nextYear: () => {
        const year = this.formHeader.controls.year.value + 1;
        this.formHeader.controls.year.setValue(year);
        this.generateCalendar(this.formHeader.controls.month.value, year);
      },
    }[type as keyof PaginationYearEnum]();
  }

  get calendarHeaderYear(): number {
    return Number(this.calendarHeader.innerHTML);
  }

  get calendarHeader(): HTMLElement {
    return this.calendar.querySelector("#year");
  }

  private getFebDays = (year: number) => {
    return this.isLeapYear(year) ? 29 : 28;
  };

  protected generateCalendar(month: number, year: number) {
    let calendar_days = this.calendar.querySelector(".calendar-days");
    let calendar_header_year = this.calendarHeader;
    calendar_days.innerHTML = "";

    if ((!month && ![0, "0"].includes(month)) || typeof month == "string")
      month = this.currentDate.getMonth();

    if (!year) year = this.currentDate.getFullYear();

    calendar_header_year.innerHTML = year.toString();

    let first_day = new Date(year, month, 1);

    let days_of_month = this.dayOfMonths(year);

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {

      let day = document.createElement("div") as any;
      const isLessThanFirstDay = i - first_day.getDay() + 1;
      const isBiggerThanFirstDay = i >= first_day.getDay();

      const isCurrentDate =
        i - first_day.getDay() + 1 == this.currentDate.getDate() &&
        year == this.currentDate.getFullYear() &&
        month == this.currentDate.getMonth();

      if (isBiggerThanFirstDay) {
        day.classList.add("calendar-day-hover");
        day.classList.add("bundle");
        day.innerHTML = isLessThanFirstDay;
        day.innerHTML += `<span></span>
                          <span></span>
                          <span></span>
                          <span></span>`;

        if (isCurrentDate) {
          day.classList.add("curr-date");
        }
      }

      const containClassInDay = this.handleDayClass(day);

      if (containClassInDay && isLessThanFirstDay > 0) {
        day.classList.add(containClassInDay);
      }

      day.addEventListener("click", (ele: Event) =>
        this.eventDayClick(ele.target as HTMLDivElement)
      );

      calendar_days.appendChild(day);
    }
  }

  private resetControls() {
    this.f.firstDate.setValue(null);
    this.f.secondDate.setValue(null);
    this.f.dateRange.setValue(null);
  }

  handleDayClass(day: HTMLDivElement): string {
    if (!day) return "";

    const { dateRange, monthIndex, year } = this.f;

    const innerText = Number(day.innerText);

    const { maxDate, minDate } = this.row;

    if (maxDate || minDate) {
      const dateBefore = new Date(year.value, monthIndex.value - 1, innerText);

      const isBeforeMinDate = isBefore(dateBefore, minDate);

      const dateAfter = new Date(year.value, monthIndex.value - 1, innerText);

      const isAfterMaxDate = isBefore(maxDate, dateAfter);

      if (isBeforeMinDate || isAfterMaxDate) return "isDisabled";
    }

    if (!dateRange.value) return "";

    const value = dateRange.value as String;

    const [firstDate, secondDate] = value.split(" - ");

    const [firstDateMonth, firstDateDay, firstDateYear] = splitDate(
      firstDate,
      this.row
    );

    if (!firstDateMonth || !firstDateDay || !firstDateYear) return "";

    const isTheSameMonth = Number(firstDateMonth) === monthIndex.value;

    const isTheSameYear = Number(firstDateYear) === this.calendarHeaderYear;

    const isTheSameDate =
      isTheSameMonth &&
      isTheSameYear &&
      Number(innerText) === Number(firstDateDay);

    if (isTheSameDate) return "selected";

    if (!secondDate) return "";

    const [secondDateMonth, secondDateDay, secondDateYear] = splitDate(
      secondDate,
      this.row
    );

    if (!secondDateMonth || !secondDateDay || !secondDateYear) return "";

    const isTheSameMonthSecondDate =
      Number(secondDateMonth) == monthIndex.value;

    const isTheSameYearSecondDate =
      Number(secondDateYear) == this.calendarHeaderYear;

    const isTheSameDateSecondDate =
      isTheSameMonthSecondDate &&
      isTheSameYearSecondDate &&
      Number(innerText) == Number(secondDateDay);

    if (secondDate && isTheSameDateSecondDate) return "selected";

    const parseFirstDate = transformPipeInDate(
      Number(firstDateDay),
      Number(firstDateMonth) - 1,
      Number(firstDateYear)
    );

    const parseSecondDate = transformPipeInDate(
      Number(secondDateDay),
      Number(secondDateMonth) - 1,
      Number(secondDateYear)
    );

    const parseDayInnerText = transformPipeInDate(
      Number(innerText),
      monthIndex.value - 1,
      this.calendarHeaderYear
    );

    if (!parseDayInnerText) return "";

    const isWithinTheRange =
      parseDayInnerText.getTime() > parseFirstDate.getTime() &&
      parseDayInnerText.getTime() < parseSecondDate.getTime();

    if (isWithinTheRange) return "interval";

    return "";
  }

  eventDayClick(element: HTMLDivElement) {
    if (!element || !element.innerText) return;

    const calendarDays = this.calendarDays;

    if (this.f.firstDate.value && this.f.secondDate.value) {
      this.resetControls();
      calendarDays.forEach((day: HTMLDivElement) => {
        day.classList.remove("selected");
      });
    }

    this.dateContract.compile(
      {
        year: this.f.year.value,
        month: this.f.monthIndex.value,
        day: element,
      },
      this.f
    );

    const containFirstDate =
      this.f.firstDate && this.f.firstDate.value ? true : false;

    const { monthIndex, year } = this.f;

    if (!monthIndex.value) monthIndex.setValue(this.currentDate.getMonth() + 1);

    if (!year.value) year.setValue(this.currentDate.getFullYear());

    const date = new Date(
      this.f.year.value,
      this.f.monthIndex.value - 1,
      element.innerText as any
    );

    switch (containFirstDate) {
      case true:
        const isBeforeSecondDate = isBefore(date, this.f.firstDate.value);

        if (!isBeforeSecondDate) {
          this.f.secondDate.setValue(date);
        }
        break;
      case false:
        this.f.firstDate.setValue(date);
        break;
    }

    const firstDate = formatDate(this.f.firstDate.value, (d) =>
      this.dateFormater(d)
    );

    const secondDate = formatDate(this.f.secondDate.value, (d) =>
      this.dateFormater(d)
    );

    this.f.dateRange.setValue(
      `${firstDate} ${secondDate ? `- ${secondDate}` : ""}`
    );

    return this.dateRange.emit(this.f.dateRange.value);
  }

  eventMonthClick() {
    const monthContainer = this.monthElement.classList.contains("show");
    const yearContainer = this.yearElement;

    const calendarComplete = this.calendar.querySelector(
      ".calendar-complete"
    ) as HTMLElement;

    switch (monthContainer) {
      case true:
        yearContainer.style.display = "none";
        calendarComplete.style.display = "block";
        this.monthElement.style.display = "none";
        this.monthElement.classList.remove("show");
        break;
      case false:
        yearContainer.style.display = "none";
        calendarComplete.style.display = "none";
        this.monthElement.style.display = "flex";
        this.monthElement.classList.add("show");
        break;
    }
  }

  generateCalendarYearly() {
    const { year } = this.f;

    let yearList = this.calendar.querySelector(".year-list");

    yearList.innerHTML = "";

    if (!yearList) return;

    let yearsAbove = this.years.slice(
      Math.max(0, year.value - 19),
      year.value + 1
    );

    this.calendar.querySelector("#year-array").innerHTML =
      yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

    yearsAbove.forEach((e, index) => {
      let year = document.createElement("div");
      year.innerHTML = `<div data-year="${e}" class="year-element">${e}</div>`;

      yearList.appendChild(year);
    });

    this.calendar
      .querySelectorAll(".year-element")
      .forEach((element: HTMLDivElement) => {
        element.addEventListener("click", (ele: Event) =>
          this.handleYearClick(ele.target as HTMLDivElement)
        );
      });
  }

  handleCalendarYearBuildForm(type: string) {
    if (!type) return;

    return {
      prevPagination: () => {
        let y = this.calendar
          .querySelector("#year-array")
          .innerHTML.split(" - ")[0];

        if (y == 0) return;

        if (!y) y = new Date().getFullYear();

        let yearList = this.calendar.querySelector(".year-list");

        let yearsAbove = this.years.slice(Math.max(0, y - 20), y);

        yearList.innerHTML = "";

        this.calendar.querySelector("#year-array").innerHTML =
          yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

        yearsAbove.forEach((e, index) => {
          let year = document.createElement("div");
          year.innerHTML = `<div data-year="${e}" class="year-element">${e}</div>`;

          yearList.appendChild(year);
        });

        this.calendar
          .querySelectorAll(".year-element")
          .forEach((element: HTMLDivElement) => {
            element.addEventListener("click", (ele: Event) =>
              this.handleYearClick(ele.target as HTMLDivElement)
            );
          });
      },
      nextPagination: () => {
        let y = this.calendar
          .querySelector("#year-array")
          .innerHTML.split(" - ")[1];

        if (!y) y = new Date().getFullYear();

        let yearList = this.calendar.querySelector(".year-list");

        let yearsAbove = this.years.slice(Number(y) + 1, Number(y) + 21);

        yearList.innerHTML = "";

        this.calendar.querySelector("#year-array").innerHTML =
          yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

        yearsAbove.forEach((e, index) => {
          let year = document.createElement("div");
          year.innerHTML = `<div data-year="${e}" class="year-element">${e}</div>`;

          yearList.appendChild(year);
        });

        this.calendar
          .querySelectorAll(".year-element")
          .forEach((element: HTMLDivElement) => {
            element.addEventListener("click", (ele: Event) =>
              this.handleYearClick(ele.target as HTMLDivElement)
            );
          });
      },
    }[type as keyof PaginationEnum]();
  }

  resetClassList() {
    this.calendar.querySelector(".year-list").innerHTML = "";
    this.calendar.querySelector(".calendar-days").innerHTML = "";
  }

  handleYearClick(element: HTMLDivElement) {
    if (!element) return;

    const { year } = this.f;

    year.setValue(Number(element.dataset.year));

    this.yearElement.classList.remove("show");
    this.monthElement.classList.add("show");
    this.monthElement.style.display = "flex !important";

    this.calendar.querySelector(".year-list").innerHTML = "";
  }

  handleMonthClick(element: number) {
    const calendarComplete = this.calendar.querySelector(
      ".calendar-complete"
    ) as HTMLElement;

    const { monthIndex, year, month } = this.f;

    monthIndex.setValue(Number(element) + 1);

    this.monthElement.classList.remove("show");
    calendarComplete.style.display = "block";

    this.generateCalendar(monthIndex.value - 1, year.value);
  }

  get month(): string | string[] {
    if (!this.f.monthIndex) return this.monthNames[this.currentDate.getMonth()];

    return this.monthNames[this.f.monthIndex.value - 1];
  }

  eventYearClick() {
    const containClass = this.yearElement.classList.contains("show");

    switch (containClass) {
      case true:
        this.monthElement.style.display = "flex";
        this.monthElement.classList.add("show");
        this.yearElement.classList.remove("show");
        break;
      case false:
        this.monthElement.style.display = "none";
        this.monthElement.classList.remove("show");
        this.yearElement.classList.add("show");
        this.generateCalendarYearly();
        break;
    }
  }

  protected get calendar(): any {
    return document.querySelector(".calendar");
  }

  protected get calendarDays(): any {
    return document.querySelectorAll(".calendar-days .bundle");
  }

  protected get monthElement(): HTMLElement {
    return document.querySelector(".month-container") as HTMLElement;
  }

  protected get yearElement(): any {
    return document.querySelector(".year-container");
  }

  protected get years() {
    return Array.from(
      new Array(this.currentDate.getFullYear() + 80),
      (val, index) => index
    );
  }

  dateFormater(date: Date): string {
    if (!date) return "";

    return date.toLocaleDateString(this.row.locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.generateCalendar(
      this.currentDate.getMonth(),
      this.currentDate.getFullYear()
    );
    this.dateContract = new DateContract(this.row);
  }

  ngDoCheck(): void {
    this.customMonths();
    this.customDaysOfWeek();
  }

  customMonths() {
    if (this.row.locale) {
      this.monthNames = this.months.map((_, index) => {
        const date = new Date(this.currentDate.getFullYear(), index, 1);
        const month = date.toLocaleDateString(this.row.locale, {
          month: "long",
        });
        return this.cappitalizeFirstLetter(month);
      });
    }
  }

  clearForm() {
    this.resetControls();
    this.resetClassList();
    this.generateCalendar(
      this.currentDate.getMonth(),
      this.currentDate.getFullYear()
    );
    this.dateRange.emit(this.f.dateRange.value);
  }

  get dateRangeValue(): boolean {
    return !!this.f.dateRange.value;
  }

  customDaysOfWeek() {
    if (this.row.locale) {
      this.daysOfWeek = [] as string[];

      const date = new Date();

      for (const _ of new Array(7).fill(0)) {
        this.daysOfWeek.push(
          date.toLocaleDateString(this.row.locale, { weekday: "narrow" })
        );
        date.setDate(date.getDate() + 1);
      }
    }
  }
}
