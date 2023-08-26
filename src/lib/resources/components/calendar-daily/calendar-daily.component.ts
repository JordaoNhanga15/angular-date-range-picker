import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  DoCheck,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  PaginationEnum,
  PaginationYearEnum,
} from '../../../shared/models/strategy.model';
import { DateContract } from '../../../core/contracts/index';
import { DateService } from '../../../core/services/date.service';
import { DataInterface } from '../../../core/interfaces/DataInterface';
import { FormControlInterface } from '../../../core/interfaces/FormControlInterface';
import { MessagesInterface } from '../../../core/interfaces/MessagesInterface';
import {
  formatDate,
  transformPipeInDate,
  splitDate,
  isBefore,
} from '../../../shared/utils/formatDate';

@Component({
  selector: 'lib-calendar-daily [row] [format]',
  templateUrl: './calendar-daily.component.html',
  styleUrls: ['./calendar-daily.component.css'],
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

  // get daysOfWeek(): string[] {
  //   const daysOfWeek = [] as string[];

  //   const date = new Date();

  //   for (const _ of new Array(7).fill(0)) {
  //     daysOfWeek.push(
  //       date.toLocaleDateString(this.row.locale, { weekday: 'narrow' })
  //     );
  //     date.setDate(date.getDate() + 1);
  //   }

  //   return daysOfWeek;
  // }

  private isLeapYear = (year: number) => {
    if (!year) return new Date().getFullYear();

    return (
      (year % 4 == 0 && year % 100 !== 0 && year % 400 !== 0) ||
      (year % 100 == 0 && year % 400 === 0)
    );
  };

  handleDarkMode() {
    this.f.containDarkMode.setValue(!!this.f.containDarkMode.value);

    const aside = document.querySelector('aside') as HTMLElement;

    if (!aside) return;

    const contain = aside.classList.contains('dark');

    switch (contain) {
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
    return this.calendar.querySelector('#year');
  }

  private getFebDays = (year: number) => {
    return this.isLeapYear(year) ? 29 : 28;
  };

  protected generateCalendar(month: number, year: number) {
    let calendar_days = this.calendar.querySelector('.calendar-days');
    let calendar_header_year = this.calendarHeader;
    calendar_days.innerHTML = '';

    if ((!month && ![0, '0'].includes(month)) || typeof month == 'string')
      month = this.currentDate.getMonth();

    if (!year) year = this.currentDate.getFullYear();

    calendar_header_year.innerHTML = year.toString();

    let first_day = new Date(year, month, 1);

    let days_of_month = this.dayOfMonths(year);

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
      // if (i === 0) continue;

      let day = document.createElement('div') as any;
      const isLessThanFirstDay = i - first_day.getDay() + 1;
      const isBiggerThanFirstDay = i >= first_day.getDay();

      const isCurrentDate =
        i - first_day.getDay() + 1 == this.currentDate.getDate() &&
        year == this.currentDate.getFullYear() &&
        month == this.currentDate.getMonth();

      if (isBiggerThanFirstDay) {
        day.classList.add('calendar-day-hover');
        day.classList.add('bundle');
        day.innerHTML = isLessThanFirstDay;
        day.innerHTML += `<span></span>
                          <span></span>
                          <span></span>
                          <span></span>`;

        if (isCurrentDate) {
          day.classList.add('curr-date');
        }
      }

      const containClassInDay = this.handleDayClass(day);

      if (containClassInDay && isLessThanFirstDay > 0) {
        day.classList.add(containClassInDay);
      }

      day.addEventListener('click', (ele: Event) =>
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
    if (!day) return '';

    const { dateRange, monthIndex } = this.f;

    if (!dateRange.value) return '';

    const value = dateRange.value as String;

    const [firstDate, secondDate] = value.split(' - ');

    const innerText = day.innerText;

    const [firstDateMonth, firstDateDay, firstDateYear] = splitDate(
      firstDate,
      this.row
    );

    const isTheSameMonth = Number(firstDateMonth) === monthIndex.value;

    const isTheSameYear = Number(firstDateYear) === this.calendarHeaderYear;

    const isTheSameDate =
      isTheSameMonth &&
      isTheSameYear &&
      Number(innerText) === Number(firstDateDay);

    if (isTheSameDate) return 'selected';

    if (!secondDate) return '';

    const [secondDateMonth, secondDateDay, secondDateYear] = splitDate(
      secondDate,
      this.row
    );

    const isTheSameMonthSecondDate =
      Number(secondDateMonth) == monthIndex.value;

    const isTheSameYearSecondDate =
      Number(secondDateYear) == this.calendarHeaderYear;

    const isTheSameDateSecondDate =
      isTheSameMonthSecondDate &&
      isTheSameYearSecondDate &&
      Number(innerText) == Number(secondDateDay);

    if (secondDate && isTheSameDateSecondDate) return 'selected';

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

    if (!parseDayInnerText) return '';

    const isWithinTheRange =
      parseDayInnerText.getTime() > parseFirstDate.getTime() &&
      parseDayInnerText.getTime() < parseSecondDate.getTime();

    if (isWithinTheRange) return 'interval';

    return '';
  }

  eventDayClick(element: HTMLDivElement) {
    if (!element || !element.innerText) return;

    const calendarDays = this.calendarDays;

    if (this.f.firstDate.value && this.f.secondDate.value) {
      this.resetControls();
      calendarDays.forEach((day: HTMLDivElement) => {
        day.classList.remove('selected');
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
      `${firstDate} ${secondDate ? `- ${secondDate}` : ''}`
    );

    return this.dateRange.emit(this.f.dateRange.value);
  }

  eventMonthClick() {
    const containClass = this.monthElement.classList.contains('show');

    switch (containClass) {
      case true:
        this.monthElement.classList.remove('show');
        break;
      case false:
        this.monthElement.classList.add('show');
        break;
    }
  }

  generateCalendarYearly() {
    const { year } = this.f;

    let yearList = this.calendar.querySelector('.year-list');

    yearList.innerHTML = '';

    if (!yearList) return;

    let yearsAbove = this.years.slice(
      Math.max(0, year.value - 19),
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

        let yearsAbove = this.years.slice(Math.max(0, y - 20), y);

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

        let yearsAbove = this.years.slice(Number(y) + 1, Number(y) + 21);

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

  resetClassList() {
    this.calendar.querySelector('.year-list').innerHTML = '';
    this.calendar.querySelector('.calendar-days').innerHTML = '';
  }

  handleYearClick(element: HTMLDivElement) {
    if (!element) return;

    const { year } = this.f;

    year.setValue(Number(element.dataset.year));

    this.yearElement.classList.remove('show');

    this.calendar.querySelector('.year-list').innerHTML = '';
  }

  handleMonthClick(element: number) {
    if (!element) return;

    const { monthIndex, year, month } = this.f;

    monthIndex.setValue(Number(element) + 1);

    this.monthElement.classList.remove('show');

    this.generateCalendar(monthIndex.value - 1, year.value);
  }

  get month(): string | string[] {
    if (!this.f.monthIndex) return this.monthNames[this.currentDate.getMonth()];

    return this.monthNames[this.f.monthIndex.value - 1];
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

  protected get calendar(): any {
    return document.querySelector('.calendar');
  }

  protected get calendarDays(): any {
    return document.querySelectorAll('.calendar-days .bundle');
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

  dateFormater(date: Date): string {
    if (!date) return '';

    return date.toLocaleDateString(this.row.locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
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
    if(this.row.locale){
      this.monthNames = this.months.map((_, index) => {
        const date = new Date(this.currentDate.getFullYear(), index, 1);
        return date.toLocaleDateString(this.row.locale, { month: 'long' });
      });
    }
  }

  customDaysOfWeek() {
    if(this.row.locale){
      this.daysOfWeek = [] as string[];

      const date = new Date();

      for (const _ of new Array(7).fill(0)) {
        this.daysOfWeek.push(
          date.toLocaleDateString(this.row.locale, { weekday: 'narrow' })
        );
        date.setDate(date.getDate() + 1);
      }
    }
  }
}
