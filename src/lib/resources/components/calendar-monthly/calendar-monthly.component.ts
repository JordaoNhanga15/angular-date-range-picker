import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  DoCheck,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { DateContract } from "../../../core/contracts/index";
import { DateService } from "../../../core/services/date.service";
import { calendarType, Year } from "../../../core/interfaces/DataInterface";
import { FormControlInterface } from "../../../core/interfaces/FormControlInterface";
import {
  isBefore,
  handleCalendarMonthBuildForm,
  handleCalendarYearBuildForm,
} from "../../../shared/utils/formatDate";
import { MessagesInterface } from "../../../core/interfaces/MessagesInterface";
import { isInvalid } from "../../../shared/utils/detectDateFormats";

@Component({
  selector: "lib-calendar-monthly",
  template: `
    <calendar-month
      [row]="row"
      [f]="f"
      [monthNames]="monthNames"
      (pagination)="pagination($event)"
      (monthClick)="eventMonthClick($event)"
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
      @import url("https://cdn.jsdelivr.net/gh/JordaoNhanga15/CDN-for-Assets@main/calendar-month.css");
    `,
  ],
})
export class CalendarMonthlyComponent implements OnInit, DoCheck {
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
  yearsDiv: Year[] = [];

  constructor(private fb: FormBuilder, private date: DateService) {
    this.dateContract = new DateContract(this.row);
    this.handleCalendarNormalize = this.handleCalendarNormalize.bind(this);
    this.handleYearClick = this.handleYearClick.bind(this);
    this.handleCalendarMonth = this.handleCalendarMonth.bind(this);
  }

  ngOnInit(): void {
    this.buildForm();
    this.dateContract = new DateContract(this.row);
  }

  ngDoCheck(): void {
    this.customMonths();
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

  get currentDate(): Date {
    return this.row.date || new Date();
  }

  get f(): FormControlInterface {
    return this.formHeader.controls as FormControlInterface;
  }

  get calendar(): any {
    return document.querySelector(".calendar");
  }

  protected get calendarMonths(): any {
    return document.querySelectorAll(".month-element");
  }

  get monthElement(): any {
    return document.querySelector(".month-containers");
  }

  get yearElement(): any {
    return document.querySelector(".year-container");
  }

  get years() {
    return Array.from(
      new Array(this.currentDate.getFullYear() + 1920),
      (val, index) => index
    );
  }

  get calendarHeaderYear(): number {
    if (!this.calendarHeader) return 0;
    return Number(this.calendarHeader.innerHTML);
  }

  get calendarHeader(): HTMLElement {
    return this.calendar.querySelector("#year-picker");
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

  dateFormater(date: Date, format: string): string {
    if (!date) return "";

    return date.toLocaleDateString(this.row.locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }

  cappitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  clearForm() {
    this.resetControls();
    const months = this.calendarMonths as HTMLDivElement[];
    months.forEach((m: HTMLDivElement) => {
      m.classList.remove("selected");
      m.classList.remove("interval");
    });
    this.dateRange.emit(this.f.dateRange.value);
  }

  get dateRangeValue(): boolean {
    return !!this.f.dateRange.value;
  }

  handleDarkMode() {
    this.formHeader.controls.containDarkMode.setValue(
      !!this.formHeader.controls.containDarkMode.value
    );

    const aside = document.querySelector("aside") as HTMLElement;

    if (!aside) return;

    switch (aside.classList.contains("dark")) {
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

  handleCalendarMonth(type: string) {
    if (!type) return;

    const operationArithmetic = type == "prevYear" ? -1 : +1;

    const year = this.formHeader.controls.year.value + operationArithmetic;
    this.formHeader.controls.year.setValue(year);
  }

  pagination(type: string) {
    if (!isInvalid(type)) return;

    this.handleCalendarBuildForm(type);
  }

  eventYearClick() {
    const containClass = this.yearElement.classList.contains("show");

    switch (containClass) {
      case true:
        this.monthElement.classList.add("show");
        this.yearElement.classList.remove("show");
        break;
      case false:
        this.monthElement.classList.remove("show");
        this.yearElement.classList.add("show");
        this.generateCalendarYearly();
        break;
    }
  }

  generateCalendarYearly() {
    const { year } = this.f;

    let yearList = this.calendar.querySelector(".year-list");

    yearList.innerHTML = "";

    if (!yearList) return;

    let yearsAbove = this.years.slice(
      Math.max(0, year.value - 15),
      year.value + 1
    );

    this.calendar.querySelector("#year-array").innerHTML =
      yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

    yearsAbove.forEach((e, index) => {
      this.yearsDiv.push({
        value: e,
        class: `year-element`,
      } as Year);
    });
  }

  handleYearClick(element: HTMLDivElement) {
    if (!element) return;

    const { year } = this.f;

    year.setValue(Number(element.dataset.year));

    this.yearElement.classList.remove("show");
    this.monthElement.classList.add("show");
  }

  private resetControls() {
    this.f.firstDate.setValue(null);
    this.f.secondDate.setValue(null);
    this.f.dateRange.setValue(null);
  }

  eventMonthClick(month: any): void {
    if (["", undefined, null].includes(month)) return;

    const months = this.calendarMonths as HTMLDivElement[];

    if (this.f.firstDate.value && this.f.secondDate.value) {
      this.resetControls();
      months.forEach((m: HTMLDivElement) => {
        m.classList.remove("selected");
        m.classList.remove("interval");
      });
    }

    const { year } = this.f;

    const isSecondClick =
      this.f.firstDate && this.f.firstDate.value ? true : false;

    switch (isSecondClick) {
      case true:
        this.f.secondDate.setValue(new Date(year.value, month));
        break;
      case false:
        this.f.firstDate.setValue(new Date(year.value, month));
        break;
    }

    const isBeforeSecondDate = isBefore(
      this.f.secondDate.value,
      this.f.firstDate.value
    );

    if (isBeforeSecondDate) {
      this.f.firstDate.setValue(this.f.secondDate.value);
      this.f.secondDate.setValue(null);
    }

    this.dateContract.compile(
      {
        year: year.value,
        month: month,
      },
      this.f
    );

    const element = months[month];

    element.classList.add("selected");

    if (!year.value) year.setValue(this.currentDate.getFullYear());

    const firstDate = this.date.formatDate(this.f.firstDate.value, (d) =>
      d.toLocaleDateString(this.row.locale, {
        year: "numeric",
        month: "2-digit",
      })
    );

    const secondDate = this.date.formatDate(this.f.secondDate.value, (d) =>
      d.toLocaleDateString(this.row.locale, {
        year: "numeric",
        month: "2-digit",
      })
    );

    this.f.dateRange.setValue(
      `${firstDate} ${secondDate ? `- ${secondDate}` : ""}`
    );

    return this.dateRange.emit(this.f.dateRange.value);
  }
}
