import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { DateContract } from "../../../core/contracts/index";
import { DateService } from "../../../core/services/date.service";
import { calendarType } from "../../../core/interfaces/DataInterface";
import { FormControlInterface } from "../../../core/interfaces/FormControlInterface";
import {
  isBefore,
  handleCalendarYearBuildForm,
} from "../../../shared/utils/formatDate";
import { MessagesInterface } from "../../../core/interfaces/MessagesInterface";

@Component({
  selector: "lib-calendar-yearly",
  template: `
    <div class="year-container show">
      <div class="year-pickers calendar-header">
        <span
          class="year-change"
          id="prev-pagination"
          (click)="
            handleCalendarNormalize(
              'prevPagination',
              handleYearClick,
              years,
              calendar,
              handleYearClass
            )
          "
        >
          <div><</div>
        </span>
        <span id="year-array">2021 - 2028</span>
        <span
          class="year-change"
          id="next-pagination"
          (click)="
            handleCalendarNormalize(
              'nextPagination',
              handleYearClick,
              years,
              calendar,
              handleYearClass
            )
          "
        >
          <div>></div>
        </span>
      </div>
      <div class="year-list"></div>
    </div>

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
      @import url("https://cdn.jsdelivr.net/gh/JordaoNhanga15/CDN-for-Assets@master/calendar.css");
    `,
  ],
})
export class CalendarYearlyComponent implements OnInit {
  formHeader: FormGroup;
  @Input() row: calendarType;
  @Input() format: string;
  @Input() messages: MessagesInterface;
  @Input() formControl: FormControl;
  @Output() dateRange: EventEmitter<{
    dateRange: Date;
  }> = new EventEmitter();
  dateContract: DateContract;

  constructor(private fb: FormBuilder, private date: DateService) {
    this.dateContract = new DateContract(this.row);
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildYearList();
    this.dateContract = new DateContract(this.row);
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

  handleYearClick(element: HTMLDivElement) {
    if (!element) return;

    const years = document.querySelectorAll(
      ".year-element"
    ) as NodeListOf<HTMLDivElement>;

    if (this.f.firstDate.value && this.f.secondDate.value) {
      this.resetControls();
      years.forEach((m: HTMLDivElement) => {
        m.classList.remove("selected");
        m.classList.remove("interval");
      });
    }

    const year = Number(element.dataset.year);

    const containFirstDate =
      this.f.firstDate && this.f.firstDate.value ? true : false;

    switch (containFirstDate) {
      case true:
        this.f.secondDate.setValue(year);
        break;
      case false:
        this.f.firstDate.setValue(year);
        break;
    }

    const isSmallerThanFirstDate =
      Number(this.f.secondDate.value) < Number(this.f.firstDate.value);

    if (isSmallerThanFirstDate) {
      this.f.secondDate.setValue(null);
      this.f.firstDate.setValue(year);
    }

    const firstDate = Number(this.f.firstDate.value);

    const secondDate = Number(this.f.secondDate.value);

    this.dateContract.compile(
      {
        year: element,
      },
      this.f
    );

    this.f.dateRange.setValue(
      `${firstDate} ${secondDate ? ` - ${secondDate}` : ""}`
    );

    return this.dateRange.emit(this.f.dateRange.value);
  }

  get dateRangeValue(): boolean {
    return !!this.f.dateRange.value;
  }

  clearForm() {
    this.resetControls();
    this.buildYearList();
    this.dateRange.emit(this.f.dateRange.value);
  }

  get currentDate(): Date {
    return new Date();
  }

  get calendar(): any {
    return document.querySelector(".calendar");
  }

  protected get calendarYears(): any {
    return document.querySelectorAll(".year-element");
  }

  protected get monthElement(): any {
    return document.querySelector(".month-container");
  }

  protected get yearElement(): any {
    return document.querySelector(".year-container");
  }

  get years() {
    return Array.from(
      new Array(this.currentDate.getFullYear() + 1920),
      (val, index) => index
    );
  }

  protected get f(): FormControlInterface {
    return this.formHeader.controls as FormControlInterface;
  }

  protected get calendarHeaderYear(): number {
    if (!this.calendarHeader) return 0;
    return Number(this.calendarHeader.innerHTML);
  }

  protected get calendarHeader(): HTMLElement {
    return this.calendar.querySelector("#year-picker");
  }

  private resetControls() {
    this.f.firstDate.setValue(null);
    this.f.secondDate.setValue(null);
    this.f.dateRange.setValue(null);
  }

  handleCalendarNormalize(
    type: string,
    yearClick: Function,
    years: number[],
    calendar: HTMLElement,
    yearClass?: Function
  ) {
    handleCalendarYearBuildForm(
      type,
      yearClick,
      years,
      calendar,
      this.f,
      this.row,
      yearClass
    );
  }

  buildYearList() {
    let y = new Date().getFullYear();

    let yearList = this.calendar.querySelector(".year-list");

    let yearsAbove = this.years.slice(Number(y), Number(y) + 16);

    yearList.innerHTML = "";

    this.calendar.querySelector("#year-array").innerHTML =
      yearsAbove[0] + " - " + yearsAbove[yearsAbove.length - 1];

    yearsAbove.forEach((e, index) => {
      let year = document.createElement("div");
      year.innerHTML = `<div data-year="${e}" class="year-element ${this.handleYearClass(
        e,
        this.f,
        this.row
      )}" >${e}</div>`;

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

  handleYearClass(
    year: number,
    form: FormControlInterface,
    row: calendarType
  ): string {
    const { firstDate, secondDate } = form;

    const { maxDate, minDate } = row;

    if (maxDate) {
      const dateAfter = new Date(year, 1, 1);

      const isAfterMaxDate = isBefore(maxDate, dateAfter);

      if (isAfterMaxDate) return "isDisabled";
    }

    if (minDate) {
      const dateBefore = new Date(year, 1, 1);

      const isBeforeMinDate = isBefore(dateBefore, minDate);

      if (isBeforeMinDate) return "isDisabled";
    }

    const isTheSameYear =
      year == Number(firstDate.value) || year == Number(secondDate.value);

    if (isTheSameYear) return "selected";

    const isWithinTheRange =
      year < Number(secondDate.value) && year > Number(firstDate.value);

    if (isWithinTheRange && !isTheSameYear) return "interval";

    return "";
  }

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

  cappitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
