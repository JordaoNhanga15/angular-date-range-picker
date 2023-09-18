import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { DateContract } from "../../../core/contracts/index";
import { PaginationEnum } from "../../../shared/models/strategy.model";
import { DateService } from "../../../core/services/date.service";
import { DataInterface } from "../../../core/interfaces/DataInterface";
import { FormControlInterface } from "../../../core/interfaces/FormControlInterface";
import { isBefore } from "../../../shared/utils/formatDate";
import { MessagesInterface } from "../../../core/interfaces/MessagesInterface";

@Component({
  selector: "lib-calendar-yearly",
  // templateUrl: "./calendar-yearly.component.html",
  template: `
    <div class="year-container show">
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
  // styleUrls: ["./calendar-yearly.component.css"],
  styles: [
    `
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
        display: flex !important;
        justify-content: flex-start !important;
        position: relative !important;
        flex-direction: column !important;
        width: 100% !important;
        transform: scale(1.5) !important;
        visibility: hidden !important;
        pointer-events: none !important;
        position: absolute !important;
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
        background-color: var(--bg-main) !important;
        padding-top: 20px !important;
        padding-bottom: 20px !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
        align-items: center !important;
        transition: all 0.2s ease-in-out !important;
      }

      .year-container.show {
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
        font-size: 1.5rem !important;
      }

      .year-list div:hover {
        background-color: var(--color-hover) !important;
        border-radius: 10px !important;
        transition: all 0.2s ease-in-out !important;
        cursor: pointer !important;
      }

      .year-picker {
        padding: 5px 10px !important;
        margin-left: 20px !important;
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

      .year-picker:hover {
        transition: all 0.2s ease-in-out !important;
        background-color: var(--color-hover) !important;
      }

      .month-container.show {
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

      .year-container {
        position: relative !important;
        background: none !important;
      }
    `,
  ],
})
export class CalendarYearlyComponent implements OnInit {
  formHeader: FormGroup;
  @Input() row: DataInterface;
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

    const years = this.calendarYears;
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

  protected get calendar(): any {
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

  protected get years() {
    return Array.from(
      new Array(this.currentDate.getFullYear() + 80),
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
          year.innerHTML = `<div data-year="${e}" class="year-element ${this.handleYearClass(
            e
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
          year.innerHTML = `<div data-year="${e}" class="year-element ${this.handleYearClass(
            e
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
      },
    }[type as keyof PaginationEnum]();
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
        e
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

  handleYearClass(year: number): string {
    const { firstDate, secondDate } = this.f;

    const { maxDate, minDate } = this.row;

    if (maxDate || minDate) {
      if (maxDate || minDate) {
        const dateBefore = new Date(year, 1, 1);

        const isBeforeMinDate = isBefore(dateBefore, minDate);

        const dateAfter = new Date(year, 1, 1);

        const isAfterMaxDate = isBefore(maxDate, dateAfter);

        if (isBeforeMinDate || isAfterMaxDate) return "isDisabled";
      }
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
