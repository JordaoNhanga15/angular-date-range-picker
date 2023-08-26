import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { DateContract } from '../../../core/contracts/index';
import { PaginationEnum } from '../../../shared/models/strategy.model';
import { DateService } from '../../../core/services/date.service';
import { DataInterface } from '../../../core/interfaces/DataInterface';
import { FormControlInterface } from '../../../core/interfaces/FormControlInterface';
import { isBefore } from '../../../shared/utils/formatDate';
import { MessagesInterface } from '../../../core/interfaces/MessagesInterface';

@Component({
  selector: 'lib-calendar-monthly',
  templateUrl: './calendar-monthly.component.html',
  styleUrls: ['./calendar-monthly.component.css'],
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
    if(this.row.locale){
      this.monthNames = this.months.map((_, index) => {
        const date = new Date(this.currentDate.getFullYear(), index, 1);
        return date.toLocaleDateString(this.row.locale, { month: 'long' });
      });
    }
  }

  protected buildForm(): void {
    this.formHeader = this.fb.group({
      year: [this.currentDate.getFullYear(), Validators.required],
      containDarkMode: [false, Validators.required],
      month: [
        this.cappitalizeFirstLetter(
          this.currentDate.toLocaleString(this.row.locale, { month: 'long' })
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
    return document.querySelector('.calendar');
  }

  protected get calendarMonths(): any {
    return document.querySelectorAll('.month-element');
  }

  protected get monthElement(): any {
    return document.querySelector('.month-container');
  }

  protected get yearElement(): any {
    return document.querySelector('.year-container');
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
    return this.calendar.querySelector('#year-picker');
  }

  dateFormater(date: Date, format: string): string {
    if (!date) return '';

    return date.toLocaleDateString(this.row.locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }

  cappitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleDarkMode() {
    this.formHeader.controls.containDarkMode.setValue(
      !!this.formHeader.controls.containDarkMode.value
    );

    const aside = document.querySelector('aside') as HTMLElement;

    if (!aside) return;

    switch (aside.classList.contains('dark')) {
      case true:
        aside.classList.remove('dark');
        aside.classList.add('light');
        break;
      case false:
        aside.classList.remove('light');
        aside.classList.add('dark');
        break;
    }
  }

  eventYearClick() {
    const containClass = this.yearElement.classList.contains('show');

    switch (containClass) {
      case true:
        this.yearElement.classList.remove('show');
        break;
      case false:
        this.yearElement.classList.add('show');
        this.generateCalendarYearly();
        break;
    }
  }

  generateCalendarYearly() {
    const { year } = this.f;

    let yearList = this.calendar.querySelector('.year-list');

    yearList.innerHTML = '';

    if (!yearList) return;

    let yearsAbove = this.years.slice(
      Math.max(0, year.value - 15),
      year.value + 1
    );

    this.calendar.querySelector('#year-array').innerHTML =
      yearsAbove[0] + ' - ' + yearsAbove[yearsAbove.length - 1];

    yearsAbove.forEach((e, index) => {
      let year = document.createElement('div');
      year.innerHTML = `<div data-year="${e}" class="year-element">${e}</div>`;

      yearList.appendChild(year);
    });

    this.calendar
      .querySelectorAll('.year-element')
      .forEach((element: HTMLDivElement) => {
        element.addEventListener('click', (ele: Event) =>
          this.handleYearClick(ele.target as HTMLDivElement)
        );
      });
  }

  handleYearClick(element: HTMLDivElement) {
    if (!element) return;

    const { year } = this.f;

    year.setValue(Number(element.dataset.year));

    this.yearElement.classList.remove('show');

    this.calendar.querySelector('.year-list').innerHTML = '';
  }

  handleCalendarYearBuildForm(type: string) {
    if (!type) return;

    return {
      prevPagination: () => {
        let y = this.calendar
          .querySelector('#year-array')
          .innerHTML.split(' - ')[0];

        if (y == 0) return;

        if (!y) y = new Date().getFullYear();

        let yearList = this.calendar.querySelector('.year-list');

        let yearsAbove = this.years.slice(Math.max(0, y - 16), y);

        yearList.innerHTML = '';

        this.calendar.querySelector('#year-array').innerHTML =
          yearsAbove[0] + ' - ' + yearsAbove[yearsAbove.length - 1];

        yearsAbove.forEach((e, index) => {
          let year = document.createElement('div');
          year.innerHTML = `<div data-year="${e}" class="year-element">${e}</div>`;

          yearList.appendChild(year);
        });

        this.calendar
          .querySelectorAll('.year-element')
          .forEach((element: HTMLDivElement) => {
            element.addEventListener('click', (ele: Event) =>
              this.handleYearClick(ele.target as HTMLDivElement)
            );
          });
      },
      nextPagination: () => {
        let y = this.calendar
          .querySelector('#year-array')
          .innerHTML.split(' - ')[1];

        if (!y) y = new Date().getFullYear();

        let yearList = this.calendar.querySelector('.year-list');

        let yearsAbove = this.years.slice(Number(y) + 1, Number(y) + 17);

        yearList.innerHTML = '';

        this.calendar.querySelector('#year-array').innerHTML =
          yearsAbove[0] + ' - ' + yearsAbove[yearsAbove.length - 1];

        yearsAbove.forEach((e, index) => {
          let year = document.createElement('div');
          year.innerHTML = `<div data-year="${e}" class="year-element">${e}</div>`;

          yearList.appendChild(year);
        });

        this.calendar
          .querySelectorAll('.year-element')
          .forEach((element: HTMLDivElement) => {
            element.addEventListener('click', (ele: Event) =>
              this.handleYearClick(ele.target as HTMLDivElement)
            );
          });
      },
    }[type as keyof PaginationEnum]();
  }

  handleMonthClass(month: number): string {
    // if (!month) return '';

    const { dateRange, monthIndex } = this.f;

    if (!dateRange.value) return '';

    const value = dateRange.value as String;

    const [firstDate, secondDate] = value.split(' - ');

    const [firstDateMonth, firstDateYear] = firstDate.split('/');

    const innerMonth = month + 1;

    const isTheSameMonth = Number(firstDateMonth) == innerMonth;

    const isTheSameYear = Number(firstDateYear) == this.calendarHeaderYear;

    const isTheSameDate = isTheSameMonth && isTheSameYear;

    if (isTheSameDate) return 'selected';

    if (!secondDate) return '';

    const [secondDateMonth, secondDateYear] = secondDate.split('/');

    const isTheSameMonthSecondDate = Number(secondDateMonth) == innerMonth;

    const isTheSameYearSecondDate =
      Number(secondDateYear) === this.calendarHeaderYear;

    const isTheSameDateSecondDate =
      isTheSameMonthSecondDate && isTheSameYearSecondDate;

    if (secondDate && isTheSameDateSecondDate) return 'selected';

    const parseDayInnerText = this.date.transformPipeInDate(
      Number(1),
      monthIndex.value - 1,
      this.calendarHeaderYear
    );

    if (!parseDayInnerText) return '';

    const isWithinTheRange =
      Number(innerMonth) < Number(secondDateMonth) &&
      innerMonth > Number(firstDateMonth) &&
      isTheSameYear;

    if (isWithinTheRange) return 'interval';

    return '';
  }

  private resetControls() {
    this.f.firstDate.setValue(null);
    this.f.secondDate.setValue(null);
    this.f.dateRange.setValue(null);
  }

  eventMonthClick(month: any): void {
    if (['', undefined, null].includes(month)) return;

    const months = this.calendarMonths as HTMLDivElement[];

    if (this.f.firstDate.value && this.f.secondDate.value) {
      this.resetControls();
      months.forEach((m: HTMLDivElement) => {
        m.classList.remove('selected');
        m.classList.remove('interval');
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

    element.classList.add('selected');

    if (!year.value) year.setValue(this.currentDate.getFullYear());

    const firstDate = this.date.formatDate(this.f.firstDate.value, (d) =>
      d.toLocaleDateString(this.row.locale, {
        year: 'numeric',
        month: '2-digit',
      })
    );

    const secondDate = this.date.formatDate(this.f.secondDate.value, (d) =>
      d.toLocaleDateString(this.row.locale, {
        year: 'numeric',
        month: '2-digit',
      })
    );

    this.f.dateRange.setValue(
      `${firstDate} ${secondDate ? `- ${secondDate}` : ''}`
    );

    return this.dateRange.emit(this.f.dateRange.value);
  }
}
