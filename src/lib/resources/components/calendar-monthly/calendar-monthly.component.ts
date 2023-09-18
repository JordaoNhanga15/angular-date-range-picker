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
import {
  PaginationEnum,
  PaginationYearEnum,
} from "../../../shared/models/strategy.model";
import { DateService } from "../../../core/services/date.service";
import { DataInterface } from "../../../core/interfaces/DataInterface";
import { FormControlInterface } from "../../../core/interfaces/FormControlInterface";
import { isBefore } from "../../../shared/utils/formatDate";
import { MessagesInterface } from "../../../core/interfaces/MessagesInterface";

@Component({
  selector: "lib-calendar-monthly",
  template: `
    <div class="month-containers show">
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
  styles: [
    `
      .calendar {
        height: max-content !important;
        width: max-content !important;
        background-color: var(--bg-main) !important;
        z-index: 999 !important;
        overflow: hidden !important;
        display: none !important;
        width: 100% !important;
        max-width: -moz-available !important;
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

      .month-picker {
        padding: 5px 10px !important;
        border-radius: 10px !important;
        cursor: pointer !important;
      }

      .month-element {
        border-radius: 10px !important;
      }

      .month-element:hover {
        background-color: var(--color-hover) !important;
      }

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

      .year-container {
        display: none !important;
        justify-content: flex-start !important;
        position: relative !important;
        flex-direction: column !important;
        width: 100% !important;
        transform: scale(1.5) !important;
        visibility: hidden !important;
        pointer-events: none !important;
        width: 100% !important;
        height: 100% !important;
        background-color: var(--bg-main) !important;
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

      .year-list {
        width: 100% !important;
        align-items: center !important;
        justify-content: space-between !important;
        justify-items: center !important;
        background-color: var(--bg-main) !important;
        padding: 20px !important;
        grid-template-columns: 1fr 1fr 1fr 1fr !important;
        gap: 10px 30px !important;
        display: grid !important;
        margin-right: 17px !important;
      }

      .year-list div {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        color: var(--color-txt) !important;
        height: 60px !important;
        cursor: pointer !important;
        font-size: 1rem !important;
      }

      .year-list div:hover {
        background-color: var(--color-hover) !important;
        border-radius: 10px !important;
        transition: all 0.2s ease-in-out !important;
        cursor: pointer !important;
      }

      .year-picker {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 5px 10px !important;
        border-radius: 10px !important;
        cursor: pointer !important;
      }

      .year-pickers {
        border-radius: 10px !important;
        cursor: pointer !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
        transition: all 0.2s ease-in-out !important;
      }

      .month-containers {
        padding: 15px !important;
        display: none !important;
      }

      .year-picker:hover {
        transition: all 0.2s ease-in-out !important;
        background-color: var(--color-hover) !important;
      }

      .month-containers.show {
        display: block !important;
        transform: scale(1) !important;
        visibility: visible !important;
        pointer-events: visible !important;
        transition: all 0.2s ease-in-out !important;
      }

      .month-list {
        height: 100% !important;
        background-color: var(--bg-main) !important;
        padding: 20px !important;
        grid-template-columns: repeat(3, auto) !important;
        gap: 10px !important;
        display: grid !important;
        width: 100% !important;
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

      .calendar-month {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        min-height: 390px;
        position: relative !important;
      }

      .year-class {
        margin: 0 0 5px 0 !important;
      }

      .month-container {
        padding: 5 !important;
      }

      .month-list {
        padding: 0 5px 0px 5px;
        margin-bottom: 5px !important;
        gap: 5 !important;
      }

      /deep/ .year-class {
        margin: 5px !important;
      }

      /deep/ .month-container {
        padding: 5 !important;
      }

      /deep/ .month-list {
        padding: 0 5px 0px 5px;
        margin-bottom: 5px !important;
        gap: 5 !important;
      }

      /deep/ .justify-content-end {
        justify-content: flex-end !important;
      }
    `,
  ],
})
export class CalendarMonthlyComponent implements OnInit, DoCheck {
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

  constructor(private fb: FormBuilder, private date: DateService) {
    this.dateContract = new DateContract(this.row);
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

  protected get calendar(): any {
    return document.querySelector(".calendar");
  }

  protected get calendarMonths(): any {
    return document.querySelectorAll(".month-element");
  }

  protected get monthElement(): any {
    return document.querySelector(".month-containers");
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

  protected get calendarHeaderYear(): number {
    if (!this.calendarHeader) return 0;
    return Number(this.calendarHeader.innerHTML);
  }

  protected get calendarHeader(): HTMLElement {
    return this.calendar.querySelector("#year-picker");
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

    return {
      prevYear: () => {
        const year = this.formHeader.controls.year.value - 1;
        this.formHeader.controls.year.setValue(year);
      },
      nextYear: () => {
        const year = this.formHeader.controls.year.value + 1;
        this.formHeader.controls.year.setValue(year);
      },
    }[type as keyof PaginationYearEnum]();
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

  handleYearClick(element: HTMLDivElement) {
    if (!element) return;

    const { year } = this.f;

    year.setValue(Number(element.dataset.year));

    this.yearElement.classList.remove("show");
    this.monthElement.classList.add("show");

    this.calendar.querySelector(".year-list").innerHTML = "";
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

        let yearsAbove = this.years.slice(Math.max(0, y - 16), y);

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

        let yearsAbove = this.years.slice(Number(y) + 1, Number(y) + 17);

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

  handleMonthClass(month: number): string {
    // if (!month) return '';

    const { dateRange, monthIndex, year } = this.f;

    const innerMonth = month + 1;

    const { maxDate, minDate } = this.row;

    if (maxDate || minDate) {
      if (maxDate || minDate) {
        const dateBefore = new Date(year.value, innerMonth, 1);

        const isBeforeMinDate = isBefore(dateBefore, minDate);

        const dateAfter = new Date(year.value, innerMonth, 1);

        const isAfterMaxDate = isBefore(maxDate, dateAfter);

        if (isBeforeMinDate || isAfterMaxDate) return "isDisabled";
      }
    }

    if (!dateRange.value) return "";

    const value = dateRange.value as String;

    const [firstDate, secondDate] = value.split(" - ");

    const [firstDateMonth, firstDateYear] = firstDate.split("/");

    const isTheSameMonth = Number(firstDateMonth) == innerMonth;

    const isTheSameYear = Number(firstDateYear) == this.calendarHeaderYear;

    const isTheSameDate = isTheSameMonth && isTheSameYear;

    if (isTheSameDate) return "selected";

    if (!secondDate) return "";

    const [secondDateMonth, secondDateYear] = secondDate.split("/");

    const isTheSameMonthSecondDate = Number(secondDateMonth) == innerMonth;

    const isTheSameYearSecondDate =
      Number(secondDateYear) === this.calendarHeaderYear;

    const isTheSameDateSecondDate =
      isTheSameMonthSecondDate && isTheSameYearSecondDate;

    if (secondDate && isTheSameDateSecondDate) return "selected";

    const parseDayInnerText = this.date.transformPipeInDate(
      Number(1),
      monthIndex.value - 1,
      this.calendarHeaderYear
    );

    if (!parseDayInnerText) return "";

    const isWithinTheRange =
      Number(innerMonth) < Number(secondDateMonth) &&
      innerMonth > Number(firstDateMonth) &&
      isTheSameYear;

    if (isWithinTheRange) return "interval";

    return "";
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
