import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  DoCheck,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DateContract } from "../../../core/contracts/index";
import {
  calendarType,
  Day,
  Year,
} from "../../../core/interfaces/DataInterface";
import { FormControlInterface } from "../../../core/interfaces/FormControlInterface";
import { MessagesInterface } from "../../../core/interfaces/MessagesInterface";
import {
  formatDate,
  transformPipeInDate,
  splitDate,
  isBefore,
  handleCalendarMonthBuildForm,
  handleCalendarYearBuildForm,
} from "../../../shared/utils/formatDate";

@Component({
  selector: "lib-calendar-daily [row] [format]",
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
        <div class="calendar-days">
          <div
            *ngFor="let day of days"
            (click)="eventDayClick($event)"
            [ngClass]="[
              day.class,
              day.isToday ? 'curr-date' : '',
              day.classIsBiggerThanFirstDay
            ]"
          >
            {{ day.value }}
          </div>
        </div>
      </div>
    </div>

    <calendar-month
      [row]="row"
      [f]="f"
      [monthNames]="monthNames"
      (pagination)="pagination($event)"
      (monthClick)="handleMonthClick($event)"
      (yearClick)="eventYearClick()"
    ></calendar-month>

    <calendar-year
      (click)="eventYear($event)"
      [row]="row"
      [years]="yearsDiv"
      [yearClick]="handleYearClick"
    ></calendar-year>

    <calendar-footer
      [messages]="messages"
      [dateRangeValue]="dateRangeValue"
      [isDarkMode]="row.containDarkMode"
      (clear)="clearForm()"
      (darkMode)="handleDarkMode()"
    ></calendar-footer>
  `,
  styles: [
    `
      @import url("https://cdn.jsdelivr.net/gh/JordaoNhanga15/CDN-for-Assets@main/style.css");

      /deep/ .year-container {
        display: none !important;
      }

      @media screen and (max-width: 420px) {
        /deep/ .year-picker {
          display: none !important;
        }
      }
    `,
  ],
})
export class CalendarDailyComponent implements OnInit, DoCheck {
  formHeader: FormGroup;
  @Input() row: calendarType;
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
  days: Day[] = [];
  yearsDiv: Year[] = [];

  constructor(private fb: FormBuilder) {
    this.handleCalendarNormalize = this.handleCalendarNormalize.bind(this);
    this.handleYearClick = this.handleYearClick.bind(this);
    this.handleCalendarMonth = this.handleCalendarMonth.bind(this);
  }

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

    handleCalendarMonthBuildForm(type, this.handleCalendarMonth);
  }

  pagination(type: string) {
    this.handleCalendarBuildForm(type);
  }

  handleCalendarMonth(type: string) {
    if (!type) return;

    const operationArithmetic = type == "prevYear" ? -1 : +1;

    const year = this.formHeader.controls.year.value + operationArithmetic;
    this.formHeader.controls.year.setValue(year);
    this.generateCalendar(this.formHeader.controls.monthIndex.value - 1, year);
  }

  eventYear(event: string) {
    if (!event) return;

    if ("string" !== typeof event) return;

    this.handleCalendarNormalize(
      event,
      this.handleYearClick,
      this.years,
      this.calendar
    );
  }

  handleCalendarNormalize(
    type: string,
    yearClick: Function,
    years: number[],
    calendar: HTMLElement
  ) {
    handleCalendarYearBuildForm(
      type,
      yearClick,
      years,
      calendar,
      this.f,
      this.row
    );
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
    this.days = [];
    const calendar_header_year = this.calendarHeader;

    if ((!month && ![0, "0"].includes(month)) || typeof month === "string") {
      month = this.currentDate.getMonth();
    }

    if (!year) {
      year = this.currentDate.getFullYear();
    }

    calendar_header_year.innerHTML = year.toString();

    const first_day = new Date(year, month, 1);
    const days_of_month = this.dayOfMonths(year);

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
      // let day = document.createElement("div") as any;
      const isLessThanFirstDay = i - first_day.getDay() + 1;
      const isBiggerThanFirstDay = i >= first_day.getDay();

      const currentDate = this.currentDate;
      const isCurrentDate =
        isLessThanFirstDay === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth();

      if (isBiggerThanFirstDay) {
        // day.textContent = isLessThanFirstDay;
      }

      if (isLessThanFirstDay <= 0) {
        continue;
      }

      const containClassInDay = this.handleDayClass(isLessThanFirstDay);

      const dayValue = isLessThanFirstDay;
      const dayClass =
        containClassInDay && isLessThanFirstDay > 0 ? containClassInDay : "";
      const isToday = isCurrentDate;
      const classIsBiggerThanFirstDay = isBiggerThanFirstDay
        ? "bundle calendar-day-hover"
        : "";

      this.days.push({
        value: dayValue,
        class: dayClass,
        isToday,
        classIsBiggerThanFirstDay,
      } as Day);
    }
  }

  private resetControls() {
    this.f.firstDate.setValue(null);
    this.f.secondDate.setValue(null);
    this.f.dateRange.setValue(null);
  }

  handleDayClass(day: Number): string {
    if (!day) return "";

    const { dateRange, monthIndex, year } = this.f;

    const innerText = Number(day);

    const { maxDate, minDate } = this.row;

    if (maxDate) {
      const dateAfter = new Date(year.value, monthIndex.value - 1, innerText);

      const isAfterMaxDate = isBefore(maxDate, dateAfter);

      if (isAfterMaxDate) return "isDisabled";
    }

    if (minDate) {
      const dateBefore = new Date(year.value, monthIndex.value - 1, innerText);

      const isBeforeMinDate = isBefore(dateBefore, minDate);

      if (isBeforeMinDate) return "isDisabled";
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

  eventDayClick(elemen: any) {
    const element = elemen.target as HTMLDivElement;

    if (!element || !element.innerText) return;

    const innerText = Number(element.innerText);

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
      innerText
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

    this.yearsDiv = [];

    if (!yearList) return;

    let yearsAbove = this.years.slice(
      Math.max(0, year.value - 19),
      year.value + 1
    );

    this.calendar.querySelector("#year-array").innerHTML =
      yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

    yearsAbove.forEach((e, index) => {
      this.yearsDiv.push({
        value: e,
        class: "year-element",
      } as Year);
    });
  }

  resetClassList() {
    this.calendar.querySelector(".year-list").innerHTML = "";
  }

  handleYearClick(element: HTMLDivElement) {
    if (!element) return;

    const { year } = this.f;

    year.setValue(Number(element.dataset.year));

    this.yearElement.classList.remove("show");
    this.monthElement.classList.add("show");
    this.monthElement.style.display = "flex !important";
  }

  handleMonthClick(element: number) {
    const calendarComplete = this.calendar.querySelector(
      ".calendar-complete"
    ) as HTMLElement;

    const { year } = this.f;

    const month = Number(element) + 1;

    this.f.monthIndex.setValue(month);

    const monthName = this.monthNames[month - 1];

    this.f.month.setValue(monthName);

    this.monthElement.classList.remove("show");

    calendarComplete.style.display = "block";

    this.generateCalendar(this.f.monthIndex.value - 1, year.value);
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

  get calendar(): any {
    return document.querySelector(".calendar");
  }

  get calendarDays(): any {
    return document.querySelectorAll(".calendar-days .bundle");
  }

  get monthElement(): HTMLElement {
    return document.querySelector(".month-container") as HTMLElement;
  }

  get yearElement(): any {
    return document.querySelector("#year-container");
  }

  get years() {
    return Array.from(
      new Array(this.currentDate.getFullYear() + 1920),
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

      const date = new Date("2023-09-17");

      for (const _ of new Array(7).fill(0)) {
        this.daysOfWeek.push(
          date.toLocaleDateString(this.row.locale, { weekday: "narrow" })
        );
        date.setDate(date.getDate() + 1);
      }
    }
  }
}
